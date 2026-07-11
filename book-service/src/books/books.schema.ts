import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
})
export class Book {
  @Prop({
    required: true,
  })
  title!: string;

  @Prop({
    required: true,
  })
  author!: string;

  @Prop({
    default: true,
  })
  available!: boolean;
}

export const BookSchema = SchemaFactory.createForClass(Book);
