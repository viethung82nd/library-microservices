import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

import type { BorrowRepository } from '../../domain/repositories/borrow.repository';
import { BORROW_REPOSITORY } from '../../domain/repositories/repository.tokens';
import { Borrow } from '../../domain/entities/borrow.entity';
import { BorrowCreatedEvent } from '../../domain/events/borrow-created.event';

@Injectable()
export class BorrowBookUseCase {
  constructor(
    @Inject(BORROW_REPOSITORY)
    private readonly borrowRepository: BorrowRepository,

    @Inject('USER_SERVICE')
    private readonly userClient: ClientProxy,

    @Inject('BOOK_SERVICE')
    private readonly bookClient: ClientProxy,

    @Inject('NOTIFICATION_SERVICE')
    private readonly notificationClient: ClientProxy,
  ) {}

  async execute(userId: string, bookId: string) {
    // 1. Kiểm tra User
    console.log('Before user');

    const user = await firstValueFrom(this.userClient.send('get_user', userId));

    console.log('After user');
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // 2. Kiểm tra Book
    const book = await firstValueFrom(this.bookClient.send('get_book', bookId));

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    // 3. Kiểm tra sách còn hay không
    if (!book.available) {
      throw new BadRequestException('Book is already borrowed');
    }

    // 4. Tạo Domain Entity
    const borrow = new Borrow(null, userId, bookId, new Date());

    // 5. Lưu Borrow
    const savedBorrow = await this.borrowRepository.save(borrow);

    // 6. Update trạng thái Book
    await firstValueFrom(this.bookClient.send('borrow_book', bookId));

    // 7. Publish Event
    const event = new BorrowCreatedEvent(
      savedBorrow.id!,
      userId,
      bookId,
      savedBorrow.borrowedAt,
    );

    this.notificationClient.emit('borrow.created', event);
    // 8. Trả kết quả
    return {
      message: 'Borrow success',
      data: savedBorrow,
    };
  }
}
