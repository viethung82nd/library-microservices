import { Book } from '../entities/book.entity';

export interface BookRepository {
  save(book: Book): Promise<Book>;

  findById(id: string): Promise<Book | null>;

  findAll(): Promise<Book[]>;

  update(book: Book): Promise<Book>;

  delete(id: string): Promise<void>;
}
