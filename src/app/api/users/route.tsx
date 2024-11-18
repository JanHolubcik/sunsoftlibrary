import { Books, BooksClass } from "@/src/lib/models/books";
import { Users } from "@/src/lib/models/users";
import connectDB from "@/src/lib/mongodb";
import { mongoose } from "@typegoose/typegoose";
import { ObjectId } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";
import { NextRequest } from "next/server";

type ResponseData = {
  message: string;
};

const validateEmail = (email: string) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

export async function GET(req: NextRequest) {
  // Get data from your database

  await connectDB();
  try {
    const users = await Users.find({}).lean().exec();
    return Response.json(users);
  } catch (error) {
    return new Response(`Webhook error: ${error}`, {
      status: 400,
    });
  }
}

export async function POST(req: Request) {
  // Get data from your database
  const {
    _id: userID,
    name,
    surname,
    IDnumber,
    userEmail,
    dateOfBirth,
    newRecord,
    userPassword,
  } = await req.json();

  if (!surname || !name || !IDnumber || !userEmail || !dateOfBirth) {
    return Response.json(
      { error: "Missing required fields!" },
      { status: 400 }
    );
  }

  if (surname < 2 && name < 2 && userEmail < 2) {
    return Response.json({ error: "Values are too short!" }, { status: 400 });
  }

  if (!validateEmail(userEmail)) {
    return Response.json({ error: "Bad email format!" }, { status: 400 });
  }

  await connectDB();
  try {
    if (!newRecord && userID) {
      const xd = await Users.findOneAndUpdate(
        { _id: userID },
        {
          $set: {
            name: name,
            surname: surname,
            IDnumber: IDnumber,
            userEmail: userEmail,
            dateOfBirth: dateOfBirth,
          },
        }
      ).catch((err) => console.log(err));
    } else {
      console.log("Creating new record...");

      const myDocument = new Users({
        name: name,
        surname: surname,
        userEmail: userEmail,
        dateOfBirth: dateOfBirth,
        IDnumber: IDnumber,
      });
      const newDoc = await myDocument.save();

      return Response.json(newDoc);
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
  const { IDnumber } = await req.json();
  if (!IDnumber) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  await connectDB();
  try {
    await Users.findOneAndDelete({ IDnumber: IDnumber });

    return Response.json({ message: "Updating book was successful" });
  } catch (error) {
    return new Response(`Webhook error: ${error}`, {
      status: 400,
    });
  }
}
