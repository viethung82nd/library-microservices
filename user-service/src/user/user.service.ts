import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  async findAll() {
    return await this.userModel.find();
  }

  async findOne(id: string) {
    const user = await this.userModel.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async create(user: any) {
    const newUser = await this.userModel.create(user);

    return newUser;
  }

  async update(id: string, user: any) {
    const updatedUser = await this.userModel.findByIdAndUpdate(
      id,
      user,
      {
        new: true,
      },
    );

    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }

    return updatedUser;
  }

  async remove(id: string) {
    const deletedUser = await this.userModel.findByIdAndDelete(id);

    if (!deletedUser) {
      throw new NotFoundException('User not found');
    }

    return {
      message: 'User deleted successfully',
    };
  }
}