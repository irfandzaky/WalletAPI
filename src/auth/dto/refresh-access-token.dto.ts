import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";

export class refreshAccessTokenDto{
    @ApiProperty()
    @IsNotEmpty()
    refresh_token: string;
}