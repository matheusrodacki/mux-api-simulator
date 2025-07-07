import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilita CORS para permitir requisições do frontend
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`🚀 Simulador de API dos Muxes rodando na porta ${port}`);
  console.log(
    `📍 Sistemas disponíveis: J02, J04, J06, J08, J10, J12, J14, J16, J18 e J20`
  );
  console.log(`🔗 Exemplo: http://localhost:${port}/j02/api/v1/alarms/active`);
  console.log(`🔗 Health check: http://localhost:${port}/j02/health`);
}

bootstrap();
