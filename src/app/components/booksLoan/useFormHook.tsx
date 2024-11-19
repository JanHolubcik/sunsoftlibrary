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
import { format } from "date-fns";
import { DeleteIcon } from "../../../../public/DeleteIcon";
import { EditIcon } from "../../../../public/EditIcon";
import { UserIcon } from "../../../../public/UserIcon";
type props = {
  newValues: bookLoan; // any so we can make this component universal
  labels: {
    key: string;
    label: string;
  }[];
};

export default function useFormHook(props: props) {
  const [books, setBooks] = useState(props.newValues);
  const [editValue, setEditValue] = useState<bookLoanObject>();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const action = useRef<"update" | "delete" | "new">();

  // for bookloans im refetching the values when creating new
  const refetch = async () => {
    const data = await fetch("/api/booksloan", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    let res: bookLoan = await data.json();

    return res.map((val, index) => {
      return {
        ...val,
        author: val.bookInfo.author,
        nameBook: val.bookInfo.bookName,
        username: val.userInfo.name + " " + val.userInfo.surname,
        from: val.dateFrom,
        quantity: val.sum,
        to: val.dateTo,
        key: index,
      };
    });
  };
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
      case "new": {
        const newVal = await refetch();
        setEditValue(books[books.length]);
        console.log(newVal);
        setBooks(newVal);
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
    console.log(columnKey, book[columnKey]);
    switch (columnKey) {
      case "username":
        return (
          <User
            avatarProps={{ radius: "lg", src: book.avatar }}
            name={cellValue}
          ></User>
        );
      case "nameBook":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">{cellValue}</p>
          </div>
        );
      case "author": {
        return (
          <User
            avatarProps={{ radius: "lg", src: book.avatar }}
            name={cellValue}
          ></User>
        );
      }
      case "quantity":
        return (
          <p className="relative flex justify-center items-center gap-2">
            {cellValue}
          </p>
        );
      case "from":
        return (
          <p className="relative flex justify-center items-center gap-2">
            {format(cellValue, "dd/MM/yyyy")}
          </p>
        );
      case "to":
        return (
          <p className="relative flex justify-center items-center gap-2">
            {cellValue ? format(cellValue, "dd/MM/yyyy") : ""}
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
                  <EditIcon></EditIcon>
                  Edit
                </DropdownItem>
                <DropdownItem
                  className="flex flex-row"
                  onPress={() => openModalAndSetDelete(key as number)}
                >
                  <DeleteIcon />
                  <UserIcon />
                  <p>Delete</p>
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
