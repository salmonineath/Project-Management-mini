import { Body, Controller, HttpCode, HttpStatus, Post, Get, Patch, Delete, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ResponseMessage } from '../../common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Throttle } from '@nestjs/throttler';

@UseGuards(JwtAuthGuard)
@Controller('api/v1/projects')
@Throttle({ default: { ttl: 60000, limit: 100 }})
export class ProjectsController {
    constructor(private readonly projectService: ProjectsService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ResponseMessage('Project create successfully')
    create(@CurrentUser() user: { sub: number }, @Body() dto: CreateProjectDto) {
        return this.projectService.create( user.sub, dto);
    }

    @Get('my-projects')
    @ResponseMessage('Get my project successfully')
    findByOwner(@CurrentUser() user: { sub: number } ) {
        return this.projectService.findByOwner(user.sub);
    }

    @Get(':id')
    @ResponseMessage('Get project by id successfully')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.projectService.findOne(id);
    }

    @Patch(':id')
    @ResponseMessage('Project updated successfully')
    update(
        @CurrentUser() user: {sub: number},
        @Param('id', ParseIntPipe)
        id: number,
        @Body() dto: UpdateProjectDto,
    ) {
        return this.projectService.update(id, dto, user.sub);
    }

    @Delete(':id')
    @ResponseMessage('Deleted project successfully')
    remove(
        @CurrentUser() user: { sub: number },
        @Param('id', ParseIntPipe)
        id: number
    ) {
        return this.projectService.remove(id, user.sub);
    }
}

