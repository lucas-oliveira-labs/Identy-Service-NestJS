import { ArrayNotEmpty, IsArray, IsInt, Min } from 'class-validator';


export class AssignRolesToUserDto {
    @IsArray()
    @ArrayNotEmpty()
    @IsInt({ each: true })
    @Min(1, { each: true })
    roleIds!: number[];
}