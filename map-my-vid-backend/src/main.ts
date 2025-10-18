import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { AppModule } from './app.module.js'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { GlobalExceptionFilter } from './common/filters/global-exception.filter.js'
import helmet from 'helmet'
import { helmetConfig, helmetDevConfig } from './config/helmet.config.js'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // Security headers with Helmet - use different config based on environment
  const isDevelopment = process.env.NODE_ENV === 'development'
  app.use(helmet(isDevelopment ? helmetDevConfig : helmetConfig))

  app.enableCors()
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))
  app.useGlobalFilters(new GlobalExceptionFilter())

  const config = new DocumentBuilder()
    .setTitle('Map My Vid API')
    .setDescription('API documentation for Map My Vid')
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'bearer')
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api/docs', app, document)

  await app.listen(process.env.PORT || 3000)
  console.log(`🚀 Application is running on: http://localhost:${process.env.PORT || 3000}`)
}
bootstrap()
