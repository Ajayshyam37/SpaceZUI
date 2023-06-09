import Button from '@mui/material/Button';
import React from 'react';
import { Modal } from 'react-bootstrap';

type ModalContentProps = {
  show: boolean;
  onHide: () => void;
  message: string;
  title :string;
};

const ModalContent: React.FC<ModalContentProps> = ({ show, onHide, message,title }) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{message}</Modal.Body>
      <Modal.Footer>
        <Button onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalContent;
