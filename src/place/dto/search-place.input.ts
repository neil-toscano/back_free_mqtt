import { InputType, Field, Float } from '@nestjs/graphql';
import {
  IsDate,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

@InputType()
export class SearchPlaceInput {
  @Field(() => String, {
    nullable: true,
    description: 'The name of the place',
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  titleText?: string;

  @Field(() => Date, {
    nullable: true,
    description: 'The START date of the event',
  })
  @IsOptional()
  @IsDate()
  dateEventStart?: Date;

  @Field(() => Date, {
    nullable: true,
    description: 'The END date of the event dateString 2024-5-5',
  })
  @IsOptional()
  @IsDate()
  dateEventEnd?: Date;

  @Field(() => String, {
    nullable: true,
    description: 'Type of the event ',
  })
  @IsOptional()
  @IsString()
  typeEvent?: string;

  @Field(() => Float, {
    nullable: true,
    description: 'The price of visiting the place',
  })
  @IsOptional()
  @IsPositive()
  @Min(0)
  @IsInt()
  price?: number;
}
