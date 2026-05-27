import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Prisma, PrismaClient } from '../../generated/prisma/client';

@Injectable()
export class ProjectsService {

    constructor(private readonly prisma: PrismaService) {}

    private get prismaClient(): PrismaClient {
        return this.prisma as unknown as PrismaClient;
    }

    async create(ownerId: number, dto: CreateProjectDto) {
        try {
            const createdProject = await this.prismaClient.project.create({
                data: {...dto, ownerId}
            });
            return createdProject;
        } catch (error: any) {
            throw error;
        }
    }

    async findAll() {
        const projects = await this.prismaClient.project.findMany({
            orderBy: { createdAt: 'desc'},
        });
        return projects;
    }

    async findOne(id: number) {
        const projectId = await this.prismaClient.project.findUnique({ where: { id } });
        if (!projectId) throw new NotFoundException(`Project with id ${id} not found`);
        return projectId;
    }

    async findByOwner(ownerId: number) {
        return this.prismaClient.project.findMany({ where: { ownerId } });
    }

    async update(id: number, dto: UpdateProjectDto) {
        try {
            const updatedProject = await this.prismaClient.project.update({
                where: { id }, data: dto 
            });
            return updatedProject;
        } catch (error: any) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw new NotFoundException(`Project with id ${id} not found.`);
                }
            }
            throw error;
        }
    }

    async remove(id: number) {
        try {
            const removedProject = await this.prismaClient.project.delete({ where: { id } });
            return removedProject;
        } catch (error: any) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                throw new NotFoundException(`Project with Id ${id} not found.}`);
            }
            throw error;
        }
    }
}
