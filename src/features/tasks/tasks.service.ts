import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient, Prisma } from '../../generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {

    constructor(private readonly prisma: PrismaService) {}

    private get prismaClient() : PrismaClient {
        return this.prisma as unknown as PrismaClient;
    }

    async create(projectId: number, dto: CreateTaskDto) {
        try {
            const createdTask = await this.prismaClient.tasks.create({
                data: {...dto, projectId}
            });
            return createdTask;
        } catch (error: any) {
            throw error;
        }
    }

    async findAll(projectId: number) {
        const tasks = await this.prismaClient.tasks.findMany({
            orderBy: { createdAt: 'desc'},
            where: { projectId }
        })
        return tasks;
    }

    async findOne(projectId: number, id: number) {
        const task = await this.prismaClient.tasks.findFirst({
            where: { id, projectId}
        })
        if (!task) throw new NotFoundException(`Task with this ${id} not found`)
        return task;
    }

    async update(id: number, dto: UpdateTaskDto) {
        try {
            const updatedTasks = await this.prismaClient.tasks.update({
                where: { id }, data: dto
            });
            return updatedTasks;
        } catch (error: any) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                throw new NotFoundException(`Task with id ${id} not found`)
            }
            throw error;
        }
    }

    async remove(id: number) {
        try {
            const removeTask = await this.prismaClient.tasks.delete({
                where: { id }
            });
            return removeTask;
        } catch (error: any) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                throw new NotFoundException(`Task with this id ${id} not found.`)
            }
            throw error;
        }
    }

}
