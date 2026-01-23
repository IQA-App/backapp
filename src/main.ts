import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   app.setGlobalPrefix('api');

//   const config = new DocumentBuilder()
//     .setTitle('Backapp API')
//     .setDescription('The Backapp API description')
//     .setVersion('1.0')
//     .addBearerAuth({
//       type: 'http',
//       scheme: 'bearer',
//       description: 'Use token from POST /login or POST /user',
//     })
//     .build();
//   const document = SwaggerModule.createDocument(app, config);
//   SwaggerModule.setup('api/docs', app, document);

//   //  trying to use custom decorators
//   app.useGlobalPipes(
//     new ValidationPipe({
//       transform: true,
//       validateCustomDecorators: true,
//       transformOptions: {
//         // to make transform work
//         enableImplicitConversion: true,
//       },
//       whitelist: true,
//     }),
//   );

//   useContainer(app.select(AppModule), { fallbackOnErrors: true });

//   await app.listen(3000);
// }
// bootstrap();

//  option API-42 branch
async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);

    app.enableCors();

    app.setGlobalPrefix('api');

    const config = new DocumentBuilder()
      .setTitle('Backapp API')
      .setDescription('The Backapp API description')
      .setVersion('1.0')
      .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        description: 'Use token from POST /login or POST /user',
      })
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);

    //  trying to use custom decorators
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        validateCustomDecorators: true,
        transformOptions: {
          // to make transform work
          enableImplicitConversion: true,
        },
        whitelist: true,
      }),
    );

    useContainer(app.select(AppModule), { fallbackOnErrors: true });
    const port = process.env.PORT || 3000;

    await app.listen(port, '0.0.0.0');

    console.log(`Application is running on port ${port}`);
  } catch (error) {
    console.error('Fatal error during start:', error);
    process.exit(1);
  }
}
bootstrap();
