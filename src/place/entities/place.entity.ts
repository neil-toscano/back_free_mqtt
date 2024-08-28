import { ObjectType, Field, Float, ID } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinTable,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PlaceImage } from './place-image.entity';
import { User } from 'src/users/entities/user.entity';

@ObjectType()
@Entity()
export class Place {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID, { description: 'Id' })
  id: string;

  @Column()
  @Field(() => String, { description: 'The name of the place' })
  titleText: string;

  @Column()
  @Field(() => String, { description: 'A description of the place' })
  descriptionPlace: string;

  @Column({ type: 'date' })
  @Field(() => String, { description: 'The date of event START' })
  dateEventStart: Date;

  @Column({ type: 'date' })
  @Field(() => String, { description: 'The date of event END' })
  dateEventEnd: Date;

  @Column()
  @Field(() => String, { description: 'The Time of visiting the place' })
  timeEvent: string;

  @Column()
  @Field(() => String, { description: 'The type of visiting the place' })
  typeEvent: string;

  @Column()
  @Field(() => String, { description: 'The type of transport' })
  typeTransport: string;

  @Column()
  @Field(() => String, {
    description: 'Number of people and guide in JSON format (parsed)',
  })
  cantidad: string;

  @Column()
  @Field(() => String, { description: 'Services provided' })
  services: string;

  @Column()
  @Field(() => String, { description: 'To-dos for the event' })
  todos: string;

  @Column()
  @Field(() => String, { description: 'Price list for visiting the place' })
  listPrice: string;

  @Column()
  @Field(() => Float, { description: 'Price of visiting the place' })
  price: number;

  @Column({
    type: 'boolean',
    default: false,
  })
  @Field(() => Boolean)
  isActive: boolean;

  @ManyToOne(() => User, (user) => user.places, { nullable: false, lazy: true })
  @Field(() => User)
  user: User;

  @OneToMany(() => PlaceImage, (placeImage) => placeImage.place, {
    cascade: true,
  })
  @Field(() => [PlaceImage], { description: 'list of images' })
  @JoinTable()
  images?: PlaceImage[];
}
