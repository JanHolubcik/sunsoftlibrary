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
    <main className="dark  flex min-h-screen flex-col items-center justify-between p-24 pt-12">
      <div className="flex max-w-lg flex-col justify-evenly m-1">
        <Image
          className="flex self-center"
          alt="Cute owl"
          height={200}
          src="/cuteowl.png"
          width={200}
        />
        <section className="flex flex-col" id="hero">
          <h1 className="m-3 self-center font-bold mt-8 text-3xl ">
            Welcome to Our Library
          </h1>
          <h2 className="m-3 font-bold self-center">
            Explore a world of knowledge and inspiration.
          </h2>
        </section>

        <section id="about-library">
          <h2 className="font-bold text-xl font-s m-1">About Our Library</h2>
          <p className=" ml-1 mt-1">
            Our library is a welcoming community hub where knowledge,
            inspiration, and culture meet.
          </p>
          <p className=" ml-1 mt-1">
            We offer an extensive collection of books, digital resources, and
            programs for all age groups.
          </p>
          <p className=" ml-1 mt-1">
            Whether you're here to research, read, or attend one of our
            workshops, we strive to foster a space that encourages learning and
            connection.
          </p>
        </section>

        <section id="location">
          <h2 className="font-bold m-1 text-xl">Our Location</h2>
          <p className=" ml-1 mt-1">Visit us at:</p>
          <p className=" ml-1 ">123 Library Street, Knowledge City, ABC 4567</p>
          <p className=" ml-1 ">
            We are open Monday through Saturday from 9:00 AM to 6:00 PM.
          </p>
        </section>
      </div>
    </main>
  );
}
