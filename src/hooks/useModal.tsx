import { useState } from "react";

export const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const [data, setData] = useState<any>();
  const [key, setKey] = useState<string>("");

  return {
    isOpen,
    openModal,
    closeModal,
    data,
    setData,
    key,
    setKey,
  };
};
