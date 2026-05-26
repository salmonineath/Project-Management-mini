import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './features/auth/auth.module';
import { UsersModule } from './features/users/users.module';
import { ProjectsModule } from './features/projects/projects.module';
import { TasksModule } from './features/tasks/tasks.module';

@Module({
  imports: [PrismaModule, AuthModule, UsersModule, ProjectsModule, TasksModule],
  controllers: [AppController],
})
export class AppModule {}
