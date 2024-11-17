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
    key: "surname",
    label: "SURNAME",
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

/**
 *
 * @returns Users component.
 */
export default async function Users() {
  const res: users = await fetch(process.env.url + "/api/users", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => {
    const data = res.json();

    return data;
  });

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
