import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { TasksService } from './tasks.service';
import { ResponseMessage } from 'src/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@UseGuards(JwtAuthGuard)
@Controller('api/v1/projects/:projectId/tasks')
export class TasksController {
    constructor(private readonly taskService: TasksService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ResponseMessage('Task created successfully')
    create(@Param('projectId', ParseIntPipe) projectId: number, @Body() dto: CreateTaskDto) {
        return this.taskService.create(projectId, dto);
    }

    @Get()
    @ResponseMessage('Get task successfully')
    findAll(
        @Param('projectId', ParseIntPipe) projectId: number
    ) {
        return this.taskService.findAll(projectId);
    }

    @Get(':id')
    @ResponseMessage('Get task successfully')
    findOne(
        @Param('projectId', ParseIntPipe) projectId: number,
        @Param('id', ParseIntPipe) id: number
    ) {
        return this.taskService.findOne(projectId, id);
    }

    @Patch(':id')
    @ResponseMessage('Task updated successfully')
    update(
        @Param('id',  ParseIntPipe) id: number,
        @Body() dto: UpdateTaskDto
    ) {
        return this.taskService.update(id, dto);
    }

    @Delete(':id')
    @ResponseMessage('Task removed successfully')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.taskService.remove(id);
    }
}
