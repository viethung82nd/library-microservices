import { Book } from './book.entity';

import { BookId } from '../value-objects/book-id.vo';
import { BookTitle } from '../value-objects/book-title.vo';
import { AuthorName } from '../value-objects/author-name.vo';

import { describe, it, expect } from '@jest/globals';

describe('Book Entity', () => {
  it('should borrow book', () => {
    const book = new Book(
      new BookId('1'),
      new BookTitle('Clean Code'),
      new AuthorName('Robert Martin'),
      true,
    );

    expect(book.available).toBe(true);

    book.borrow();

    expect(book.available).toBe(false);
  });

  it('should throw when borrowing an unavailable book', () => {
    const book = new Book(
      new BookId('1'),
      new BookTitle('DDD'),
      new AuthorName('Eric Evans'),
      false,
    );

    expect(() => book.borrow()).toThrow('Book is already borrowed');
  });

  it('should return book', () => {
    const book = new Book(
      new BookId('1'),
      new BookTitle('Clean Architecture'),
      new AuthorName('Robert Martin'),
      false,
    );

    book.returnBook();

    expect(book.available).toBe(true);
  });

  it('should throw when returning an available book', () => {
    const book = new Book(
      new BookId('1'),
      new BookTitle('Refactoring'),
      new AuthorName('Martin Fowler'),
      true,
    );

    expect(() => book.returnBook()).toThrow('Book is already available');
  });

  it('should rename the book', () => {
    const book = new Book(
      new BookId('1'),
      new BookTitle('Old Title'),
      new AuthorName('Author'),
      true,
    );

    book.rename(new BookTitle('New Title'));

    expect(book.title.getValue()).toBe('New Title');
  });

  it('should change author', () => {
    const book = new Book(
      new BookId('1'),
      new BookTitle('Some Title'),
      new AuthorName('Old Author'),
      true,
    );

    book.changeAuthor(new AuthorName('New Author'));

    expect(book.author.getValue()).toBe('New Author');
  });
});
