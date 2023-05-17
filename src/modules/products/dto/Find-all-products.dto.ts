import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { FindAllParams } from 'src/commom/types/FindAllParams';

export class FindAllProductsDto extends FindAllParams {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: 'Campo nome deve ser uma string' })
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber({}, { message: 'Preco mínimo deve ser um número' })
  @Type(() => Number)
  minPrice?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber({}, { message: 'Preco máximo ser um número' })
  @Type(() => Number)
  maxPrice?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber({}, { message: 'Quantidade mínima deve ser um numero' })
  @Type(() => Number)
  minQuantity?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber({}, { message: 'Quantidade máxima deve ser um numero' })
  @Type(() => Number)
  maxQuantity?: number;
}
