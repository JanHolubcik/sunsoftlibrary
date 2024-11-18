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

import { SetStateAction, useState } from "react";

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
  const [error, setError] = useState("");
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

          <p className="ml-1 mr-1 text-red-600">{error}</p>
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
            if (
              props.editValue?.name &&
              props.editValue?.surname &&
              props.editValue?.userEmail &&
              props.editValue?.dateOfBirth &&
              props.editValue.name.length > 1 &&
              props.editValue?.surname?.length > 1 &&
              props.editValue?.userEmail.length > 1
            ) {
              const pattern =
                /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
              if (pattern.test(props.editValue?.userEmail)) {
                setError("");
                props.handleAction("update");
                props.onClose();
              } else {
                setError("Email is incorrect");
              }
            } else {
              setError("Values are not correctly filled out!");
            }
          }}
        >
          Save
        </Button>
      </ModalFooter>
    </>
  );
}
