"use client";
import mongoose, { ObjectId } from "mongoose";
import { Input } from "@nextui-org/input";
import { Button, Link } from "@nextui-org/react";
import { FormEvent } from "react";
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
    //next auth logging to session
    const author = formData.get("author");
    const sum = formData.get("val");
    const bookName = formData.get("bookName");
    const bookID = formData.get("id");
    alert(
      JSON.stringify(author) +
        " " +
        JSON.stringify(sum) +
        " " +
        JSON.stringify(bookName) +
        " " +
        JSON.stringify(bookID) +
        " "
    );

    await fetch("/api/books", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ bookID, author, name: bookName, val: sum }),
    });
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
              name="update"
              type="submit"
              className="flex-2"
              color="success"
            >
              Save
            </Button>
            <Button name="delete" className="flex-5" color="danger">
              Delete
            </Button>
          </form>
        );
      })}
    </div>
  );
}
