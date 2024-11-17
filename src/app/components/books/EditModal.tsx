import {
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@nextui-org/react";
import mongoose from "mongoose";

import { ChangeEvent, SetStateAction, useEffect, useState } from "react";
import AutoCompleteInput from "../AutoComplete";
import { books } from "../../types/types";

type edit = {
  key: number;
  _id: mongoose.Types.ObjectId;
  author: string | undefined;
  nameBook: string | undefined;
  quantity: number | undefined;
};

type props = {
  setEditValue: (value: SetStateAction<edit | undefined>) => void;
  handleAction: (action: "new" | "update" | "delete") => Promise<void>;
  onClose: () => void;
  editValue: edit | undefined;
};
const data = ["One", "Two", "Three"];
export default function EditModal(props: props) {
  const [suggestionsAuthor, setSuggestionAuthor] = useState();
  const [suggestionsBookName, setSuggestionBookName] = useState();
  const [author, setAuthor] = useState("");
  const [bookName, setBookName] = useState("");

  const handleSelection = async (selectedOption: string) => {
    console.log({ Selected: { selectedOption } });
  };

  useEffect(() => {
    if (author.length > 1 || bookName.length > 1) {
      const fetchSuggestions = async () => {
        const data = await fetch(
          `/api/books?author=${author}&bookName=${bookName}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        ).then((res) => {
          return res.json();
        });

        author && setSuggestionAuthor(data);
        bookName && setSuggestionBookName(data);
      };
      fetchSuggestions();
    }
  }, [author, bookName]);

  const editAuthorValue = (e: string) => {
    setAuthor(e);
    setBookName("");
    props.setEditValue((prev) => {
      const newState = prev;
      if (newState) newState.author = e;
      return newState;
    });
  };

  const editBookNameValue = (e: string) => {
    setAuthor("");
    setBookName(e);
    props.setEditValue((prev) => {
      const newState = prev;
      if (newState) newState.nameBook = e;
      return newState;
    });
  };

  return (
    <>
      <ModalHeader className="flex flex-col gap-1">Edit View</ModalHeader>
      <ModalBody>
        <h1 className="ml-2  font-bold">Author</h1>
        <AutoCompleteInput
          options={
            suggestionsAuthor ? suggestionsAuthor : data.map((v: string) => v)
          }
          placeholder={props.editValue?.author}
          setEditValue={editAuthorValue}
          handleSelection={handleSelection}
        />
        <h1 className="ml-2 font-bold">Book name</h1>
        <AutoCompleteInput
          options={
            suggestionsBookName
              ? suggestionsBookName
              : data.map((v: string) => v)
          }
          placeholder={props.editValue?.nameBook}
          setEditValue={editBookNameValue}
          handleSelection={handleSelection}
        />
        <h1 className="ml-2 font-bold">Quantity</h1>
        <Input
          className="ml-1 mr-1"
          labelPlacement="outside"
          placeholder={props.editValue?.quantity?.toString()}
          color="default"
          onChange={(e) =>
            props.setEditValue((prev) => {
              const newState = prev;
              if (newState) newState.quantity = Number(e.target.value);
              return newState;
            })
          }
        />
      </ModalBody>
      <ModalFooter>
        <Button color="danger" variant="light" onPress={props.onClose}>
          Close
        </Button>
        <Button
          type="button"
          className="flex-2 m-1"
          color="primary"
          onPress={() => {
            props.handleAction("update");
            props.onClose();
          }}
        >
          Save
        </Button>
      </ModalFooter>
    </>
  );
}
