import { ConsoleLogger, Logger } from "@nestjs/common";

export class LoggerProviderService extends Logger {
  private readonly logger;
  constructor() {
    super();
    this.logger = new ConsoleLogger();
  }

  log(context: string, message: string, method?: string | null, data?: any) {
    const msg: string = data
      ? `${method ? "method: " + method : ""} : ${message} : ${JSON.stringify(
          data
        )}`
      : `${method ? "method: " + method : ""} : ${message}`;
    this.logger.log(msg, context);
  }

  error(context: string, message: string, trace?: string, ) {
    this.logger.error(message, trace, context);
  }

  warn(message: string, context?: string) {
    this.logger.warn(message, context);
  }

  debug(message: string, context?: string) {
    this.logger.debug(message, context);
  }
}
