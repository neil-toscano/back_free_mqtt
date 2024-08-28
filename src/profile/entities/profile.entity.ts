import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';

import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'profile' })
@ObjectType()
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column()
  @Field(() => String)
  fullName: string;

  @Column()
  @Field(() => String)
  description: string;

  @Column()
  @Field(() => String)
  url: string;

  @Column()
  @Field(() => String)
  phoneNumber: string;

  @OneToOne(() => User, (user) => user.profile, { nullable: false, lazy: true }) // specify inverse side as a second parameter
  @Field(() => User)
  user: User;
}
