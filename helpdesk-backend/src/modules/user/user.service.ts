import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { UserDAO } from 'src/database/dao/user.dao';
import argon2 from 'argon2';
import { User } from 'src/database/dao/interface';
import { randomUUID } from 'node:crypto';
import {
  AdminDto,
  ClientDto,
  TechnicianDto,
  UserGetDto,
  UserUpdateDto,
} from './dto';

@Injectable()
export class UserService {
  constructor(
    private readonly userDAO: UserDAO,
    private readonly logger: Logger,
  ) {}

  private async userAlreadyExists(email: User['email']): Promise<boolean> {
    const checkEmail = await this.userDAO.getUserByEmail(email);
    if (checkEmail.length == 0) {
      return false;
    }
    return true;
  }

  public async addAdmin(data: AdminDto): Promise<boolean> {
    if (await this.userAlreadyExists(data.email)) {
      throw new BadRequestException(
        `User already exists with email: ${data.email}`,
      );
    }
    const passwordHash = await argon2.hash(data.password);
    const admin: User = {
      name: data.name,
      email: data.email,
      password: passwordHash,
      user_id: randomUUID(),
      role_id: randomUUID(),
      role: 'admin',
    };
    return await this.userDAO.addAdmin(admin);
  }

  public async addClient(data: ClientDto): Promise<boolean> {
    if (await this.userAlreadyExists(data.email)) {
      throw new BadRequestException(
        `User already exists with email: ${data.email}`,
      );
    }
    const passwordHash = await argon2.hash(data.password);
    const client: User = {
      name: data.name,
      email: data.email,
      password: passwordHash,
      user_id: randomUUID(),
      role_id: randomUUID(),
      role: 'client',
    };
    return await this.userDAO.addClient(client);
  }

  public async addTechnician(data: TechnicianDto): Promise<boolean> {
    if (await this.userAlreadyExists(data.email)) {
      throw new BadRequestException(
        `User already exists with email: ${data.email}`,
      );
    }
    const passwordHash = await argon2.hash(data.password);
    const technician: User = {
      name: data.name,
      email: data.email,
      password: passwordHash,
      user_id: randomUUID(),
      role_id: randomUUID(),
      role: 'technician',
      working_hours: data.working_hours,
    };
    return await this.userDAO.addTechnician(technician);
  }

  public async updateUser(data: UserUpdateDto): Promise<boolean> {
    const user: User[] = await this.userDAO.getUserById(data.id);
    if (!user[0].user_id) {
      throw new NotFoundException(`No user found with id: ${data.id}`);
    }
    let newPassword: string | null = null;
    if (data.password) {
      newPassword = await argon2.hash(data.password);
    }
    const updatedUser: User = {
      user_id: user[0].user_id,
      name: data.name ?? user[0].name,
      email: user[0].email,
      password: newPassword ?? user[0].password,
      pfp: data.pfp ?? user[0].pfp,
      role: user[0].role,
      role_id: user[0].role_id,
      working_hours: data.working_hours ?? user[0].working_hours,
    };
    return this.userDAO.updateUser(updatedUser);
  }

  public async getUser(data: UserGetDto): Promise<User | null> {
    let user: User | null = null;
    if (!data.id) {
      const result = await this.userDAO.getUserByEmail(data.email);
      user = result[0];
    } else {
      const result = await this.userDAO.getUserById(data.id);
      user = result[0];
    }
    if (user && user.user_id) {
      user.password = undefined;
      return user;
    }
    return null;
  }

  public async listUser(param: User['role'] | 'all'): Promise<User[]> {
    if (
      param == 'admin' ||
      param == 'client' ||
      param == 'technician' ||
      param == 'all'
    ) {
      const result = this.userDAO.listUsers(param);
      return result;
    } else {
      throw new NotFoundException(
        `User service received invalid parameter, try 'all' or a user role.`,
      );
    }
  }
}
