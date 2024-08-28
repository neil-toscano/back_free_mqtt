import { InputType, Field } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class CreateProfileInput {
  @Field(() => String, { description: 'Name-profile' })
  @IsString()
  fullName: string;

  @Field(() => String, { description: 'Description-profile' })
  @IsString()
  description: string;

  @Field(() => String, { description: 'Url photo-profile' })
  @IsString()
  url: string;

  @Field(() => String, { description: 'Phone-Number' })
  @IsString()
  phoneNumber: string;
}
