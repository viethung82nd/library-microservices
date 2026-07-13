import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { BookId } from '../../domain/value-objects/book-id.vo';
import { BookTitle } from '../../domain/value-objects/book-title.vo';
import { AuthorName } from '../../domain/value-objects/author-name.vo';
import { BookRepository } from '../../domain/repositories/book.repository';
import { Book as BookEntity } from '../../domain/entities/book.entity';

import { Book, BookDocument } from '../database/books.schema';

@Injectable()
export class MongoBookRepository implements BookRepository {
  constructor(
    @InjectModel(Book.name)
    private readonly bookModel: Model<BookDocument>,
  ) {}

  async save(book: BookEntity): Promise<BookEntity> {
    const created = await this.bookModel.create({
      title: book.title.getValue(),
      author: book.author.getValue(),
      available: book.available,
    });

    return new BookEntity(
      new BookId(created._id.toString()),
      new BookTitle(created.title),
      new AuthorName(created.author),
      created.available,
    );
  }

  async findById(id: string): Promise<BookEntity | null> {
    const book = await this.bookModel.findById(id);

    if (!book) {
      return null;
    }

    return new BookEntity(
      new BookId(book._id.toString()),
      new BookTitle(book.title),
      new AuthorName(book.author),
      book.available,
    );
  }

  async findAll(): Promise<BookEntity[]> {
    const books = await this.bookModel.find();

    return books.map(
      (book) =>
        new BookEntity(
          new BookId(book._id.toString()),
          new BookTitle(book.title),
          new AuthorName(book.author),
          book.available,
        ),
    );
  }

  async update(book: BookEntity): Promise<BookEntity> {
    if (!book.id) {
      throw new Error('Book ID is required for update');
    }
    const updated = await this.bookModel.findByIdAndUpdate(
      book.id.getValue(),
      {
        title: book.title.getValue(),
        author: book.author.getValue(),
        available: book.available,
      },
      { new: true },
    );

    if (!updated) {
      throw new Error('Book not found');
    }

    return new BookEntity(
      new BookId(updated._id.toString()),
      new BookTitle(updated.title),
      new AuthorName(updated.author),
      updated.available,
    );
  }

  async delete(id: string): Promise<void> {
    await this.bookModel.findByIdAndDelete(id);
  }
}
