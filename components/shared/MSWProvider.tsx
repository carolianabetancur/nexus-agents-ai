"use client";

import { useEffect, useState } from "react";

export function MSWProvider({ children }: { children: React.ReactNode }) {
  const [mswReady, setMswReady] = useState(
    process.env.NODE_ENV !== "development",
  );

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;

    import("@/mocks/browser").then(({ worker }) => {
      worker
        .start({
          onUnhandledRequest: "bypass",
          serviceWorker: {
            url: "/mockServiceWorker.js",
          },
        })
        .then(() => {
          setMswReady(true);
        });
    });
  }, []);

  // Block rendering until MSW service worker is registered and active.
  // This prevents any fetch from escaping to the network before handlers are ready.
  if (!mswReady) return null;

  return <>{children}</>;
}
