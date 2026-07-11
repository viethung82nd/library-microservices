import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

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
      title: book.title,
      author: book.author,
      available: book.available,
    });

    return new BookEntity(
      created._id.toString(),
      created.title,
      created.author,
      created.available,
    );
  }

  async findById(id: string): Promise<BookEntity | null> {
    const book = await this.bookModel.findById(id);

    if (!book) {
      return null;
    }

    return new BookEntity(
      book._id.toString(),
      book.title,
      book.author,
      book.available,
    );
  }

  async findAll(): Promise<BookEntity[]> {
    const books = await this.bookModel.find();

    return books.map(
      (book) =>
        new BookEntity(
          book._id.toString(),
          book.title,
          book.author,
          book.available,
        ),
    );
  }

  async update(book: BookEntity): Promise<BookEntity> {
    const updated = await this.bookModel.findByIdAndUpdate(
      book.id,
      {
        title: book.title,
        author: book.author,
        available: book.available,
      },
      { new: true },
    );

    if (!updated) {
      throw new Error('Book not found');
    }

    return new BookEntity(
      updated._id.toString(),
      updated.title,
      updated.author,
      updated.available,
    );
  }

  async delete(id: string): Promise<void> {
    await this.bookModel.findByIdAndDelete(id);
  }
}
