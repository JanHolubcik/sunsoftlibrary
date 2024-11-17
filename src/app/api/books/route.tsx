import { Books, BooksClass } from "@/src/lib/models/books";
import connectDB from "@/src/lib/mongodb";
import { mongoose } from "@typegoose/typegoose";
import type { NextApiRequest, NextApiResponse } from "next";
import { NextRequest } from "next/server";

type ResponseData = {
  message: string;
};

export async function GET(req: NextRequest) {
  // Get data from your database
  const authorSuggestion = req.nextUrl.searchParams.get("author");
  const bookNameSuggestion = req.nextUrl.searchParams.get("bookName");
  const suggestion = req.nextUrl.searchParams.get("suggestion");
  await connectDB();
  try {
    if (authorSuggestion) {
      const books = await Books.find({
        author: { $regex: ".*" + authorSuggestion + ".*", $options: "i" },
      })
        .limit(5)
        .lean()
        .exec();
      return Response.json(
        books.map((book) => {
          return book.author;
        })
      );
    } else if (bookNameSuggestion) {
      const books = await Books.find({
        bookName: { $regex: ".*" + bookNameSuggestion + ".*", $options: "i" },
      })
        .limit(5)
        .lean()
        .exec();

      return Response.json(
        books.map((book) => {
          return book.bookName;
        })
      );
    } else if (suggestion) {
      const books = await Books.find({}).limit(5).lean().exec();
      return Response.json([
        books.map((book) => {
          return book.bookName;
        }),
        books.map((book) => {
          return book.author;
        }),
      ]);
    }
    const books = await Books.find({}).lean().exec();

    return Response.json(books);
  } catch (error) {
    return new Response(`Webhook error: ${error}`, {
      status: 400,
    });
  }
}

export async function POST(req: Request) {
  // Get data from your database
  const { bookID, author, name, val, newRecord } = await req.json();
  if (!author || !name || !val) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  await connectDB();
  try {
    if (!newRecord && bookID) {
      const xd = await Books.findOneAndUpdate(
        { _id: bookID },
        { $set: { author: author, bookName: name, sum: val } }
      );
    } else {
      console.log("Creating new record...");
      await Books.insertMany({
        author: author,
        bookName: name,
        sum: val,
      }).catch((err) => console.log(err));
    }

    return Response.json({ message: "Updating book was successful" });
  } catch (error) {
    return new Response(`Webhook error: ${error}`, {
      status: 400,
    });
  }
}

export async function DELETE(req: Request) {
  // Get data from your database
  const { bookID } = await req.json();
  if (!bookID) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  await connectDB();
  try {
    await Books.findOneAndDelete({ _id: bookID });

    return Response.json({ message: "Updating book was successful" });
  } catch (error) {
    return new Response(`Webhook error: ${error}`, {
      status: 400,
    });
  }
}
