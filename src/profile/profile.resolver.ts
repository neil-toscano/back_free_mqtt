import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ProfileService } from './profile.service';
import { Profile } from './entities/profile.entity';
import { CreateProfileInput } from './dto/create-profile.input';
import { UpdateProfileInput } from './dto/update-profile.input';
import { GqlAuthGuard } from 'src/auth/guards/jwt-auth-guard';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';

@Resolver(() => Profile)
export class ProfileResolver {
  constructor(private readonly profileService: ProfileService) {}

  @Mutation(() => Profile)
  @UseGuards(GqlAuthGuard)
  createProfile(
    @Args('createProfileInput') createProfileInput: CreateProfileInput,
  ) {
    return this.profileService.create(createProfileInput);
  }

  @Query(() => [Profile], { name: 'find_all_profiles' })
  findAll() {
    return this.profileService.findAll();
  }

  @Query(() => Profile, { name: 'profile_find_one' })
  findOne(@CurrentUser() user: User) {
    return this.profileService.findOne(user.id);
  }

  @Query(() => Profile, { name: 'profile_find_by_user' })
  findByUserId(@Args('id', { type: () => String }) id: string) {
    return this.profileService.findOne(id);
  }

  @Mutation(() => Profile, { name: 'update_profile' })
  @UseGuards(GqlAuthGuard)
  async updateProfile(
    @Args('updateProfileInput') updateProfileInput: UpdateProfileInput,
  ) {
    return this.profileService.update(
      updateProfileInput.id,
      updateProfileInput,
    );
  }

  @Mutation(() => Profile, { name: 'updates' })
  @UseGuards(GqlAuthGuard)
  async updates(
    @Args('updateProfileInput') updateProfileInput: UpdateProfileInput,
  ) {
    console.log(updateProfileInput.id);
    return this.profileService.findOne('1234sfslf');
  }

  @Mutation(() => Profile)
  removeProfile(@Args('id', { type: () => Int }) id: number) {
    return this.profileService.remove(id);
  }
}
