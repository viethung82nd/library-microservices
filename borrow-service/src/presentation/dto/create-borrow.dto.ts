import { IsMongoId } from 'class-validator';

export class CreateBorrowDto {
  @IsMongoId()
  userId!: string;

  @IsMongoId()
  bookId!: string;
}
