import { authHandlers } from "./auth.handlers";
import { agentHandlers } from "./agent.handlers";
import { resourceHandlers } from "./resource.handlers";
import { generationHandlers } from "./generation.handlers";

export const handlers = [
	...authHandlers,
	...agentHandlers,
	...resourceHandlers,
	...generationHandlers,
];
