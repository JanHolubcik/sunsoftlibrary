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
