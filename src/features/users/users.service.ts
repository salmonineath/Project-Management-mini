import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { Prisma } from 'generated/prisma/client';

@Injectable()
export class UsersService {
    private readonly SALT_ROUNDS = 10;

    constructor(private readonly prisma: PrismaService) {}

    private sanitize<T extends { password?: string }>(user: T) {
        if (!user) return user;
        const { password, ...safe } = user;
        return safe;
    }

    async create(dto: CreateUserDto) {
        const hashedPassword = await bcrypt.hash(dto.password, this.SALT_ROUNDS);
        try {
            const user = await this.prisma.user.create({
                data: { ...dto, password: hashedPassword },
            });
            return this.sanitize(user);
        } catch (error: any) {
            if (
                error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === "P2002"
            ) {
                throw new ConflictException("Email already in use");
            }
            throw error;
        }
    }

    async findAll() {
        const user = await this.prisma.user.findMany({
            orderBy: { createdAt: 'desc' },
        });
        return user.map((u) => this.sanitize(u));
    }
}
