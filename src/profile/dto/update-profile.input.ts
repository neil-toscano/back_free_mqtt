import { IsUUID } from 'class-validator';
import { CreateProfileInput } from './create-profile.input';
import { InputType, Field, ID, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateProfileInput extends PartialType(CreateProfileInput) {
  @Field(() => ID)
  @IsUUID()
  id: string;
}
