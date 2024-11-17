import {
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  DateValue,
} from "@nextui-org/react";
import mongoose from "mongoose";
import "react-datepicker/dist/react-datepicker.css";

import { ChangeEvent, SetStateAction, useEffect, useState } from "react";
import AutoCompleteInput from "../AutoComplete";
import { books } from "../../types/types";
import { useDateFormatter } from "@react-aria/i18n";
import { format } from "path/posix";
import {
  getLocalTimeZone,
  parseDate,
  today,
  AnyCalendarDate,
  parseAbsoluteToLocal,
} from "@internationalized/date";
import DatePicker, { CalendarContainer } from "react-datepicker";

type edit = {
  _id: mongoose.Types.ObjectId;
  key: number;
  name: string | undefined;
  surname: string | undefined;
  dateOfBirth: Date | undefined;
  IDnumber: string | undefined;
  userEmail: string | undefined;
};

type props = {
  setEditValue: (value: SetStateAction<edit | undefined>) => void;
  handleAction: (action: "new" | "update" | "delete") => Promise<void>;
  onClose: () => void;
  editValue: edit | undefined;
};
const data = ["One", "Two", "Three"];
export default function EditModal(props: props) {
  return (
    <>
      <ModalHeader className="flex flex-col gap-1">Edit View</ModalHeader>
      <ModalBody className="h-80">
        <h1 className="ml-2  font-bold">Name</h1>

        <Input
          className="m-1"
          labelPlacement="outside"
          placeholder={props.editValue?.name}
          color="default"
          onChange={(e) => {
            props.setEditValue((prev) => {
              const newState = prev;
              if (newState) newState.name = e.target.value;
              return newState;
            });
          }}
        />
        <h1 className="ml-2  font-bold">Surname</h1>

        <Input
          className="m-1"
          labelPlacement="outside"
          placeholder={props.editValue?.surname}
          color="default"
          onChange={(e) => {
            props.setEditValue((prev) => {
              const newState = prev;
              if (newState) newState.surname = e.target.value;
              return newState;
            });
          }}
        />

        <h1 className="ml-2  font-bold">Date of birth</h1>

        <DatePicker
          className="bg-zinc-800 ml-1 mr-1 p-2 rounded-xl w-full border-none focus:border-none border-1"
          selected={props.editValue?.dateOfBirth}
          dateFormat="dd/MM/yyyy"
          onChange={(e) => {
            props.setEditValue((prev) => {
              const newState = prev;
              if (newState)
                // type asserting as any, iso is a string but work like Date maybe i will fix this later
                e
                  ? (newState.dateOfBirth = e.toISOString() as any)
                  : new Date();
              return newState;
            });
          }}
        />
        <h1 className="ml-2  font-bold">User email</h1>
        <div className="mb-12">
          <Input
            defaultValue=""
            className="m-1 mb-8"
            labelPlacement="outside"
            placeholder={props.editValue?.userEmail}
            color="default"
            onChange={(e) => {
              props.setEditValue((prev) => {
                const newState = prev;
                if (newState) newState.userEmail = e.target.value;
                return newState;
              });
            }}
          />
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color="danger" variant="light" onPress={props.onClose}>
          Close
        </Button>
        <Button
          type="button"
          className="flex-2 m-1 mb-5"
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