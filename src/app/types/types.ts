import mongoose from "mongoose";

export type edit = {
  key: number;
  _id: mongoose.Types.ObjectId;
  author: string | undefined;
  nameBook: string | undefined;
  quantity: number | undefined;
};
export type books = {
  _id: mongoose.Types.ObjectId;
  bookName?: string | undefined;
  author?: string | undefined;
  sum?: number | undefined;
}[];

export type typeLabels = {
  key: string;
  label: string;
}[];

export type users = {
  _id: mongoose.Types.ObjectId;
  name?: string | undefined;
  surname?: string | undefined;
  IDnumber?: string | undefined;
  userPassword?: string | undefined;
  userEmail?: string | undefined;
  dateOfBirth?: Date | undefined;
}[];

export type bookLoan = {
  _id: mongoose.Types.ObjectId;
  key: number;
  userID: "string";
  bookID: mongoose.Types.ObjectId;
  sum: number;
  dateFrom: Date;
  dateTo?: Date;
  bookInfo: booksObject;
  userInfo: usersObject;
  to?: Date;
  from?: Date;
}[];

export type booksObject = {
  key: number;
  _id: mongoose.Types.ObjectId;
  bookName?: string | undefined;
  author?: string | undefined;
  sum?: number | undefined;
};

export type usersObject = {
  _id: mongoose.Types.ObjectId;
  name?: string | undefined;
  surname?: string | undefined;
  IDnumber?: string | undefined;
  userPassword?: string | undefined;
  userEmail?: string | undefined;
  dateOfBirth?: Date | undefined;
};

export type bookLoanObject = {
  _id: mongoose.Types.ObjectId;
  key: number;
  userID: "string";
  bookID: mongoose.Types.ObjectId;
  sum: number;
  dateFrom: Date;
  dateTo?: Date;
  bookInfo: booksObject;
  userInfo: usersObject;
  quantity?: number;
};
