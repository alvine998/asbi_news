import { XIcon } from "lucide-react";
import React from "react";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
};

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 ">
      <div className="bg-white rounded-lg shadow-lg lg:w-full w-11/12 lg:max-w-xl max-w-full p-6 relative overflow-y-auto h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-black focus:outline-none"
        >
          <XIcon />
        </button>
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        {children}
      </div>
    </div>
  );
};

export default Modal;
