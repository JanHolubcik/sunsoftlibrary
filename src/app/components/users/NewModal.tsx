import {
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import AutoCompleteInput from "../AutoComplete";
import DatePicker from "react-datepicker";
import mongoose from "mongoose";

type props = {
  onClose: () => void;
  handleAction: (
    action: "new" | "update" | "delete",
    newBook: edit
  ) => Promise<void>;
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
export default function NewModal(props: props) {
  const [state, setState] = useState({
    name: "",
    surname: "",
    dateOfBirth: new Date(),
    IDnumber: "",
    userEmail: "",
  });
  const [error, setError] = useState("");
  const saveRecord = async () => {
    const data = await fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        newRecord: true,
        IDnumber: state.IDnumber,
        name: state?.name,
        surname: state?.surname,
        dateOfBirth: state?.dateOfBirth,
        userEmail: state?.userEmail,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .catch((ERR) => {
        console.log(ERR);
      });

    const returnVal = {
      ...data,
    };
    return returnVal;
  };

  return (
    <>
      <ModalHeader className="flex flex-col gap-1">New record</ModalHeader>
      <ModalBody>
        <h1 className="ml-2  font-bold">ID number</h1>

        <Input
          className="m-1"
          labelPlacement="outside"
          placeholder={"Place ID number here..."}
          color="default"
          onChange={(e) => {
            setState((prev) => {
              const newState = prev;
              if (newState) newState.IDnumber = e.target.value;
              return newState;
            });
          }}
        />
        <h1 className="ml-2  font-bold">Name</h1>

        <Input
          className="m-1"
          labelPlacement="outside"
          placeholder={"Place name here..."}
          color="default"
          onChange={(e) => {
            setState((prev) => {
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
          color="default"
          placeholder={"Place surname here..."}
          onChange={(e) => {
            setState((prev) => {
              const newState = prev;
              if (newState) newState.surname = e.target.value;
              return newState;
            });
          }}
        />

        <h1 className="ml-2  font-bold">Date of birth</h1>

        <DatePicker
          className="bg-zinc-800 ml-1 mr-1 p-2 rounded-xl w-full border-none focus:border-none border-1"
          selected={state.dateOfBirth}
          dateFormat="dd/MM/yyyy"
          onChange={(e) => {
            setState((prev) => {
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
            color="default"
            placeholder={"Place email here..."}
            type="email"
            onChange={(e) => {
              setState((prev) => {
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
          className="flex-2 m-1"
          color="primary"
          onPress={async () => {
            if (
              state?.IDnumber &&
              state?.name &&
              state?.userEmail &&
              state?.surname &&
              state?.dateOfBirth &&
              state?.IDnumber.length > 1 &&
              state.userEmail.length > 1 &&
              state?.surname?.length > 1 &&
              state?.name.length > 1
            ) {
              const pattern =
                /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
              if (
                pattern.test(state?.userEmail) &&
                state?.IDnumber.toLowerCase().match(/^[A-Za-z]{2}[0-9]{6}$/)
              ) {
                setError("");
                const newData = await saveRecord();
                props.handleAction("new", newData);
                props.onClose();
              } else {
                setError("Email or ID number is incorrect");
              }
            } else {
              setError("Values are not correctly filled out!");
            }
          }}
        >
          Save new record
        </Button>
      </ModalFooter>
    </>
  );
}
