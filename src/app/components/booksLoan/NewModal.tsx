import {
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import AutoCompleteInput from "../AutoComplete";
import {
  bookLoan,
  bookLoanObject,
  books,
  booksObject,
  users,
  usersObject,
} from "../../types/types";
import AutoCompleteInputLoan from "./AutoCompleteInputLoan";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
type props = {
  onClose: () => void;
  handleAction: (action: "new" | "update" | "delete") => Promise<void>;
};

export default function NewModal(props: props) {
  const [state, setState] = useState({
    name: "",
    author: "",
    bookName: "",
    userID: "",
    bookID: "",
    sum: 0,
    dateFrom: new Date(),
    dateTo: null,
  });
  const [book, setBook] = useState<bookLoanObject>();
  const [userOB, setUserOB] = useState<usersObject>();
  const [suggestionUser, setSuggestionUser] = useState<users>();
  const [suggestionsBookName, setSuggestionBookName] = useState<bookLoan>();
  const [user, setSetUser] = useState("");
  const [bookName, setBookName] = useState("");
  const [error, setError] = useState("");
  const handleSelectionBook = (index: number) => {
    suggestionsBookName && setBook(suggestionsBookName[index]);
  };
  const handleSuggestionUser = (index: number) => {
    suggestionUser && setUserOB(suggestionUser[index]);
  };

  const saveRecord = async () => {
    await fetch("/api/booksloan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userID: userOB?.IDnumber,
        bookID: book?._id,
        sum: state?.sum,
        dateFrom: state?.dateFrom,
        dateTo: state?.dateTo,
        newRecord: true,
      }),
    }).catch((ERR) => console.log(ERR));
  };

  const editBookNameValue = (e: string) => {
    setBookName(e);
    setSetUser("");
    setState((prev) => {
      const newState = prev;
      newState.bookName = e;
      return newState;
    });
  };

  const editUserValue = (e: string) => {
    setBookName("");
    setSetUser(e);
    setState((prev) => {
      const newState = prev;
      newState.name = e;
      return newState;
    });
  };

  useEffect(() => {
    if (bookName || user) {
      const fetchSuggestions = async () => {
        const data = await fetch(
          `/api/booksloan?bookName=${bookName}&user=${user}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        ).then((res) => {
          return res.json();
        });

        bookName && setSuggestionBookName(data);
        user && setSuggestionUser(data);
      };
      fetchSuggestions();
    }
  }, [bookName, user]);

  return (
    <>
      <ModalHeader className="flex flex-col gap-1">Create record</ModalHeader>
      <ModalBody>
        <h1 className="ml-2 font-bold">Date of borrowing</h1>
        <DatePicker
          className="bg-zinc-800 ml-1 mr-1 p-2 rounded-xl w-full border-none focus:border-none border-1"
          selected={state.dateFrom}
          dateFormat="dd/MM/yyyy"
          onChange={(e) => {
            setState((prev) => {
              const newState = prev;
              if (newState)
                // type asserting as any, iso is a string but work like Date maybe i will fix this later
                e ? (newState.dateFrom = e.toISOString() as any) : new Date();
              return newState;
            });
          }}
        />
        <h1 className="ml-2 font-bold">Book name</h1>
        <AutoCompleteInputLoan
          options={
            suggestionsBookName
              ? suggestionsBookName.map((val) => {
                  //@ts-ignore
                  return { option: val.bookName, _id: val._id };
                })
              : []
          }
          placeholder={"Search"}
          setEditValue={editBookNameValue}
          handleSelection={handleSelectionBook}
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

        <h1 className="ml-2 font-bold">
          Quantity{book?.sum && " (max " + book?.sum + ")"}
        </h1>
        <Input
          className="ml-1 mr-1"
          labelPlacement="outside"
          color="default"
          onChange={(e) =>
            setState((prev) => {
              const newState = prev;
              newState.sum = Number(e.target.value);
              return newState;
            })
          }
        />
        <p className="ml-2 mr-1 text-red-600">{error}</p>
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
            debugger;
            if (
              book?.sum &&
              state?.dateFrom &&
              userOB?.IDnumber &&
              state?.sum > -1 &&
              book?.sum >= state?.sum
            ) {
              await saveRecord();
              await props.handleAction("new");
              props.onClose();
            } else {
              if (userOB?.IDnumber && book?._id) {
                setError("Values are wrongly filled");
              } else {
                setError("Borrower or book doesn't exists in database");
              }
            }
          }}
        >
          Save new record
        </Button>
      </ModalFooter>
    </>
  );
}
