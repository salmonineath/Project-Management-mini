import { Body, Controller, HttpCode, HttpStatus, Post, Get, Patch, Delete, Param, ParseIntPipe } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ResponseMessage } from 'src/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Controller('api/v1/projects')
export class ProjectsController {
    constructor(private readonly projectService: ProjectsService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ResponseMessage('Project create successfully')
    create(@Body() dto: CreateProjectDto) {
        return this.projectService.create( 1, dto);
    }

    @Get()
    @ResponseMessage('Get project successfully')
    findAll() {
        return this.projectService.findAll();
    }

    @Get(':id')
    @ResponseMessage('Get project by id successfully')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.projectService.findOne(id);
    }

    // @Get(':ownerId')
    // @ResponseMessage('Get your project successfully')
    // findByOwner(@Param('ownerId', ParseIntPipe) ownerId: number) {
    //     return this.projectService.findByOwner(ownerId);
    // }

    @Patch(':id')
    @ResponseMessage('Project updated successfully')
    update(
        @Param('id', ParseIntPipe)
        id: number,
        @Body() dto: UpdateProjectDto,
    ) {
        return this.projectService.update(id, dto);
    }

    @Delete(':id')
    @ResponseMessage('Deleted project successfully')
    remove(
        @Param('id', ParseIntPipe)
        id: number
    ) {
        return this.projectService.remove(id);
    }
}

