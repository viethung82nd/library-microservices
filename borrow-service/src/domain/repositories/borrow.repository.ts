import { Borrow } from '../entities/borrow.entity';

export interface BorrowRepository {
  save(borrow: Borrow): Promise<Borrow>;

  findById(id: string): Promise<Borrow | null>;

  findAll(): Promise<Borrow[]>;

  update(borrow: Borrow): Promise<Borrow>;
}
