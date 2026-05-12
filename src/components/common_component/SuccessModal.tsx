import React from "react";
import Modal from "../Modal";
import SuccessModalCheckIcon from "../../assets/SuccessModalCheckIcon.svg";
import Button from "./Button";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subTitle?: string;
  buttonText?: string;
  children?: React.ReactNode;
  isLogoBottom?: boolean;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  onClose,
  title = "Entry Added",
  subTitle,
  buttonText = "Ok",
  children,
  isLogoBottom=true
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} width="max-w-lg" hideHeader={true}>
      <div className="flex flex-col items-center text-center justify-center p-4">
            {!isLogoBottom && (
          <div className="md:-mt-6 md:-mb-6">
            <img
              src={SuccessModalCheckIcon}
              alt="Success"
              className="md:w-40 md:h-40 w-36 h-36 mb-10"
            />
          </div>
        )}
        <h2 className="text-xl sm:text-xl md:text-2xl font-semibold text-black mb-1 mx-4">
          {title}
        </h2>
        {subTitle && (
          <h2 className="text-lg md:text-2xl font-semibold text-black mb-6">
            {subTitle}
          </h2>
        )}

        {children}

        {isLogoBottom && (
          <div className="md:-mt-6 md:-mb-6">
            <img
              src={SuccessModalCheckIcon}
              alt="Success"
              className="md:w-60 md:h-60 w-36 h-36"
            />
          </div>
        )}

        <Button
          variant="gradient"
          onClick={onClose}
          className="min-w-[120px] md:min-w-[180px] py-3 md:py-4 px-6 md:text-lg font-bold"
        >
          {buttonText}
        </Button>
      </div>
    </Modal>
  );
};

export default SuccessModal;