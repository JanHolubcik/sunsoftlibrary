import {
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@nextui-org/react";
import mongoose from "mongoose";

import { SetStateAction } from "react";

type props = {
  IDnumber: string | undefined;
  user: string | undefined;
  handleAction: (action: "new" | "update" | "delete") => Promise<void>;
  onClose: () => void;
};

export default function DeleteModal(props: props) {
  return (
    <>
      <ModalHeader className="flex flex-col gap-1">Delete View</ModalHeader>
      <ModalBody>
        <h1 className="ml-2  font-bold">
          Are you sure you want to delete this record ?{" "}
          {" (Deleting " + props.user + ")"}
        </h1>
      </ModalBody>
      <ModalFooter>
        <Button color="danger" variant="light" onPress={props.onClose}>
          Close
        </Button>
        <Button
          type="button"
          className="flex-2 m-1"
          color="danger"
          onPress={() => {
            props.handleAction("delete");
            props.onClose();
          }}
        >
          Delete
        </Button>
      </ModalFooter>
    </>
  );
}
