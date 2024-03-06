import { IsOptional } from "class-validator";

export class FilterUserDto{
    @IsOptional()
    role: string;
}