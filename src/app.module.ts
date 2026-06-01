import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard} from '@nestjs/throttler';
import { AppController } from './app.controller';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './features/auth/auth.module';
import { UsersModule } from './features/users/users.module';
import { ProjectsModule } from './features/projects/projects.module';
import { TasksModule } from './features/tasks/tasks.module';

@Module({
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
  imports: [PrismaModule, AuthModule, UsersModule, ProjectsModule, TasksModule,
    ThrottlerModule.forRoot([{
      name: 'default',
      ttl: 60000,
      limit: 100  // 100 request per Ip per minute
    },
  {
    name: 'auth',
    ttl: 60000,
    limit: 5, // 5 request per ip per minute (For login and register)
  }])
  ],
  controllers: [AppController],
})
export class AppModule {}
