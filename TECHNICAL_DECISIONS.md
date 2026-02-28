Decisiones Técnicas y Compromisos

1. Next.js App Router — Route Groups + Middleware
Decisión: Usar App Router con grupos de rutas (public) y (protected), y proteger las rutas en middleware.ts a nivel de Edge.
¿Por qué no Pages Router?
Los layouts por segmento del App Router son el modelo correcto para una app de dashboard: el grupo (public) renderiza un layout en blanco para /login, mientras que (protected) renderiza el shell completo con sidebar para /app/* — sin ningún impacto en la URL.
¿Por qué middleware y no un guard del lado del cliente?
Un redirect con useEffect muestra brevemente la página protegida antes de ejecutarse. El middleware corre en el Edge antes de que la página se renderice, haciendo la protección invisible e imposible de eludir desactivando JavaScript.
SSR vs fetch en el cliente:
Páginas como la lista de agentes cambian constantemente y necesitan invalidación de caché, estados de carga y actualizaciones optimistas — SSR/SSG no es la solución aquí. Los Server Components se usan donde no hay interactividad (layouts estáticos, el redirect de la ruta raíz). Los Client Components se usan donde existen estado y mutaciones.

2. MSW (Mock Service Worker)
Decisión: MSW en lugar de json-server, MirageJS o estado hardcodeado.
Por qué:

MSW intercepta a nivel de fetch — el código de la app llega al mismo apiClient que usaría con un backend real. Sin casos especiales.
Funciona de forma idéntica en el navegador (dev) y en Node.js (Playwright), por lo que los tests E2E usan exactamente las mismas definiciones de handlers.
Simulación realista de errores: 503 en ejecuciones de generación, 401 con autenticación incorrecta, latencia simulada en PATCH.
faker.seed(42) hace que la base de datos de 500 agentes sea determinista entre reinicios.


3. TanStack Query (React Query v5)
Decisión: TanStack Query para todos los datos remotos — no SWR, no Server Actions para queries.
Por qué:

Actualizaciones optimistas con rollback automático ante errores — esencial para el flujo de edición de agentes.
placeholderData: prev => prev — mantiene visible la página anterior mientras carga la siguiente, eliminando el parpadeo de la tabla.
Invalidación de caché granular — tras editar un agente, se sincroniza el caché del detalle inmediatamente y se invalida la lista. Tras una ejecución de generación, se invalidan tanto la lista de generaciones como la de agentes.
SWR tiene soporte más débil para mutaciones y actualizaciones optimistas. Los Server Actions son excelentes para mutaciones, pero no resuelven el ciclo de vida complejo de queries que necesitamos aquí.

Flujo de actualización optimista (edición de agente):

onMutate → cancelar queries en vuelo → snapshot del caché actual → aplicar cambio inmediatamente
onError → restaurar snapshot → mostrar toast de error
onSuccess → sincronizar con la respuesta del servidor → invalidar lista de agentes


4. TanStack Virtual
Decisión: Virtualizar la lista de agentes — renderizar solo las filas visibles.
Por qué importa:
Renderizar 500 filas en el DOM provoca jank real en el navegador: recálculos de layout, pintado, garbage collection. Con virtualización, solo hay ~10 filas en el DOM en cualquier momento, independientemente del tamaño del dataset.
Combinado con paginación del lado del servidor (50 por página), el peor escenario es 50 filas + buffer overscan: 10 = 60 filas en el DOM.
Compromiso: Las listas virtualizadas requieren un contenedor de scroll con altura explícita y tamaños de fila estimados. Esto añade complejidad de configuración, pero es el único enfoque correcto a escala.

5. Zustand para el Estado de Autenticación
Decisión: Zustand solo para el estado de auth. React Query gestiona todo el estado del servidor.
¿Por qué no Context?
React Context re-renderiza todos sus consumidores en cada actualización. El estado de auth vive en la raíz — una actualización de contexto cascadearía por todo el árbol.
¿Por qué no Redux Toolkit?
RTK es excelente para estado complejo con muchos slices. Para un único slice de auth con 3 campos y 2 acciones, es excesivo.
Estrategia de almacenamiento dual:

Zustand + persist → almacena user y token en localStorage para mantener la sesión entre recargas de página (lecturas del lado del cliente)
js-cookie → copia el token a una cookie regular para que middleware.ts pueda leerlo en el servidor a nivel de Edge

Ambos se mantienen perfectamente sincronizados: se setean juntos en el login, se limpian juntos en el logout.
Mejora para producción: En producción, el servidor establecería directamente una cookie httpOnly, eliminando la necesidad de escribir la cookie desde el cliente y haciendo el token inaccesible para JavaScript.

6. React Hook Form + Zod
Decisión: RHF para el estado del formulario, Zod para validación, conectados mediante @hookform/resolvers.
¿Por qué RHF?
Inputs no controlados por defecto — cero re-renders por pulsación de tecla. Para formularios complejos (el generador tiene 5+ campos incluyendo un slider y un toggle), esto importa.
¿Por qué Zod?
Los schemas se definen una vez y se reutilizan en tres lugares:

Validación en tiempo de ejecución (mediante el resolver de RHF)
Inferencia de tipos TypeScript (z.infer<typeof schema>) — elimina una declaración de interface separada
Tests unitarios — el mismo schema se importa en __tests__/schemas.test.ts

Esto convierte al schema en la única fuente de verdad para las reglas de validación.

7. Resumen de Decisiones de Performance
DecisiónMotivoplaceholderData: prev => prev en queries de listaSin parpadeo de tabla al cambiar de página o filtrosDebounce de 350ms en inputs de búsquedaEvita una query por cada pulsación de teclacancelQueries antes de la actualización optimistaEvita que respuestas lentas en vuelo sobreescriban el valor optimistaoverscan: 10 en el virtualizadorPre-renderiza filas fuera del viewport para evitar filas en blanco en scroll rápidostaleTime: 60s globalmenteEvita re-fetching de datos sin cambios al cambiar de pestaña o navegar hacia atrásreact-memo / evitar prop drillingNo se aplica en exceso — solo donde el profiling lo justificaría

8. Strictness en TypeScript
strict: true está habilitado en tsconfig.json. Patrones notables utilizados:

Sin any — todas las respuestas de la API están tipadas mediante interfaces en *.types.ts
z.infer<> para los tipos de valores de formulario — evita duplicar declaraciones de interfaces
Uniones discriminadas para AgentStatus y GenerationStatus
apiClient.get<T>() / apiClient.post<T>() genéricos — el tipo fluye desde el punto de llamada