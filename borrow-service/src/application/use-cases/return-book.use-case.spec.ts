import { ReturnBookUseCase } from './return-book.use-case';

import { NotFoundException } from '@nestjs/common';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { of } from 'rxjs';

import { Borrow } from '../../domain/entities/borrow.entity';

describe('ReturnBookUseCase', () => {
  let repository: any;
  let bookClient: any;
  let notificationClient: any;
  let useCase: ReturnBookUseCase;

  beforeEach(() => {
    repository = {
      findById: jest.fn(),
      update: jest.fn(),
    };

    bookClient = {
      send: jest.fn(),
    };

    notificationClient = {
      emit: jest.fn(),
    };

    useCase = new ReturnBookUseCase(repository, bookClient, notificationClient);
  });

  it('should return a book successfully', async () => {
    // Arrange
    const borrow = new Borrow('borrow-1', 'user-1', 'book-1', new Date());

    repository.findById.mockResolvedValue(borrow);

    bookClient.send.mockReturnValue(
      of({
        _id: 'book-1',
        available: true,
      }),
    );

    repository.update.mockResolvedValue({
      id: 'borrow-1',
      userId: 'user-1',
      bookId: 'book-1',
      borrowedAt: borrow.borrowedAt,
      returnedAt: expect.any(Date),
    });

    // Act
    const result = await useCase.execute('borrow-1');

    // Assert
    expect(repository.findById).toHaveBeenCalledWith('borrow-1');

    expect(bookClient.send).toHaveBeenCalledWith('return_book', 'book-1');

    expect(repository.update).toHaveBeenCalled();

    expect(notificationClient.emit).toHaveBeenCalledWith(
      'borrow.returned',
      expect.any(Object),
    );

    expect(result.message).toBe('Return success');
  });

  it('should throw when borrow is not found', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(useCase.execute('borrow-1')).rejects.toThrow(
      NotFoundException,
    );

    expect(repository.update).not.toHaveBeenCalled();
  });

  it('should rollback when repository update fails', async () => {
    const borrow = new Borrow('borrow-1', 'user-1', 'book-1', new Date());

    repository.findById.mockResolvedValue(borrow);

    bookClient.send
      .mockReturnValueOnce(
        of({
          available: true,
        }),
      )
      .mockReturnValueOnce(
        of({
          available: false,
        }),
      );

    repository.update.mockRejectedValue(new Error('Database error'));

    await expect(useCase.execute('borrow-1')).rejects.toThrow('Database error');

    expect(bookClient.send).toHaveBeenNthCalledWith(2, 'borrow_book', 'book-1');
  });

  it('should publish borrow.returned event', async () => {
    const borrow = new Borrow('borrow-1', 'user-1', 'book-1', new Date());

    repository.findById.mockResolvedValue(borrow);

    bookClient.send.mockReturnValue(of({}));

    repository.update.mockResolvedValue({
      id: 'borrow-1',
      userId: 'user-1',
      bookId: 'book-1',
      borrowedAt: borrow.borrowedAt,
      returnedAt: new Date(),
    });

    await useCase.execute('borrow-1');

    expect(notificationClient.emit).toHaveBeenCalledWith(
      'borrow.returned',
      expect.objectContaining({
        borrowId: 'borrow-1',
        userId: 'user-1',
        bookId: 'book-1',
        returnedAt: expect.any(Date),
      }),
    );
  });
});
