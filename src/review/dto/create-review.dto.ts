import { IsString, IsNumber, Min, Max } from "class-validator";
export class CreateReviewDto {

  @IsString()
  name: string;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @Min(1, { message: 'Рейтинг не может быть менее одного!'})
  @Max(5, { message: 'Рейтинг не может быть более пяти!'})
  @IsNumber()
  rating: number;

  @IsString()
  productId: string;
}