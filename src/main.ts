import { NestFactory } from "@nestjs/core";
import { AppModule } from "./modules/app.module";
import { ConsoleLogger, Logger } from "@nestjs/common";
import { AppConfigService } from "./config/app/app.config.service";
import { SwaggerConfigService } from "./config/openapi/swagger/swagger.config.service";
import { SwaggerConfigModule } from "./config/openapi/swagger/swagger.config.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger({
      context: "Main",
      timestamp: true,
      logLevels: ["log", "error", "warn", "debug", "verbose"],
    }),
  });
  const appConfig: AppConfigService = app.get(AppConfigService);
  const swaggerConfig: SwaggerConfigService = app.get(SwaggerConfigService);
  if (["local", "development"].includes(appConfig.env)) {
    const swagger: SwaggerConfigModule = new SwaggerConfigModule(swaggerConfig);
    swagger.setup(app);
  }

  app.setGlobalPrefix("api/v1");
  await app.listen(appConfig.port ?? 3000);
}
bootstrap()
  .then(() => {
    const { APP_PORT } = process.env;
    Logger.log(`Server running on port ${APP_PORT}`);
  })
  .catch((error) => {
    Logger.error("Error starting server", error);

  });
