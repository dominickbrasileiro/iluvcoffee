import { Injectable } from '@nestjs/common';
import { compare } from 'bcrypt';
import { SanitizedUser } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { ValidateUserDto } from './dto/validate-user.dto';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async validateUser(validateUserDto: ValidateUserDto): Promise<SanitizedUser> {
    const { email, password } = validateUserDto;

    const user = await this.usersService.findByEmail(email);

    if (!user) {
      return null;
    }

    const passwordMatches = await compare(password, user.password_hash);

    if (!passwordMatches) {
      return null;
    }

    const { password_hash, ...result } = user;
    return result;
  }
}
