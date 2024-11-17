import Image from "next/image";
import { testDatabaseConnection } from "./actions";
import Link from "next/link";
import "./../styles/globals.css";
import UniForm from "./components/books/BooksForm";
import BooksComponent from "./books/page";
import { useEffect, useState } from "react";
import connectDB from "../lib/mongodb";
import { Button } from "@nextui-org/react";

/**
 * Default component
 * @returns Home component.
 */
export default async function Home() {
  type props = {
    formValues: { name: string; value: string; type: "number" | "string" }[];
  };

  const example: props = {
    formValues: [{ name: "name", value: "string", type: "string" }],
  };
  await connectDB();
  return (
    <main className="dark  flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex justify-evenly m-1">
        <div className="w-36 self-center flex-4 ">
          <p>Height: cm</p>
        </div>
        <div className=" self-center flex-4">
          <Button
            className="bg-transparent border-none"
            size="sm"
            variant="ghost"
            isIconOnly
          >
            <div className="w-36 self-center flex-4 ">
              <p>Height: cm</p>
            </div>
          </Button>
        </div>
      </div>
    </main>
  );
}
