import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoginInput } from 'src/auth/dto/login.input';
import * as bcrypt from 'bcrypt';
import { ProfileService } from 'src/profile/profile.service';

@Injectable()
export class UsersService {
  private logger: Logger = new Logger(UsersService.name);
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly profileService: ProfileService,
  ) {}
  async create(signupInput: LoginInput): Promise<User> {
    try {
      const newProfile = await this.profileService.create({
        fullName: 'usuario-flexColor',
        description: 'excursión',
        url: 'https://cdn.quasar.dev/img/boy-avatar.png',
        phoneNumber: '#########',
      });
      const newUser = this.userRepository.create({
        ...signupInput,
        password: bcrypt.hashSync(':P', 10),
        profile: newProfile,
      });
      const user = await this.userRepository.save(newUser);

      return user;
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  findAll() {
    return `This action returns all users`;
  }

  async findOneByEmail(email: string): Promise<User> {
    try {
      return await this.userRepository.findOneBy({ email });
    } catch (error) {
      this.handleDBErrors({
        code: 'error-001',
        detail: `${email} not found`,
      });
    }
  }

  async findOneById(id: string): Promise<User> {
    try {
      return await this.userRepository.findOneByOrFail({ id });
    } catch (error) {
      throw new NotFoundException(`${id} not found`);
    }
  }

  handleDBErrors(error: any): never {
    this.logger.error(error);
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }
    if (error.code === 'error-001') {
      throw new BadRequestException(error.detail);
    }
    throw new InternalServerErrorException('Please check server logs');
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
