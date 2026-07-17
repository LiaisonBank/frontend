"use client";

import { createContext, useContext, useState } from "react";

const ModalContext = createContext();

export function ModalProvider({ children }) {
  const [serviceModalOpen, setServiceModalOpen] = useState(false);

  return (
    <ModalContext.Provider
      value={{
        serviceModalOpen,
        setServiceModalOpen,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  return useContext(ModalContext);
}