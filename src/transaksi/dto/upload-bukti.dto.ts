import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class uploadBuktiDto{
    @ApiProperty({format:'binary'})
    @IsOptional()
    bukti: string;
}