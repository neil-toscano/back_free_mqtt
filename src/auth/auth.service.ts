import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginInput } from './dto/login.input';
import { AuthResponse } from './types/auth-response.type';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(loginInput: LoginInput): Promise<AuthResponse> {
    const { email } = loginInput;

    let user = await this.userService.findOneByEmail(email);
    if (!user) {
      user = await this.userService.create(loginInput);
    }

    const token = this.getJwtToken(user.id);

    return {
      token,
      user,
    };
  }

  async lookUp(user: User): Promise<AuthResponse> {
    const token = this.getJwtToken(user.id);

    return {
      token,
      user,
    };
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
  async validateUser(id: string): Promise<User> {
    const user = await this.userService.findOneById(id);
    if (!user.isActive) throw new UnauthorizedException(`user is inactive`);
    delete user.password;
    return user;
  }
  private getJwtToken(userId: string) {
    const token = this.jwtService.sign({ id: userId });
    return token;
  }
}
