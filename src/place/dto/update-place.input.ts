import { IsUUID } from 'class-validator';
import { CreatePlaceInput } from './create-place.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdatePlaceInput extends PartialType(CreatePlaceInput) {
  @Field(() => String)
  @IsUUID()
  id: string;
}
