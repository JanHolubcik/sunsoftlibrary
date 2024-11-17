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
    collection: "bookLoans",
  },
  options: {
    allowMixed: Severity.ALLOW,
  },
})
class BookLoansClass {
  @prop({ required: [true, "Id of book is required"], unique: false })
  bookID?: mongoose.Types.ObjectId;
  @prop({ required: [true, "Book name is required"], unique: false })
  userID?: string;
  @prop({ required: true })
  sum?: number;
  @prop({ required: true })
  dateFrom?: Date;
  @prop({ required: false })
  dateTo?: Date;
}

const BooksLoans = getModelForClass(BookLoansClass);

export { BooksLoans, BookLoansClass };
