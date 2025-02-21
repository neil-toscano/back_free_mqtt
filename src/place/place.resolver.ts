import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { PlaceService } from './place.service';
import { Place } from './entities/place.entity';
import { CreatePlaceInput } from './dto/create-place.input';
import { UpdatePlaceInput } from './dto/update-place.input';

@Resolver(() => Place)
export class PlaceResolver {
  constructor(private readonly placeService: PlaceService) {}

  @Mutation(() => Place)
  async createPlace(
    @Args('createPlaceInput') createPlaceInput: CreatePlaceInput,
  ) {
    return this.placeService.create(createPlaceInput);
  }

  @Query(() => [Place], { name: 'getAllPlaces' })
  async findAll(): Promise<Place[]> {
    return this.placeService.findAll();
  }

  @Query(() => Place, { name: 'getById' })
  findOne(@Args('id', { type: () => String }) id: string): Promise<Place> {
    return this.placeService.findOne(id);
  }

  @Mutation(() => Place)
  updatePlace(@Args('updatePlaceInput') updatePlaceInput: UpdatePlaceInput) {
    return this.placeService.update(updatePlaceInput.id, updatePlaceInput);
  }

  @Mutation(() => String)
  removePlace(@Args('id', { type: () => String }) id: string) {
    return this.placeService.remove(id);
  }
}
