import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Book } from './books.schema';

@Injectable()
export class BooksService {
  constructor(
    @InjectModel(Book.name)
    private readonly bookModel: Model<Book>,
  ) {}

  async findAll() {
    return this.bookModel.find();
  }

  async findOne(id: string) {
    const book = await this.bookModel.findById(id);

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    return book;
  }

  async create(book: any) {
    return this.bookModel.create(book);
  }

  async update(id: string, book: any) {
    const updated = await this.bookModel.findByIdAndUpdate(id, book, {
      new: true,
    });

    if (!updated) {
      throw new NotFoundException('Book not found');
    }

    return updated;
  }

  async remove(id: string) {
    await this.bookModel.findByIdAndDelete(id);

    return {
      message: 'Book deleted',
    };
  }
}
