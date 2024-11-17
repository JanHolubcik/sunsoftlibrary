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

type props = {
  onClose: () => void;
};

export default function NewModal(props: props) {
  const [state, setState] = useState({
    name: "",
    surname: "",
    dateOfBirth: new Date(),
    IDnumber: "",
    userEmail: "",
  });
  const [suggestionsAuthor, setSuggestionAuthor] = useState();
  const [suggestionsBookName, setSuggestionBookName] = useState();
  const [author, setAuthor] = useState("");
  const [bookName, setBookName] = useState("");

  const saveRecord = async () => {
    await fetch("/api/users", {
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
    }).catch((ERR) => console.log(ERR));
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
          onPress={() => {
            saveRecord();
            props.onClose();
          }}
        >
          Save new record
        </Button>
      </ModalFooter>
    </>
  );
}
