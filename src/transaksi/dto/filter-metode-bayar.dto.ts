import { IsOptional } from "class-validator";

export class FilterMetodeBayar{
    @IsOptional()
    metode_bayar: string;
}