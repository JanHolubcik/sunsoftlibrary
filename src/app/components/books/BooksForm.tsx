"use client";
import mongoose, { ObjectId } from "mongoose";
import { Input } from "@nextui-org/input";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
  User,
} from "@nextui-org/react";
import { EditIcon } from "../../../../public/EditIcon";
import { VerticalDotsIcon } from "../../../../public/VerticalDotsIcons";
import { SetStateAction, useCallback, useRef, useState } from "react";
import EditModal from "./EditModal";
import DeleteModal from "./DeleteModal";
import useFormHook from "./useFormHook";
import NewModal from "./NewModal";
import LookModal from "./LookModal";

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

/**
 *  Universal form.
 * Note: for this to be universal i need to handle submit outside this component.
 * @param props Values from state from parent component.
 * @returns UniForm component.
 */
export default function BooksForm(props: props) {
  const {
    books,
    onOpen,
    editValue,
    setEditValue,
    isOpen,
    onOpenChange,
    action,
    openModalAndSearch,
    renderCell,
    openModalAndSetEdit,
    handleAction,
    openModalAndSetNew,
  } = useFormHook(props);

  return (
    <div className="flex flex-col">
      <Table
        onRowAction={(key) => openModalAndSetEdit(key as number)}
        aria-label="Example table with dynamic content"
      >
        <TableHeader columns={props.labels}>
          {(column) => (
            <TableColumn allowsSorting key={column.key}>
              {column.label}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={books}>
          {(item) => (
            <TableRow className="to-blue-950" key={item.key}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey, item.key)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <>
        <Modal
          isOpen={isOpen}
          onClose={() => {
            editValue;
          }}
          onOpenChange={onOpenChange}
        >
          <ModalContent>
            {(onClose) => {
              switch (action.current) {
                case "update": {
                  return (
                    <EditModal
                      editValue={editValue}
                      handleAction={handleAction}
                      setEditValue={setEditValue}
                      onClose={onClose}
                    ></EditModal>
                  );
                }
                case "delete": {
                  return (
                    <DeleteModal
                      bookID={editValue?._id}
                      bookName={editValue?.nameBook}
                      handleAction={handleAction}
                      onClose={onClose}
                    />
                  );
                }
                case "new": {
                  return (
                    <NewModal handleAction={handleAction} onClose={onClose} />
                  );
                }
                case "look": {
                  return (
                    <LookModal handleAction={handleAction} onClose={onClose} />
                  );
                }
              }
            }}
          </ModalContent>
        </Modal>
        <div className=" flex flex-row m-2 self-end">
          <Button
            onClick={() => openModalAndSetNew()}
            type="button"
            name="action"
            value="delete"
            color="primary"
            className="max-w-[200px] mr-5"
          >
            + Add new item
          </Button>
          <Button
            onClick={() => openModalAndSearch()}
            type="button"
            name="action"
            value="delete"
            color="secondary"
            className="max-w-[200px]"
          >
            Find who borrowed book
          </Button>
        </div>
      </>
    </div>
  );
}
