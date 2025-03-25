import type { LoggerService } from "./logger.service";

export const loggerFactory = Symbol("loggerFactory");

export type loggerFactory = (context: object) => LoggerService;