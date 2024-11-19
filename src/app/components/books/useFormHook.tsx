"use client";
import { VerticalDotsIcon } from "@/public/VerticalDotsIcons";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  useDisclosure,
  User,
} from "@nextui-org/react";
import mongoose from "mongoose";
import { useCallback, useEffect, useRef, useState } from "react";
import { booksObject, books } from "../../types/types";
import { EditIcon } from "@/public/EditIcon";
import { DeleteIcon } from "@/public/DeleteIcon";

type props = {
  formValues: (
    | {
        name: string;
        value: mongoose.Types.ObjectId;
        type: string;
      }
    | {
        name: string;
        value: string | undefined;
        type: string;
      }
    | {
        name: string;
        value: number | undefined;
        type: string;
      }
  )[][];
  newValues: {
    key: number;
    _id: mongoose.Types.ObjectId;
    author: string | undefined;
    nameBook: string | undefined;
    quantity: number | undefined;
  }[]; // any so we can make this component universal
  labels: {
    key: string;
    label: string;
  }[];
};

type edit = {
  key: number;
  _id: mongoose.Types.ObjectId;
  author: string | undefined;
  nameBook: string | undefined;
  quantity: number | undefined;
};

export default function useFormHook(props: props) {
  const [books, setBooks] = useState(props.newValues);
  const [newValues, setNewValues] = useState<books>();
  const [editValue, setEditValue] = useState<edit>();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const action = useRef<"update" | "delete" | "new" | "look">();

  const FindWhoHasThisBorrowed = async () => {};

  const refetch = async () => {
    const data = await fetch("/api/books", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    let res: books = await data.json();

    return res.map((val, index) => {
      return {
        key: index,
        _id: val._id,
        author: val.author,
        nameBook: val.bookName,
        quantity: val.sum,
      };
    });
  };

  const handleAction = async (
    action: "new" | "update" | "delete" | "look",
    newBook?: edit
  ) => {
    console.log("action: " + action);
    if (action === "new") {
      if (newBook) {
        newBook.key = books.length;
      }
      setBooks((prev) => {
        const newState = [...prev];
        newBook && newState.push(newBook);
        return newState;
      });
    }
    if (action === "update") {
      await fetch("/api/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookID: editValue?._id,
          author: editValue?.author,
          name: editValue?.nameBook,
          val: editValue?.quantity,
        }),
      });
      if (editValue?.key === 0) {
        //first row was not being updated, i have no idea why this should fix it for a while
        setBooks((prev) => {
          const newState = [...prev];
          editValue && (newState[0] = { ...editValue });
          return newState;
        });
      }
      setBooks((prev) => {
        const newState = [...prev];
        editValue?.key && (newState[editValue?.key] = { ...editValue });
        return newState;
      });
    }
    if (action === "delete") {
      await fetch("/api/books", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bookID: editValue?._id }),
      });
      setBooks((prev) => {
        const newState = [...prev];
        editValue?.key && newState.splice(editValue?.key);
        return newState;
      });
    }
  };

  const openModalAndSetEdit = (key: number) => {
    newValues;
    action.current = "update";
    console.log("update : " + JSON.stringify(books));
    setEditValue(books[key]);
    onOpen();
  };

  const openModalAndSetDelete = (key: number) => {
    action.current = "delete";
    setEditValue(books[key]);
    onOpen();
  };

  const openModalAndSetNew = () => {
    action.current = "new";

    onOpen();
  };

  const openModalAndSearch = () => {
    action.current = "look";

    onOpen();
  };

  const renderCell = useCallback(
    (book: any, columnKey: any, key: any) => {
      const cellValue = book[columnKey];

      switch (columnKey) {
        case "author":
          return (
            <>
              <User
                avatarProps={{ radius: "lg", src: book.avatar }}
                name={cellValue}
              ></User>
            </>
          );
        case "nameBook":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-sm capitalize">{cellValue}</p>
            </div>
          );
        case "quantity":
          return (
            <p className="relative flex justify-center items-center gap-2">
              {cellValue}
            </p>
          );
        case "actions":
          return (
            <div className="relative flex justify-end items-center gap-2">
              <Dropdown>
                <DropdownTrigger>
                  <Button isIconOnly size="sm" variant="light">
                    <VerticalDotsIcon
                      className="text-default-300"
                      width={undefined}
                      height={undefined}
                    />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu>
                  <DropdownItem
                    className="flex flex-row"
                    onPress={() => openModalAndSetEdit(key as number)}
                  >
                    <div className="flex flex-row ">
                      <div className="mt-1">
                        <EditIcon />
                      </div>
                      <p className="flex flex-row self-center ml-1 mb-1 ">
                        Edit
                      </p>
                    </div>
                  </DropdownItem>
                  <DropdownItem
                    className="flex flex-row"
                    onPress={() => openModalAndSetDelete(key as number)}
                  >
                    <div className="flex flex-row">
                      <DeleteIcon />
                      <p className="flex flex-row self-center ml-1">Delete</p>
                    </div>
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          );
        default:
          return cellValue;
      }
    },
    [books]
  );

  return {
    books,
    newValues,
    editValue,
    setEditValue,
    isOpen,
    onOpen,
    onOpenChange,
    action,
    renderCell,
    openModalAndSetEdit,
    handleAction,
    openModalAndSetNew,
    openModalAndSearch,
  };
}
