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
    collection: "books",
  },
  options: {
    allowMixed: Severity.ALLOW,
  },
})
class BooksClass {
  _id!: mongoose.Types.ObjectId;
  @prop({ required: [true, "Book name is required"] })
  bookName?: string;
  @prop({ required: [true, "Author is required"] })
  author?: string;
  @prop({ required: true, min: 0 })
  sum?: number;
}

const Books = getModelForClass(BooksClass);

export { Books, BooksClass };
