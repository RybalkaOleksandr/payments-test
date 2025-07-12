import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { stripe } from 'src/clients';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Проверяем, существует ли пользователь с таким email
    const existingUser = await this.userModel.findOne({
      email: createUserDto.email,
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Создаем Stripe клиента
    const stripeCustomer = await stripe.customers.create({
      email: createUserDto.email,
      name: `${createUserDto.firstName} ${createUserDto.lastName}`,
    });

    // Создаем пользователя в MongoDB
    const newUser = new this.userModel({
      ...createUserDto,
      stripeCustomerId: stripeCustomer.id,
    });

    return await newUser.save();
  }

  async findAll(): Promise<User[]> {
    return await this.userModel.find().exec();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userModel.findOne({ email }).exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userModel.findById(id).exec();

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Проверяем, не занят ли email другим пользователем
    if (updateUserDto.email) {
      const existingUser = await this.userModel.findOne({
        email: updateUserDto.email,
        _id: { $ne: id },
      });

      if (existingUser) {
        throw new ConflictException('User with this email already exists');
      }
    }

    // Обновляем Stripe клиента если есть изменения
    if (
      user.stripeCustomerId &&
      (updateUserDto.email || updateUserDto.firstName || updateUserDto.lastName)
    ) {
      await stripe.customers.update(user.stripeCustomerId, {
        ...(updateUserDto.email && { email: updateUserDto.email }),
        ...((updateUserDto.firstName || updateUserDto.lastName) && {
          name: `${updateUserDto.firstName || user.firstName} ${updateUserDto.lastName || user.lastName}`,
        }),
      });
    }

    // Обновляем пользователя в MongoDB
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();

    return updatedUser;
  }

  async remove(id: string): Promise<void> {
    const user = await this.userModel.findById(id).exec();

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Удаляем Stripe клиента если он существует
    if (user.stripeCustomerId) {
      try {
        await stripe.customers.del(user.stripeCustomerId);
      } catch (error) {
        console.error('Error deleting Stripe customer:', error);
      }
    }

    // Удаляем пользователя из MongoDB
    await this.userModel.findByIdAndDelete(id).exec();
  }

  async count(): Promise<number> {
    return await this.userModel.countDocuments().exec();
  }

  async search(query: string): Promise<User[]> {
    const regex = new RegExp(query, 'i');

    return await this.userModel
      .find({
        $or: [
          { firstName: regex },
          { lastName: regex },
          { email: regex },
          { phone: regex },
        ],
      })
      .exec();
  }
}
