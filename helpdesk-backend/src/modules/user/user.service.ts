import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
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
  constructor(private readonly userDAO: UserDAO) {}

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
    const [user]: User[] = await this.userDAO.getUserById(data.id);
    if (!user) {
      throw new NotFoundException(`No user found with id: ${data.id}`);
    }
    let newPassword: string | null = null;
    if (data.password) {
      newPassword = await argon2.hash(data.password);
    }
    const updatedUser: User = {
      user_id: user.user_id,
      name: data.name ?? user.name,
      email: user.email,
      password: newPassword ?? user.password,
      pfp: data.pfp ?? user.pfp,
      role: user.role,
      role_id: user.role_id,
      last_logout: data.last_logout ?? user.last_logout,
      working_hours: data.working_hours ?? user.working_hours,
    };
    return this.userDAO.updateUser(updatedUser);
  }

  public async getUser(data: UserGetDto): Promise<User | null> {
    let user: User | null = null;
    if (!data.id) {
      const [result] = await this.userDAO.getUserByEmail(data.email);
      user = result;
    } else {
      const [result] = await this.userDAO.getUserById(data.id);
      user = result;
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

  public async deleteUser(id: User['user_id']): Promise<boolean> {
    const [user] = await this.userDAO.getUserById(id);
    if (!user) {
      throw new NotFoundException(`No user found with id: ${id}`);
    }
    if (user.role == 'admin') {
      const adminCount = await this.listUser('admin');
      if (adminCount.length == 1) {
        throw new BadRequestException(
          'Cannot delete the last existing admin account, create another first',
        );
      }
    }
    const result = await this.userDAO.deleteUser(id);
    if (!result) {
      throw new InternalServerErrorException(
        'Something went wrong while trying to delete user',
      );
    }
    return true;
  }
}
