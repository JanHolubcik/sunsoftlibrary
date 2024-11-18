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
import { booksObject } from "../../types/types";

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
  const [editValue, setEditValue] = useState<edit>();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const action = useRef<"update" | "delete" | "new" | "look">();

  const FindWhoHasThisBorrowed = async () => {};

  const handleAction = async (
    action: "new" | "update" | "delete" | "look",
    newBook?: edit
  ) => {
    switch (action) {
      case "update": {
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
        break;
      }
      case "delete": {
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
        break;
      }
      case "new": {
      }
      case "look": {
      }
    }
  };

  const openModalAndSetEdit = (key: number) => {
    action.current = "update";
    setEditValue(books[key]);
    onOpen();
  };

  const openModalAndSetDelete = (key: number) => {
    action.current = "delete";
    setEditValue(books[key]);
    onOpen();
  };

  const openModalAndSetNew = () => {
    action.current = "look";

    onOpen();
  };

  const openModalAndSearch = () => {
    action.current = "look";

    onOpen();
  };

  const renderCell = useCallback((book: any, columnKey: any, key: any) => {
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
                  onPress={() => openModalAndSetEdit(key as number)}
                >
                  Edit
                </DropdownItem>
                <DropdownItem
                  onPress={() => openModalAndSetDelete(key as number)}
                >
                  Delete
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  return {
    books,
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
