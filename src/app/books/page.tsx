import Image from "next/image";

import Link from "next/link";
import { BooksClass } from "@/src/lib/models/books";
import UniForm from "../components/UniForm";
import { useEffect, useState } from "react";
import useBookHook from "./useBookHook";
import { env } from "process";
import { unstable_cache } from "next/cache";
import connectDB from "@/src/lib/mongodb";
import mongoose from "mongoose";

type books = {
  _id: mongoose.Types.ObjectId;
  bookName?: string | undefined;
  author?: string | undefined;
  sum?: number | undefined;
}[];

const labels = ["Author", "Name of the book", "Quantity"];

/**
 *
 * @returns Books component.
 */
export default async function Books() {
  const res: books = await fetch(process.env.url + "/api/books", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => {
    return res.json();
  });

  const values = res.map((val) => {
    return [
      { name: "id", value: val._id, type: "string" },
      { name: "author", value: val.author, type: "string" },
      { name: "bookName", value: val.bookName, type: "string" },
      { name: "val", value: val.sum, type: "number" },
    ];
  });

  return (
    <main className="dark  flex min-h-screen flex-col items-center justify-between p-24">
      <UniForm formValues={values} labels={labels} />
    </main>
  );
}
