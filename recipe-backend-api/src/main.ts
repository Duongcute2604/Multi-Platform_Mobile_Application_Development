import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './common/response.interceptor';
import { AllExceptionsFilter } from './common/all-exceptions.filter';
import { layGocUpload } from './modules/uploads/upload-dir';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setGlobalPrefix('api/v1');

  // BR-UPLOAD: serve ảnh tại /uploads/<ten>.jpg
  // ĐẶT TRƯỚC setGlobalPrefix KHÔNG ảnh hưởng — static asset không đi qua router,
  // nên đường dẫn là /uploads/... chứ KHÔNG phải /api/v1/uploads/...
  // Đúng thứ mobile mong đợi: `layUrlAnh('/uploads/x.jpg')` nối origin -> origin + /uploads/x.jpg
  app.useStaticAssets(layGocUpload(), { prefix: '/uploads' });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // BR-API: bọc mọi response thành { success, data, error } và trả lỗi cùng
  // hình dạng. Thiếu 2 dòng này thì mobile (đọc envelope) không gọi được API:
  // `goiApi` đọc `success` trên body thô là undefined nên luôn ném lỗi.
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter());

  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Cookbook API')
    .setDescription('Online Recipe Management System API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Server running on http://localhost:${port}`);
  console.log(`Swagger docs: http://localhost:${port}/api/docs`);
}

bootstrap();
