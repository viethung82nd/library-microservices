import { Borrow } from './borrow.entity';
import { describe, it, expect } from '@jest/globals';

describe('Borrow Entity', () => {
  it('should create a borrow record', () => {
    const borrowedAt = new Date();

    const borrow = new Borrow(
      'borrow-id',
      'user-id',
      'book-id',
      borrowedAt,
      null,
    );

    expect(borrow.id).toBe('borrow-id');
    expect(borrow.userId).toBe('user-id');
    expect(borrow.bookId).toBe('book-id');
    expect(borrow.borrowedAt).toBe(borrowedAt);
    expect(borrow.returnedAt).toBeNull();
  });

  it('should return a borrowed book', () => {
    const borrow = new Borrow(
      'borrow-id',
      'user-id',
      'book-id',
      new Date(),
      null,
    );

    borrow.returnBook();

    expect(borrow.returnedAt).not.toBeNull();
  });

  it('should throw when returning a book twice', () => {
    const borrow = new Borrow(
      'borrow-id',
      'user-id',
      'book-id',
      new Date(),
      null,
    );

    borrow.returnBook();

    expect(() => borrow.returnBook()).toThrow('Book already returned');
  });

  it('should set returnedAt after borrowedAt', () => {
    const borrowedAt = new Date();

    const borrow = new Borrow(
      'borrow-id',
      'user-id',
      'book-id',
      borrowedAt,
      null,
    );

    borrow.returnBook();

    expect(borrow.returnedAt!.getTime()).toBeGreaterThanOrEqual(
      borrowedAt.getTime(),
    );
  });
});
