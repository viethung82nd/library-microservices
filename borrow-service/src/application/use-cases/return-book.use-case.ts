import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

import { BORROW_REPOSITORY } from '../../domain/repositories/repository.tokens';
import type { BorrowRepository } from '../../domain/repositories/borrow.repository';

@Injectable()
export class ReturnBookUseCase {
  constructor(
    @Inject(BORROW_REPOSITORY)
    private readonly repository: BorrowRepository,

    @Inject('BOOK_SERVICE')
    private readonly bookClient: ClientProxy,

    @Inject('NOTIFICATION_SERVICE')
    private readonly notificationClient: ClientProxy,
  ) {}

  async execute(id: string) {
    const borrow = await this.repository.findById(id);

    if (!borrow) {
      throw new NotFoundException('Borrow not found');
    }

    borrow.returnBook();

    await firstValueFrom(this.bookClient.send('return_book', borrow.bookId));

    let updatedBorrow;
    try {
      updatedBorrow = await this.repository.update(borrow);
    } catch (error) {
      try {
        await firstValueFrom(
          this.bookClient.send('borrow_book', borrow.bookId),
        );
      } catch (rollbackError) {
        console.error('Rollback failed', rollbackError);
      }

      throw error;
    }

    this.notificationClient.emit('borrow.returned', {
      borrowId: updatedBorrow.id,
      userId: updatedBorrow.userId,
      bookId: updatedBorrow.bookId,
      returnedAt: updatedBorrow.returnedAt,
    });

    return {
      message: 'Return success',
      data: updatedBorrow,
    };
  }
}
