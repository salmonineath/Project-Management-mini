import { Module } from '@nestjs/common';
import { AuthModule } from './features/auth/auth.module';
import { UsersModule } from './features/users/users.module';
import { ProjectsModule } from './features/projects/projects.module';
import { TasksModule } from './features/tasks/tasks.module';

@Module({
  imports: [AuthModule, UsersModule, ProjectsModule, TasksModule],
})
export class AppModule {}