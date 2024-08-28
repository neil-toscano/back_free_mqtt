import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Place } from 'src/place/entities/place.entity';
import { Profile } from 'src/profile/entities/profile.entity';

import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'users' })
@ObjectType()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column()
  @Field(() => String)
  fullName: string;

  @Column({ unique: true })
  @Field(() => String)
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'text',
    array: true,
    default: ['user'],
  })
  @Field(() => [String])
  roles: string[];

  @Column({
    type: 'boolean',
    default: true,
  })
  @Field(() => Boolean)
  isActive: boolean;

  @OneToMany(() => Place, (place) => place.user, { lazy: true })
  places: Place[];

  @OneToOne(() => Profile, (profile) => profile.user, { lazy: true }) // specify inverse side as a second parameter
  @JoinColumn()
  profile: Profile;
}
