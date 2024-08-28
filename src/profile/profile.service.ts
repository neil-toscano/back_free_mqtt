import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateProfileInput } from './dto/create-profile.input';
import { UpdateProfileInput } from './dto/update-profile.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from './entities/profile.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class ProfileService {
  private readonly logger = new Logger(ProfileService.name);
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    private readonly datasource: DataSource,
  ) {}

  async create(createProfileInput: CreateProfileInput) {
    try {
      const profile = this.profileRepository.create({
        ...createProfileInput,
      });

      const newProfile = await this.profileRepository.save(profile);
      return newProfile;
    } catch (error) {
      this.logger.log(error);
      throw new InternalServerErrorException('Something bad happened');
    }
  }

  findAll() {
    return `This action returns all profile`;
  }

  async findOne(id: string) {
    const profile = await this.profileRepository.findOne({
      where: {
        user: {
          id: id,
        },
      },
    });
    if (!profile) throw new NotFoundException(`Place with id ${id} not found`);
    return profile;
  }

  async update(id: string, updateProfileInput: UpdateProfileInput) {
    await this.profileRepository
      .createQueryBuilder()
      .update(Profile)
      .set({ ...updateProfileInput })
      .where('id = :id', { id: id })
      .execute();

    const profile = await this.profileRepository.findOne({
      where: {
        id: id,
      },
    });

    return profile;
  }

  remove(id: number) {
    return `This action removes a #${id} profile`;
  }
}
