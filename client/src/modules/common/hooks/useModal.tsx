import { useState } from "react";

interface IUseModalProps {
  isVisibleOnInit?: boolean;
}

const useModal = (isVisibleOnInit?: IUseModalProps) => {
  const [isVisible, setIsVisible] = useState(!!isVisibleOnInit);

  const showModal = () => setIsVisible(true);
  const hideModal = () => setIsVisible(false);

  return {
    showModal,
    hideModal,
    isVisible,
    setIsVisible,
  };
};

export default useModal;
