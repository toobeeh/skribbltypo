import { LoggerService } from "./logger.service";

export const loggerFactory = Symbol("loggerFactory");

export interface loggerFactory {
  (context: object): LoggerService;
}