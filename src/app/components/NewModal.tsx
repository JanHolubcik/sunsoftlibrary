import {
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import AutoCompleteInput from "./AutoComplete";

type props = {
  onClose: () => void;
};

export default function NewModal(props: props) {
  const handleSelection = async (selectedOption: string) => {
    console.log({ Selected: { selectedOption } });
  };
  const [state, setState] = useState({
    author: "",
    bookName: "",
    quantity: 0,
  });
  const [suggestionsAuthor, setSuggestionAuthor] = useState();
  const [suggestionsBookName, setSuggestionBookName] = useState();
  const [author, setAuthor] = useState("");
  const [bookName, setBookName] = useState("");
  console.log(state.author);
  const saveRecord = async () => {
    console.log(state);

    await fetch("/api/books", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        author: state.author,
        name: state.bookName,
        val: state.quantity,
        newRecord: true,
      }),
    }).catch((ERR) => console.log(ERR));
  };

  const editAuthorValue = (e: string) => {
    //console.log(e);
    setBookName("");
    setAuthor(e);
    setState((prev) => {
      const newState = prev;
      newState.author = e;

      return newState;
    });
  };

  const editBookNameValue = (e: string) => {
    setBookName(e);
    setAuthor("");
    setState((prev) => {
      const newState = prev;
      newState.bookName = e;
      return newState;
    });
  };

  useEffect(() => {
    if (author.length > 1 || bookName.length > 1) {
      const fetchSuggestions = async () => {
        const data = await fetch(
          `/api/books?author=${author}&bookName=${bookName}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        ).then((res) => {
          return res.json();
        });

        author && setSuggestionAuthor(data);
        bookName && setSuggestionBookName(data);
      };
      fetchSuggestions();
    }
  }, [author, bookName]);

  return (
    <>
      <ModalHeader className="flex flex-col gap-1">New record</ModalHeader>
      <ModalBody>
        <h1 className="ml-2  font-bold">Author</h1>
        <AutoCompleteInput
          options={suggestionsAuthor ? suggestionsAuthor : [""]}
          placeholder={"Search"}
          setEditValue={editAuthorValue}
          handleSelection={handleSelection}
        />
        <h1 className="ml-2 font-bold">Book name</h1>
        <AutoCompleteInput
          options={suggestionsBookName ? suggestionsBookName : [""]}
          placeholder={"Search"}
          setEditValue={editBookNameValue}
          handleSelection={handleSelection}
        />
        <h1 className="ml-2 font-bold">Quantity</h1>
        <Input
          className="ml-1 mr-1"
          labelPlacement="outside"
          color="default"
          onChange={(e) =>
            setState((prev) => {
              const newState = prev;
              newState.quantity = Number(e.target.value);
              return newState;
            })
          }
        />
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
