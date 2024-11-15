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
    _id: false,
    timestamps: true,
    collection: "users",
  },
  options: {
    allowMixed: Severity.ALLOW,
  },
})
class BooksClass {
  @prop({ required: [true, "Id of book is required"], unique: true })
  bookID?: string;
  @prop({ required: [true, "Book name is required"], unique: true })
  userID?: string;
  @prop({ required: true })
  sum?: number;
}

const books = getModelForClass(BooksClass);

export { books, BooksClass };
