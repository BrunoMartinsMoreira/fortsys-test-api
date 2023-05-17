import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'Nome é um campo obrigatório' })
  @IsString({ message: 'Nome deve ser uma string' })
  name: string;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'Preco é um campo obrigatório' })
  @IsNumber({}, { message: 'Preco deve ser um número' })
  @IsPositive({ message: 'Preço deve ser um número positivo' })
  @Min(0.1, { message: 'Preço deve ser maior que zero' })
  price: number;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'Quantidade é um campo obrigatório' })
  @IsNumber({}, { message: 'Quantidade deve ser um número' })
  @IsPositive({ message: 'Quantidade deve ser um número positivo' })
  @Min(1, { message: 'Quantidade deve ser no mínimo 1' })
  stockQuantity: number;
}
