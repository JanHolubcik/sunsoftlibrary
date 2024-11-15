"use client";
import mongoose, { ObjectId } from "mongoose";
import { Input } from "@nextui-org/input";
import { Button, Link } from "@nextui-org/react";
import { FormEvent, useRef } from "react";
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
  labels: string[];
};
/**
 *  Universal form.
 * @param props Values from state from parent component.
 * @returns UniForm component.
 */
export default function UniForm(props: props) {
  const pressedButton = useRef<string>();
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const inputs = document.querySelectorAll("input");

    inputs.forEach((input) => {
      // If the input value is empty, set it to the placeholder value
      if (input.value.trim() === "") {
        input.value = input.placeholder;
      }
    });

    const formData = new FormData(event.currentTarget);
    const action = formData.get("action");

    const author = formData.get("author");
    const sum = formData.get("val");
    const bookName = formData.get("bookName");
    const bookID = formData.get("id");
    alert(
      JSON.stringify(pressedButton.current) +
        " " +
        JSON.stringify(sum) +
        " " +
        JSON.stringify(bookName) +
        " " +
        JSON.stringify(bookID) +
        " "
    );

    if (pressedButton.current === "update") {
      await fetch("/api/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bookID, author, name: bookName, val: sum }),
      });
    } else if (pressedButton.current === "delete") {
      await fetch("/api/books", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bookID }),
      });
    }
  };
  return (
    <div className="flex flex-col">
      {props.formValues.map((input, index) => {
        return (
          <form
            key={index}
            onSubmit={handleSubmit}
            className="flex flex-1 flex-row"
          >
            {input.map((input, index) => {
              return (
                <Input
                  readOnly={index === 0 ? true : false}
                  key={index}
                  className="flex-4"
                  name={input.name}
                  labelPlacement="outside"
                  placeholder={input.value?.toString()}
                  color="default"
                />
              );
            })}
            <Button
              onClick={() => {
                pressedButton.current = "update";
              }}
              id="action"
              name="action"
              value="update"
              type="submit"
              className="flex-2"
              color="success"
            >
              Save
            </Button>
            <Button
              onClick={() => {
                pressedButton.current = "delete";
                props.formValues.splice(index, 1);
              }}
              name="action"
              value="delete"
              className="flex-5"
              color="danger"
              type="submit"
            >
              Delete
            </Button>
          </form>
        );
      })}
    </div>
  );
}
