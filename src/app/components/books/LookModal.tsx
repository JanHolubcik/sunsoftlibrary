"use client";
import {
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@nextui-org/react";
import { useEffect, useRef, useState } from "react";
import AutoCompleteInput from "../AutoComplete";
import { useRouter } from "next/navigation";
import { booksObject, usersObject } from "../../types/types";
import mongoose from "mongoose";

type edit = {
  key: number;
  _id: mongoose.Types.ObjectId;
  author: string | undefined;
  nameBook: string | undefined;
  quantity: number | undefined;
};
type props = {
  onClose: () => void;
  handleAction: (
    action: "new" | "update" | "delete",
    newBook: edit
  ) => Promise<void>;
};

export default function LookModal(props: props) {
  const handleSelection = async (selectedOption: string) => {
    const data = await fetch(`/api/booksloan?findBook=${selectedOption}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      return res.json();
    });
    if (data?._id) {
      setError("");
      setUser(data);
    } else {
      setError("No user was found");
      setUser(undefined);
    }
    console.log({ Selected: { selectedOption } });
  };

  const [error, setError] = useState("");
  const [user, setUser] = useState<usersObject>();
  const [suggestionsBookName, setSuggestionBookName] = useState();

  const [bookName, setBookName] = useState("");

  const editBookNameValue = (e: string) => {
    setBookName(e);
  };

  useEffect(() => {
    if (bookName.length > 1) {
      const fetchSuggestions = async () => {
        const data = await fetch(`/api/books?bookName=${bookName}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }).then((res) => {
          return res.json();
        });

        bookName && setSuggestionBookName(data);
      };
      fetchSuggestions();
    }
  }, [bookName]);

  return (
    <>
      <ModalHeader className="flex flex-col gap-1">New record</ModalHeader>
      <ModalBody>
        <h1 className="ml-2 font-bold">Book name</h1>
        <AutoCompleteInput
          options={suggestionsBookName ? suggestionsBookName : [""]}
          placeholder={"Search"}
          setEditValue={editBookNameValue}
          handleSelection={handleSelection}
        />
        <p className="ml-2 mr-1 text-red-600">{error}</p>
        <p className="ml-2 mr-1">
          {user
            ? "This book is borrowed by: " + user.name + " " + user.surname
            : " "}
        </p>
      </ModalBody>
      <ModalFooter>
        <Button color="danger" variant="light" onPress={props.onClose}>
          Close
        </Button>
      </ModalFooter>
    </>
  );
}
