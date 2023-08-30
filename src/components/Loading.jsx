import React from "react";
import Modal from "./Modal.jsx";
import ModalLoader from "./ModalLoader.jsx";

const Loading = () => (
  <Modal
    style={{
      backgroundColor: "hsla(0, 50%, 100%, 0.5)"
    }}
  >
    <ModalLoader />
  </Modal>
);

export default Loading;
