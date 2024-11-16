import Image from "next/image";

import Link from "next/link";
import { BooksClass } from "@/src/lib/models/books";
import UniForm from "../components/UniForm";
import { useEffect, useState } from "react";

import { env } from "process";
import { unstable_cache } from "next/cache";
import connectDB from "@/src/lib/mongodb";
import mongoose from "mongoose";
import { books, typeLabels } from "../types/types";

const labels: typeLabels = [
  {
    key: "author",
    label: "AUTHOR",
  },
  {
    key: "nameBook",
    label: "BOOK NAME",
  },
  {
    key: "quantity",
    label: "QUANTITY",
  },
  {
    key: "actions",
    label: "ACTIONS",
  },
];

const columns = [
  {
    key: "name",
    label: "NAME",
  },
  {
    key: "role",
    label: "ROLE",
  },
  {
    key: "status",
    label: "STATUS",
  },
];

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

  const valuesNew = res.map((val, index) => {
    return {
      key: index,
      _id: val._id,
      author: val.author,
      nameBook: val.bookName,
      quantity: val.sum,
    };
  });

  return (
    <main className="dark  flex min-h-screen flex-col items-center justify-between p-12">
      <UniForm formValues={values} newValues={valuesNew} labels={labels} />
    </main>
  );
}
