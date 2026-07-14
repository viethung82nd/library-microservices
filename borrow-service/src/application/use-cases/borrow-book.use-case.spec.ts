import { BorrowBookUseCase } from './borrow-book.use-case';

import { BadRequestException, NotFoundException } from '@nestjs/common';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { of } from 'rxjs';

describe('BorrowBookUseCase', () => {
  let repository: any;
  let userClient: any;
  let bookClient: any;
  let notificationClient: any;
  let useCase: BorrowBookUseCase;

  beforeEach(() => {
    repository = {
      save: jest.fn(),
    };

    userClient = {
      send: jest.fn(),
    };

    bookClient = {
      send: jest.fn(),
    };

    notificationClient = {
      emit: jest.fn(),
    };

    useCase = new BorrowBookUseCase(
      repository,
      userClient,
      bookClient,
      notificationClient,
    );
  });

  it('should borrow a book successfully', async () => {
    // Arrange
    userClient.send.mockReturnValue(
      of({
        _id: 'user-1',
        name: 'Hung',
        email: 'hung@gmail.com',
      }),
    );

    bookClient.send
      .mockReturnValueOnce(
        of({
          _id: 'book-1',
          title: 'DDD',
          author: 'Eric Evans',
          available: true,
        }),
      )
      .mockReturnValueOnce(
        of({
          _id: 'book-1',
          title: 'DDD',
          author: 'Eric Evans',
          available: false,
        }),
      );

    repository.save.mockResolvedValue({
      id: 'borrow-1',
      userId: 'user-1',
      bookId: 'book-1',
      borrowedAt: new Date(),
      returnedAt: undefined,
    });

    // Act
    const result = await useCase.execute('user-1', 'book-1');

    // Assert
    expect(userClient.send).toHaveBeenCalledWith('get_user', 'user-1');

    expect(bookClient.send).toHaveBeenNthCalledWith(1, 'get_book', 'book-1');

    expect(bookClient.send).toHaveBeenNthCalledWith(2, 'borrow_book', 'book-1');

    expect(repository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 'user-1',
        bookId: 'book-1',
      }),
    );

    expect(notificationClient.emit).toHaveBeenCalledWith(
      'borrow.created',
      expect.any(Object),
    );

    expect(result).toEqual({
      message: 'Borrow success',
      data: {
        id: 'borrow-1',
        userId: 'user-1',
        bookId: 'book-1',
        borrowedAt: expect.any(Date),
        returnedAt: undefined,
      },
    });
  });

  it('should throw when user is not found', async () => {
    userClient.send.mockReturnValue(of(null));

    await expect(useCase.execute('user-1', 'book-1')).rejects.toThrow(
      NotFoundException,
    );

    expect(repository.save).not.toHaveBeenCalled();
  });

  it('should throw when book is not found', async () => {
    userClient.send.mockReturnValue(
      of({
        _id: 'user-1',
      }),
    );

    bookClient.send.mockReturnValueOnce(of(null));

    await expect(useCase.execute('user-1', 'book-1')).rejects.toThrow(
      NotFoundException,
    );

    expect(repository.save).not.toHaveBeenCalled();
  });

  it('should throw when book is already borrowed', async () => {
    userClient.send.mockReturnValue(
      of({
        _id: 'user-1',
      }),
    );

    bookClient.send.mockReturnValueOnce(
      of({
        _id: 'book-1',
        available: false,
      }),
    );

    await expect(useCase.execute('user-1', 'book-1')).rejects.toThrow(
      BadRequestException,
    );

    expect(repository.save).not.toHaveBeenCalled();
  });

  it('should rollback book status when saving borrow fails', async () => {
    userClient.send.mockReturnValue(
      of({
        _id: 'user-1',
      }),
    );

    bookClient.send
      .mockReturnValueOnce(
        of({
          _id: 'book-1',
          available: true,
        }),
      )
      .mockReturnValueOnce(
        of({
          _id: 'book-1',
          available: false,
        }),
      )
      .mockReturnValueOnce(
        of({
          _id: 'book-1',
          available: true,
        }),
      );

    repository.save.mockRejectedValue(new Error('Database error'));

    await expect(useCase.execute('user-1', 'book-1')).rejects.toThrow(
      'Database error',
    );

    expect(bookClient.send).toHaveBeenNthCalledWith(3, 'return_book', 'book-1');
  });
});
