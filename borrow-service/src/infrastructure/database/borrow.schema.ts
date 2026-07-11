import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BorrowDocument = HydratedDocument<Borrow>;

@Schema({ timestamps: true })
export class Borrow {
  @Prop({ required: true })
  userId!: string;

  @Prop({ required: true })
  bookId!: string;

  @Prop({ required: true })
  borrowedAt!: Date;

  @Prop()
  returnedAt?: Date;
}

export const BorrowSchema = SchemaFactory.createForClass(Borrow);
