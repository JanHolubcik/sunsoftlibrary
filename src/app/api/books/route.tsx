import { Books } from "@/src/lib/models/books";
import connectDB from "@/src/lib/mongodb";
import { mongoose } from "@typegoose/typegoose";
import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
  message: string;
};

export async function GET() {
  // Get data from your database

  await connectDB();
  try {
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
  const { bookID, author, name, val } = await req.json();
  if (!bookID || !author || !name || !val) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  await connectDB();
  try {
    await Books.findOneAndUpdate(
      { _id: bookID },
      { $set: { author: author, name: name, sum: val } }
    );

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
