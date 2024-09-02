import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { PlaceService } from './place.service';
import { Place } from './entities/place.entity';
import { CreatePlaceInput } from './dto/create-place.input';
import { UpdatePlaceInput } from './dto/update-place.input';
import { SearchPlaceInput } from './dto/search-place.input';
import { GqlAuthGuard } from 'src/auth/guards/jwt-auth-guard';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';

@Resolver(() => Place)
export class PlaceResolver {
  constructor(private readonly placeService: PlaceService) {}

  @Mutation(() => Place)
  @UseGuards(GqlAuthGuard)
  async createPlace(
    @Args('createPlaceInput') createPlaceInput: CreatePlaceInput,
    @CurrentUser() user: User,
  ) {
    return this.placeService.create(createPlaceInput, user);
  }

  @Query(() => [Place], { name: 'getAllPlaces' })
  async findAll(): Promise<Place[]> {
    return this.placeService.findAll();
  }

  @Query(() => [Place], { name: 'getMyPlaces' })
  @UseGuards(GqlAuthGuard)
  async findMyPlaces(@CurrentUser() user: User): Promise<Place[]> {
    return this.placeService.findMyPlaces(user);
  }

  @Query(() => Place, { name: 'getById' })
  findOne(@Args('id', { type: () => String }) id: string): Promise<Place> {
    return this.placeService.findOne(id);
  }

  @Query(() => [Place], { name: 'getByTerm' })
  async findByTerm(
    @Args('searchPlaceInput') searchPlaceInput: SearchPlaceInput,
  ): Promise<Place[]> {
    console.log(searchPlaceInput);
    return this.placeService.findByTerm(searchPlaceInput);
  }

  @Mutation(() => Place)
  @UseGuards(GqlAuthGuard)
  updatePlace(@Args('updatePlaceInput') updatePlaceInput: UpdatePlaceInput) {
    return this.placeService.update(updatePlaceInput.id, updatePlaceInput);
  }

  @Mutation(() => String)
  removePlace(@Args('id', { type: () => String }) id: string) {
    return this.placeService.remove(id);
  }
}
