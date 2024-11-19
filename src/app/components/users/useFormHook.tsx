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
import { CalendarIcon } from "../../../../public/CalendarIcon";
import { format } from "date-fns";
import { DeleteIcon } from "../../../../public/DeleteIcon";
import { EditIcon } from "@/public/EditIcon";
import { EmailIcon } from "@/public/EmailIcon";

type props = {
  newValues: {
    _id: mongoose.Types.ObjectId;
    key: number;
    name: string | undefined;
    surname: string | undefined;
    dateOfBirth: Date | undefined;
    IDnumber: string | undefined;
    userEmail: string | undefined;
  }[];
  labels: {
    key: string;
    label: string;
  }[];
};

type edit = {
  _id: mongoose.Types.ObjectId;
  key: number;
  name: string | undefined;
  surname: string | undefined;
  dateOfBirth: Date | undefined;
  IDnumber: string | undefined;
  userEmail: string | undefined;
};

export default function useFormHook(props: props) {
  const [books, setBooks] = useState(props.newValues);
  const [editValue, setEditValue] = useState<edit>();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const action = useRef<"update" | "delete" | "new">();

  const handleAction = async (
    action: "new" | "update" | "delete",
    newBook?: edit
  ) => {
    switch (action) {
      case "update": {
        await fetch("/api/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            _id: editValue?._id,
            name: editValue?.name,
            surname: editValue?.surname,
            dateOfBirth: editValue?.dateOfBirth,
            IDnumber: editValue?.IDnumber,
            userEmail: editValue?.userEmail,
          }),
        });
        debugger;
        setBooks((prev) => {
          const newState = [...prev];
          editValue?.key && (newState[editValue?.key] = { ...editValue });
          return newState;
        });
        break;
      }
      case "delete": {
        await fetch("/api/users", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ IDnumber: editValue?.IDnumber }),
        });
        setBooks((prev) => {
          const newState = [...prev];
          editValue?.key && newState.splice(editValue?.key);
          return newState;
        });
        break;
      }
      case "new": {
        if (newBook) {
          newBook.key = books.length;
        }

        setBooks((prev) => {
          const newState = [...prev];
          newBook && newState.push(newBook);
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

  const renderCell = useCallback(
    (book: any, columnKey: any, key: any) => {
      const cellValue = book[columnKey];
      console.log(columnKey);
      switch (columnKey) {
        case "name":
          return (
            <>
              <User
                avatarProps={{ radius: "lg", src: book.avatar }}
                name={cellValue + " " + book["surname"]}
              ></User>
            </>
          );

        case "idNumber":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-sm capitalize">{cellValue}</p>
            </div>
          );
        case "userEmail":
          return (
            <div className="flex flex-row">
              <p className="relative flex flex-row gap-1  items-center ">
                <EmailIcon />
                {cellValue}
              </p>
            </div>
          );
        case "dateOfBirth":
          return (
            <p className="relative flex gap-1  items-center ">
              <CalendarIcon />

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
