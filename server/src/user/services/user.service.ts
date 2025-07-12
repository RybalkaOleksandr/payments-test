import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { IUser } from '../types';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import * as fs from 'fs';
import * as path from 'path';
import { users } from '../users';
import { stripe } from 'src/clients';

@Injectable()
export class UserService {
  private userStorage: IUser[] = [...users];
  private readonly usersFilePath = path.join(__dirname, '../users.ts');

  private async saveToFile(): Promise<void> {
    const usersString = this.userStorage
      .map(
        (user) => `  {
    id: '${user.id}',
    email: '${user.email}',
    firstName: '${user.firstName}',
    lastName: '${user.lastName}',
    phone: '${user.phone || ''}',
    createdAt: new Date('${user.createdAt.toISOString()}'),
    updatedAt: new Date('${user.updatedAt.toISOString()}'),
  }`,
      )
      .join(',\n');

    const fileContent = `import { IUser } from './types';

export const users: IUser[] = [
${usersString}
];
`;

    try {
      await fs.promises.writeFile(this.usersFilePath, fileContent, 'utf8');
    } catch (error) {
      console.error('Error saving users to file:', error);
      throw new Error('Failed to save users to file');
    }
  }

  async create(createUserDto: CreateUserDto): Promise<IUser> {
    const existingUser = this.userStorage.find(
      (user) => user.email === createUserDto.email,
    );

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const newUser: IUser = {
      id: this.generateId(),
      ...createUserDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const stripeCustomer = await stripe.customers.create({
      email: newUser.email,
      name: `${newUser.firstName} ${newUser.lastName}`,
      metadata: {
        userId: newUser.id,
      },
    });

    this.userStorage.push({
      ...newUser,
      stripeCustomerId: stripeCustomer.id,
    });

    await this.saveToFile();

    return newUser;
  }

  async findAll(): Promise<IUser[]> {
    return this.userStorage;
  }

  async findOne(id: string): Promise<IUser> {
    const user = this.userStorage.find((user) => user.id === id);

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async findByEmail(email: string): Promise<IUser | null> {
    const user = this.userStorage.find((user) => user.email === email);
    return user || null;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<IUser> {
    const userIndex = this.userStorage.findIndex((user) => user.id === id);

    if (userIndex === -1) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (updateUserDto.email) {
      const existingUser = this.userStorage.find(
        (user) => user.email === updateUserDto.email && user.id !== id,
      );

      if (existingUser) {
        throw new ConflictException('User with this email already exists');
      }
    }

    const updatedUser: IUser = {
      ...this.userStorage[userIndex],
      ...updateUserDto,
      updatedAt: new Date(),
    };

    await stripe.customers.update(updatedUser.stripeCustomerId, {
      ...(updateUserDto.email && { email: updateUserDto.email }),
      ...(updateUserDto.firstName && {
        name: `${updateUserDto.firstName} ${updateUserDto.lastName}`,
      }),
    });

    this.userStorage[userIndex] = updatedUser;
    await this.saveToFile();
    return updatedUser;
  }

  async remove(id: string): Promise<void> {
    const userIndex = this.userStorage.findIndex((user) => user.id === id);

    if (userIndex === -1) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    this.userStorage.splice(userIndex, 1);
    await this.saveToFile();
  }

  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }
}
