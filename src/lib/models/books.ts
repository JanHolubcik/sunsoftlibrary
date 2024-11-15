import {
  getModelForClass,
  index,
  ModelOptions,
  mongoose,
  prop,
  Severity,
} from "@typegoose/typegoose";

@index({ title: 1 })
@ModelOptions({
  schemaOptions: {
    timestamps: true,
    collection: "users",
  },
  options: {
    allowMixed: Severity.ALLOW,
  },
})
class BooksClass {
  _id!: mongoose.Types.ObjectId;
  @prop({ required: [true, "Book name is required"], unique: true })
  bookName?: string;
  @prop({ required: [true, "Author is required"] })
  author?: string;
  @prop({ required: true, default: 0 })
  sum?: number;
}

const books = getModelForClass(BooksClass);

export { books, BooksClass };
