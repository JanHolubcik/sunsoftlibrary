import Image from "next/image";

import Link from "next/link";
import { BooksClass } from "@/src/lib/models/books";
import BooksForm from "../components/books/BooksForm";
import { useEffect, useState } from "react";

import { env } from "process";
import { unstable_cache } from "next/cache";
import connectDB from "@/src/lib/mongodb";
import mongoose from "mongoose";
import { bookLoan, books, typeLabels } from "../types/types";
import BooksLoanForm from "../components/booksLoan/BooksLoanForm";

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
    key: "username",
    label: "BORROWER NAME",
  },
  {
    key: "quantity",
    label: "QUANTITY",
  },
  {
    key: "from",
    label: "FROM",
  },
  {
    key: "to",
    label: "TO",
  },
  {
    key: "actions",
    label: "ACTIONS",
  },
];

/**
 *
 * @returns Books component.
 */
export default async function BooksLoans() {
  const res: bookLoan = await fetch(process.env.url + "/api/booksloan", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => {
    return res.json();
  });

  const valuesNew = res.map((val, index) => {
    return {
      ...val,
      author: val.bookInfo.author,
      nameBook: val.bookInfo.bookName,
      username: val.userInfo.name + " " + val.userInfo.surname,
      from: val.dateFrom,
      quantity: val.sum,
      to: val.dateTo,
      key: index,
    };
  });
  return (
    <main className="dark  flex min-h-screen flex-col items-center justify-between p-12">
      <BooksLoanForm labels={labels} newValues={valuesNew}></BooksLoanForm>
    </main>
  );
}
