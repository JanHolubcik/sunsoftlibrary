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
import { useCallback, useRef, useState } from "react";
import { bookLoan, bookLoanObject } from "../../types/types";

type props = {
  newValues: bookLoan; // any so we can make this component universal
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
  const [editValue, setEditValue] = useState<bookLoanObject>();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const action = useRef<"update" | "delete" | "new">();

  const handleAction = async (action: "new" | "update" | "delete") => {
    switch (action) {
      case "update": {
        await fetch("/api/booksloan", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            _id: editValue?._id,
            bookID: editValue?.bookID,
            userID: editValue?.userID,
            sum: editValue?.quantity,
            dateFrom: editValue?.dateFrom,
            dateTo: editValue?.dateTo,
          }),
        });

        setBooks((prev) => {
          const newState = [...prev];
          editValue?.key && (newState[editValue?.key] = { ...editValue });
          editValue?.key &&
            (newState[editValue?.key].from = editValue?.dateFrom);
          editValue?.key && (newState[editValue?.key].to = editValue?.dateTo);
          return newState;
        });
        break;
      }
      case "delete": {
        await fetch("/api/booksloan", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            _id: editValue?._id,
            sum: editValue?.sum,
            bookID: editValue?.bookID,
          }),
        });
        setBooks((prev) => {
          const newState = [...prev];
          editValue?.key && newState.splice(editValue?.key);
          return newState;
        });
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
    action.current = "new";

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
  };
}
