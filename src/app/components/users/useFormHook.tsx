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

  const handleAction = async (action: "new" | "update" | "delete") => {
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
      case "name":
        return (
          <>
            <User
              avatarProps={{ radius: "lg", src: book.avatar }}
              name={cellValue}
            ></User>
          </>
        );
      case "surname":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">{cellValue}</p>
          </div>
        );
      case "idNumber":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">{cellValue}</p>
          </div>
        );
      case "date":
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
