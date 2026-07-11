import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
})
export class Borrow {
  @Prop({
    required: true,
  })
  userId!: string;

  @Prop({
    required: true,
  })
  bookId!: string;

  @Prop({
    default: Date.now,
  })
  borrowedAt!: Date;
}

export const BorrowSchema = SchemaFactory.createForClass(Borrow);
