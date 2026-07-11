import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Borrow } from './borrow.schema';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class BorrowsService {
  constructor(
    @Inject('USER_SERVICE')
    private readonly userClient: ClientProxy,

    @Inject('BOOK_SERVICE')
    private readonly bookClient: ClientProxy,

    @Inject('NOTIFICATION_SERVICE')
    private readonly notificationClient: ClientProxy,

    @InjectModel(Borrow.name)
    private readonly borrowModel: Model<Borrow>,
  ) {}

  async borrow(userId: string, bookId: string) {
    const user = await firstValueFrom(this.userClient.send('get_user', userId));

    const book = await firstValueFrom(this.bookClient.send('get_book', bookId));

    console.log('Book:', book);
    console.log('User:', user);
    const borrow = await this.borrowModel.create({
      userId,
      bookId,
      borrowedAt: new Date(),
    });

    this.notificationClient.emit('borrow.created', borrow);

    return {
      message: 'Borrow success',
      data: borrow,
    };
  }
}
