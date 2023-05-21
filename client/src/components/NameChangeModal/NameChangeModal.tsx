import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import React, { useState } from "react";

interface NameChangeModalProps {
  modalIsOpen: boolean;
  setModalClose: (newVal: boolean) => void;
  sendNewName: (newName: string) => void;
  emitData: (newName: string) => void;
  oldName: string;
}

const NameChangeModal = ({
  modalIsOpen,
  setModalClose,
  sendNewName,
  emitData,
  oldName,
}: NameChangeModalProps) => {
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);

  const [newName, setNewName] = useState<string>("");

  const submitModal = () => {
    if (newName.length > 0 && newName !== oldName) {
      sendNewName(newName);
      emitData(newName);
      setModalClose(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      submitModal();
    }
  };

  return (
    <>
      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={modalIsOpen}
        onClose={() => setModalClose(false)}
      >
        <ModalOverlay />
        <ModalContent>
          <FormControl>
            <ModalHeader>Change Display Name</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <FormLabel>Enter a new name:</FormLabel>
              <Input
                ref={initialRef}
                placeholder="First name"
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </ModalBody>
            <ModalFooter>
              <Button
                colorScheme="blue"
                mr={3}
                disabled={newName.length === 0}
                type="submit"
                onClick={submitModal}
              >
                Save
              </Button>
              <Button onClick={() => setModalClose(false)}>Cancel</Button>
            </ModalFooter>
          </FormControl>
        </ModalContent>
      </Modal>
    </>
  );
};
export default NameChangeModal;
