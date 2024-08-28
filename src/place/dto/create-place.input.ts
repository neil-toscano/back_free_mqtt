import { InputType, Field, Float } from '@nestjs/graphql';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

@InputType()
export class CreatePlaceInput {
  @Field(() => String, { description: 'The name of the place' })
  @IsString()
  @MinLength(3)
  @IsNotEmpty()
  titleText: string;

  @Field(() => String, { description: 'A description of the place' })
  @MinLength(3)
  @IsNotEmpty()
  @IsString()
  descriptionPlace: string;

  @Field(() => Date, { description: 'The START date of the event' })
  @IsNotEmpty()
  @IsDate()
  dateEventStart: Date;

  @Field(() => Date, {
    description: 'The END date of the event dateString 2024-5-5',
  })
  @IsNotEmpty()
  @IsDate()
  dateEventEnd: Date;

  @Field(() => String, { description: 'Time of the event' })
  @IsNotEmpty()
  @IsString()
  timeEvent: string;

  @Field(() => String, { description: 'Type of the event ' })
  @IsNotEmpty()
  @IsString()
  typeEvent: string;

  @Field(() => String, { description: 'Type of transport' })
  @IsNotEmpty()
  @IsString()
  typeTransport: string;

  @Field(() => String, {
    description: 'Number of people and guide in JSON format (parsed)',
  })
  @IsNotEmpty()
  @IsString()
  cantidad: string;

  @Field(() => String, { description: 'Services provided' })
  @IsNotEmpty()
  @IsString()
  services: string;

  @Field(() => String, { description: 'To-dos for the event' })
  @IsNotEmpty()
  @IsString()
  todos: string;

  @Field(() => String, { description: 'The price of visiting the place-list' })
  @IsNotEmpty()
  @IsString()
  listPrice: string;

  @Field(() => Float, { description: 'The price of visiting the place' })
  @IsNotEmpty()
  @IsPositive()
  @Min(0)
  @IsInt()
  price: number;

  @Field(() => Boolean, { description: 'is active the place' })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @Field(() => [String], { nullable: true })
  @IsArray()
  @IsString({ each: true })
  images?: string[];
}
