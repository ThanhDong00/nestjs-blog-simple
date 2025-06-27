import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { PostsModule } from './posts/posts.module';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { AuthModule } from './auth/auth.module';
import { RolesGuard } from './common/guards/roles.guard';
import { AuthGuard } from './common/guards/auth.guard';

@Module({
  imports: [DatabaseModule, UsersModule, PostsModule, AuthModule],
  providers: [
    {
      // Register the global exception filter
      // This use class to provide the HttpExceptionFilter
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*'); // Apply to all routes
  }
}
