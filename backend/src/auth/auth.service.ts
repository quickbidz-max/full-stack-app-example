import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entity/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async signup(
    name: string,
    email: string,
    userName: string,
    password: string,
  ) {
    const existingUser = await this.userRepository.findOne({
      where: { email: email, userName: userName },
    });
    if (existingUser)
      throw new UnauthorizedException('Email or Username already used');

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = this.userRepository.create({
      name,
      email,
      userName,
      password: hashedPassword,
    });
    await this.userRepository.save(newUser);

    return {
      message: 'Signup successful',
    };
  }

  async login(emailOrUsername: string, password: string) {
    const user = await this.userRepository.findOne({
      where: [{ email: emailOrUsername }, { userName: emailOrUsername }],
    });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new UnauthorizedException('Invalid password');

    const payload = { email: user.email, sub: user.id };
    const token = this.jwtService.sign(payload);

    const { password: _, ...userWithoutPassword } = user;

    return {
      access_token: token,
      user: userWithoutPassword,
    };
  }

  async validate(token: string) {
    try {
      const validate = this.jwtService.verify(token);
      if (validate) {
        return { valid: true };
      }
      return { valid: false };
    } catch (error) {
      return { valid: false };
    }
  }
}
