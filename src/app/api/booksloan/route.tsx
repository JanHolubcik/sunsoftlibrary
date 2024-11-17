import { BooksLoans } from "@/src/lib/models/bookLoans";
import { Books, BooksClass } from "@/src/lib/models/books";
import { Users } from "@/src/lib/models/users";
import connectDB from "@/src/lib/mongodb";
import { mongoose } from "@typegoose/typegoose";
import type { NextApiRequest, NextApiResponse } from "next";
import { NextRequest } from "next/server";

type ResponseData = {
  message: string;
};

export async function GET(req: NextRequest) {
  // Get data from your database
  const userSuggestion = req.nextUrl.searchParams.get("user");
  const bookNameSuggestion = req.nextUrl.searchParams.get("bookName");
  const suggestion = req.nextUrl.searchParams.get("suggestion");
  await connectDB();
  try {
    //  const bookLoans = await BooksLoans.find({}).lean().exec();
    console.log(userSuggestion);
    if (userSuggestion) {
      const users = await Users.find({
        name: { $regex: ".*" + userSuggestion + ".*", $options: "i" },
      })
        .limit(5)
        .lean()
        .exec();

      return Response.json(users);
    } else if (bookNameSuggestion) {
      const books = await Books.find({
        bookName: { $regex: ".*" + bookNameSuggestion + ".*", $options: "i" },
      })
        .limit(5)
        .lean()
        .exec();

      return Response.json(books);
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

    const bookLoans = await BooksLoans.aggregate([
      {
        $lookup: {
          from: "books", // The second join to the products collection
          localField: "bookID",
          foreignField: "_id",
          as: "bookInfo",
        },
      },
      {
        $unwind: "$bookInfo", // Unwind if you want a flat structure for products
      },
      {
        $lookup: {
          from: "users", // The name of the collection to join
          localField: "userID", // The field in the foreign collection
          foreignField: "IDnumber", // The field in the users collection
          as: "userInfo", // The alias for the resulting array
        },
      },
      {
        $unwind: "$userInfo", // Unwind if you want a flat structure
      },
    ]);

    return Response.json(bookLoans);
  } catch (error) {
    return new Response(`Webhook error: ${error}`, {
      status: 400,
    });
  }
}

export async function POST(req: Request) {
  // Get data from your database
  const { _id, userID, bookID, sum, dateFrom, dateTo, newRecord } =
    await req.json();
  if (!userID || !bookID || !sum || !dateFrom) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  await connectDB();
  try {
    if (!newRecord && bookID && _id) {
      const books = await Books.findOne({ _id: bookID });

      const DD = await BooksLoans.findOne({ _id: _id }).lean().exec();
      if (!DD?.sum) {
        return Response.json({ message: "Loan was not found!" });
      }
      const newSum = DD?.sum - sum;

      if (!books) {
        return Response.json({ message: "Book was not found!" });
      }
      console.log("Sum..");
      if (books.sum && books.sum < sum && sum === 0) {
        return Response.json({ message: "Sum was wrongly set!" });
      }

      console.log("Saving sum..");
      if (books.sum) {
        books.sum = books.sum + newSum;
        await books.save();
      }

      const xd = await BooksLoans.findOneAndUpdate(
        { _id: _id },
        {
          $set: {
            userID: userID,
            bookID: bookID,
            dateFrom: dateFrom,
            dateTo: dateTo,
            sum: sum,
          },
        }
      );
      return Response.json({ message: "Updating book loans was successful" });
    } else {
      console.log("Creating new record...");
      console.log(userID + " " + bookID + " " + sum + " " + dateFrom);
      const users = await Users.findOne({ IDnumber: userID }).lean().exec();
      console.log("Users..");
      if (!users) {
        return Response.json({ message: "User was not found!" });
      }
      console.log("Books..");
      const books = await Books.findOne({ _id: bookID }).exec();
      if (!books) {
        return Response.json({ message: "Book was not found!" });
      }
      console.log("Sum..");
      if (books.sum && books.sum < sum && sum === 0) {
        return Response.json({ message: "Sum was wrongly set!" });
      }
      console.log("Saving sum..");
      if (books.sum) {
        const newSum = books.sum - sum;
        books.sum = newSum;
        await books.save();
      }
      console.log("Inserting loan..");
      await BooksLoans.insertMany({
        userID: userID,
        bookID: bookID,
        sum: sum,
        dateFrom: new Date(dateFrom),
      }).catch((err) => console.log(err));
    }

    return Response.json({ message: "Updating book loans was successful" });
  } catch (error) {
    return new Response(`Webhook error: ${error}`, {
      status: 400,
    });
  }
}

export async function DELETE(req: Request) {
  // Get data from your database
  const { _id, bookID, sum } = await req.json();
  if (!_id) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  await connectDB();
  try {
    console.log(_id + " " + bookID + " " + sum + " ");
    const books = await Books.findOne({ _id: bookID }).exec();
    if (!books) {
      return Response.json({ message: "Error when finding book" });
    }
    if (books.sum) {
      const newSum = books.sum + sum;
      books.sum = newSum;
      await books.save();
    }
    await BooksLoans.findOneAndDelete({ _id: _id });

    return Response.json({ message: "Updating book was successful" });
  } catch (error) {
    return new Response(`Webhook error: ${error}`, {
      status: 400,
    });
  }
}
