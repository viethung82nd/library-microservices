import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: '127.0.0.1',
      port: 4002,
    },
  });

  await app.startAllMicroservices();

  await app.listen(3002);

  console.log('HTTP: http://localhost:3002');
  console.log('TCP : localhost:4002');
}

bootstrap();
