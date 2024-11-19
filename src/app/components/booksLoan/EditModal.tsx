import {
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@nextui-org/react";
import mongoose from "mongoose";

import {
  ChangeEvent,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import AutoCompleteInput from "../AutoComplete";
import {
  bookLoanObject,
  books,
  booksObject,
  users,
  usersObject,
} from "../../types/types";
import AutoCompleteInputLoan from "./AutoCompleteInputLoan";
import DatePicker from "react-datepicker";

type edit = {
  key: number;
  _id: mongoose.Types.ObjectId;
  author: string | undefined;
  nameBook: string | undefined;
  quantity: number | undefined;
};

type props = {
  setEditValue: (value: SetStateAction<bookLoanObject | undefined>) => void;
  handleAction: (action: "new" | "update" | "delete") => Promise<void>;
  onClose: () => void;
  editValue: bookLoanObject | undefined;
};
const data = ["One", "Two", "Three"];
export default function EditModal(props: props) {
  const [suggestionUser, setSuggestionUser] = useState<users>();
  const [error, setError] = useState("");
  const [user, setSetUser] = useState("");

  const handleSuggestionUser = (index: number) => {
    suggestionUser &&
      props.setEditValue((prev) => {
        const newState = prev;
        newState!.userInfo.name = suggestionUser[index].name;
        newState!.userInfo.surname = suggestionUser[index].surname;
        newState!.userInfo.IDnumber = suggestionUser[index].IDnumber;

        return newState;
      });

    suggestionUser && console.log(suggestionUser[index]);
  };

  useEffect(() => {
    if (user.length > 1) {
      const fetchSuggestions = async () => {
        const data = await fetch(`/api/booksloan?user=${user}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }).then((res) => {
          return res.json();
        });

        user && setSuggestionUser(data);
      };
      fetchSuggestions();
    }
  }, [user]);

  const editUserValue = (e: string) => {
    setSetUser(e);

    props.setEditValue((prev) => {
      const newState = prev;
      if (newState) {
        newState.userInfo.name = e;
      }
      return newState;
    });
  };

  return (
    <>
      <ModalHeader className="flex flex-col gap-1">Edit View</ModalHeader>
      <ModalBody>
        <h1 className="ml-2  font-bold">Author</h1>
        <Input
          className="ml-1 mr-1"
          labelPlacement="outside"
          value={props.editValue?.bookInfo.author}
          color="default"
          readOnly
        />
        <h1 className="ml-2 font-bold">Book name</h1>
        <Input
          className="ml-1 mr-1"
          labelPlacement="outside"
          value={props.editValue?.bookInfo.bookName}
          color="default"
          readOnly
        />

        <h1 className="ml-2 font-bold">Quantity</h1>
        <Input
          className="ml-1 mr-1"
          labelPlacement="outside"
          type="number"
          placeholder={props.editValue?.quantity?.toString()}
          color="default"
          onChange={(e) => {
            if (props.editValue)
              props.setEditValue((prev) => {
                const newState = prev;
                if (newState) newState.quantity = Number(e.target.value);
                return newState;
              });
          }}
        />
        <h1 className="ml-2 font-bold">Borrower</h1>
        <AutoCompleteInputLoan
          options={
            suggestionUser
              ? suggestionUser.map((val) => {
                  return { option: val.name + " " + val.surname, _id: val._id };
                })
              : []
          }
          placeholder={"Search"}
          setEditValue={editUserValue}
          handleSelection={handleSuggestionUser}
        />
        <h1 className="ml-2 font-bold">Date of borrowing</h1>
        <DatePicker
          className="bg-zinc-800 ml-1 mr-1 p-2 rounded-xl w-full border-none focus:border-none border-1"
          selected={props.editValue?.dateFrom}
          dateFormat="dd/MM/yyyy"
          onChange={(e) => {
            props.setEditValue((prev) => {
              const newState = prev;
              if (newState)
                // type asserting as any, iso is a string but work like Date maybe i will fix this later
                e ? (newState.dateFrom = e.toISOString() as any) : new Date();
              return newState;
            });
          }}
        />
        <h1 className="ml-2 font-bold">Date of return</h1>
        <DatePicker
          className="bg-zinc-800 ml-1 mr-1 p-2 rounded-xl w-full border-none focus:border-none border-1"
          selected={props.editValue?.dateTo}
          dateFormat="dd/MM/yyyy"
          onChange={(e) => {
            props.setEditValue((prev) => {
              const newState = prev;
              if (newState)
                // type asserting as any, iso is a string but work like Date maybe i will fix this later
                e ? (newState.dateTo = e.toISOString() as any) : new Date();
              return newState;
            });
          }}
        />
        {props.editValue?.dateTo && (
          <div className="m-1 w-full rounded-lg bg-amber-500">
            <p className="p-1 m-1">Can't no longer edit returned book.</p>
          </div>
        )}
      </ModalBody>
      <ModalFooter>
        <Button color="danger" variant="light" onPress={props.onClose}>
          Close
        </Button>
        <Button
          type="button"
          className="flex-2 m-1"
          color="primary"
          disabled={props.editValue?.dateTo ? true : false}
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
