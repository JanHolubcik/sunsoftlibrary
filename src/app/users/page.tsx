import Image from "next/image";

import Link from "next/link";
import { BooksClass } from "@/src/lib/models/books";

import { useEffect, useState } from "react";

import { env } from "process";
import { unstable_cache } from "next/cache";
import connectDB from "@/src/lib/mongodb";
import mongoose from "mongoose";
import { books, typeLabels, users } from "../types/types";
import UsersForm from "../components/users/UsersForm";

const labels: typeLabels = [
  {
    key: "name",
    label: "NAME",
  },
  {
    key: "IDnumber",
    label: "ID NUMBER",
  },
  {
    key: "dateOfBirth",
    label: "DATE OF BIRTH",
  },
  {
    key: "userEmail",
    label: "USER EMAIL",
  },

  {
    key: "actions",
    label: "ACTIONS",
  },
];
export const dynamic = "force-dynamic";
/**
 *
 * @returns Users component.
 */
export default async function Users() {
  const data = await fetch(process.env.URL + "/api/users", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  let res: users = await data.json();
  if (!res) {
    return { notfound: true };
  }
  const valuesNew = res.map((val, index) => {
    return {
      _id: val._id,
      key: index,
      name: val.name,
      surname: val.surname,
      dateOfBirth: val.dateOfBirth,
      IDnumber: val.IDnumber,
      userEmail: val.userEmail,
    };
  });

  return (
    <main className="dark  flex min-h-screen flex-col items-center justify-between p-12">
      <UsersForm newValues={valuesNew} labels={labels} />
    </main>
  );
}
