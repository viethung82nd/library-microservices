import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { BorrowRepository } from '../../domain/repositories/borrow.repository';
import { Borrow as BorrowEntity } from '../../domain/entities/borrow.entity';

import { Borrow, BorrowDocument } from '../database/borrow.schema';

@Injectable()
export class MongoBorrowRepository implements BorrowRepository {
  constructor(
    @InjectModel(Borrow.name)
    private readonly borrowModel: Model<BorrowDocument>,
  ) {}

  async save(borrow: BorrowEntity): Promise<BorrowEntity> {
    const created = await this.borrowModel.create({
      userId: borrow.userId,
      bookId: borrow.bookId,
      borrowedAt: borrow.borrowedAt,
      returnedAt: borrow.returnedAt,
    });

    return new BorrowEntity(
      created._id.toString(),
      created.userId,
      created.bookId,
      created.borrowedAt,
      created.returnedAt,
    );
  }

  async findById(id: string): Promise<BorrowEntity | null> {
    const borrow = await this.borrowModel.findById(id);

    if (!borrow) {
      return null;
    }

    return new BorrowEntity(
      borrow._id.toString(),
      borrow.userId,
      borrow.bookId,
      borrow.borrowedAt,
      borrow.returnedAt,
    );
  }

  async findAll(): Promise<BorrowEntity[]> {
    const borrows = await this.borrowModel.find();

    return borrows.map(
      (borrow) =>
        new BorrowEntity(
          borrow._id.toString(),
          borrow.userId,
          borrow.bookId,
          borrow.borrowedAt,
          borrow.returnedAt,
        ),
    );
  }
}
