'use client';

// src/context/ModalContext.jsx
import React, { createContext, useContext, useState } from 'react';
import ModalWarning from '../components/modalWarning';

interface ModalConfig {
  title?: string;
  description: string;
  buttonText?: string;
}

interface ModalContextType {
  openModal: (config: ModalConfig) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: {children: React.ReactNode}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: '',
    description: '',
    buttonText: 'รับทราบ'
  });

  const openModal = ({ title = "พบข้อผิดพลาด", description = "", buttonText = "รับทราบ" }) => {
    setModalConfig({ title, description, buttonText });
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      <ModalWarning 
        isOpen={isOpen} 
        onClose={closeModal}
        title={modalConfig.title}
        description={modalConfig.description}
        buttonText={modalConfig.buttonText}
      />
    </ModalContext.Provider>
  );
};

export const useModalWarning = (): ModalContextType => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModalWarning must be used within a ModalProvider');
  }
  return context;
};