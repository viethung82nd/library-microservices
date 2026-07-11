import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  // HTTP Application
  const app = await NestFactory.create(AppModule);

  // TCP Microservice
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: '127.0.0.1',
      port: 4001,
    },
  });

  await app.startAllMicroservices();

  // HTTP Port
  await app.listen(3001);

  console.log('HTTP Server: http://localhost:3001');
  console.log('TCP Server : localhost:4001');
}

bootstrap();
