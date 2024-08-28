import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, MinLength } from 'class-validator';

@InputType()
export class LoginInput {
  @Field(() => String, { nullable: true })
  @IsEmail()
  email: string;

  @Field(() => String, { nullable: true })
  @MinLength(3)
  fullName: string;
}
