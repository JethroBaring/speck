import { NestFactory, Reflector } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import { ResponseInterceptor } from "./common/interceptors/response.interceptor";
import { AllExceptionsFilter } from "./common/filters/http-exception.filter";
import {
	SwaggerModule,
	DocumentBuilder,
	SwaggerDocumentOptions,
} from "@nestjs/swagger";

async function bootstrap() {
	const app = await NestFactory.create(AppModule, {
		bodyParser: false,
	});
	const configService = app.get(ConfigService);
	const reflector = app.get(Reflector);
	app.enableCors({
		origin: configService.get<string>("FRONTEND_URL"),
		credentials: true,
		methods: ["GET", "POST", "PUT", "OPTIONS", "PATCH", "DELETE"],
		allowedHeaders: ["Content-Type", "Authorization", "x-goog-acl"],
	});
	// app.setGlobalPrefix('api');
	app.useGlobalInterceptors(new ResponseInterceptor(reflector));
	app.useGlobalFilters(new AllExceptionsFilter());
	const config = new DocumentBuilder()
		.setTitle("Intervly API")
		.setDescription("The cats API description")
		.build();

	const options: SwaggerDocumentOptions = {
		operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
	};
	const documentFactory = () =>
		SwaggerModule.createDocument(app, config, options);

	SwaggerModule.setup("swagger", app, documentFactory);
	await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
