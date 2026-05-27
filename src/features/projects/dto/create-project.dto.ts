import { IsDateString, IsOptional, IsString } from "class-validator";

export class CreateProjectDto {
    @IsString()
    title: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsDateString()
    deadline?: string;
}