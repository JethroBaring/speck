import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from "@nestjs/config";
import { ResponseInterceptor } from "./common/interceptors/response.interceptor";
import { AllExceptionsFilter } from "./common/filters/http-exception.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false
  });
  const configService = app.get(ConfigService);
  const reflector = app.get(Reflector)
  app.enableCors({
    origin: configService.get<string>('FRONTEND_URL'),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'OPTIONS', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-goog-acl'],
  });
  // app.setGlobalPrefix('api');
  app.useGlobalInterceptors(new ResponseInterceptor(reflector));
  app.useGlobalFilters(new AllExceptionsFilter());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
