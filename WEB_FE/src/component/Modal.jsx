import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import dayjs from "dayjs";

function Modal(props) {
  const { modalId, title, message, children, btnId, btnClick, btnImg } = props;
  return (
    <div
      id={modalId}
      className="modal bg-gray-700/30 hidden h-full overflow-auto fixed top-0 left-0 w-full z-10"
    >
      <div
        className="modal-content bg-white border-solid mx-auto p-5 mt-[10%] 
        mb-[15%] border-0 w-5/12 h-5/12 flex flex-col rounded-2xl shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)]"
      >
        <div className="flex flex-row items-center">
          <h2 className="grow font-StrongAFBold text-3xl ml-5">{title}</h2>
          <button
            className="order-last"
            type="button"
            onClick={(e) => {
              document.getElementById(modalId).style.display = "none";
            }}
          >
            <span className="close">&times;</span>
          </button>
        </div>
        <div className="flex flex-col mt-12">
          <span className="text-xl mx-auto font-semibold font-StrongAF">
            {message}
          </span>
          {children}
        </div>
        <button
          id={btnId}
          type="button"
          className="mx-auto mt-16"
          onClick={btnClick}
        >
          <img src={btnImg} className="w-[35px] h-[35px]" alt={btnId} />
        </button>
      </div>
    </div>
  );
}

function FormModal(props) {
  const { modalId, title, message, children, btnId, btnClick, btnImg } = props;
  return (
    <div
      id={modalId}
      className="modal bg-gray-700/30 hidden h-full overflow-auto fixed top-0 left-0 w-full z-10"
    >
      <div
        className="modal-content bg-white border-solid mx-auto p-5 mt-[10%] 
              mb-[15%] border-0 w-5/12 h-5/12 flex flex-col rounded-2xl shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)]"
      >
        <div className="flex flex-row items-center">
          <h2 className="grow font-StrongAFBold text-3xl ml-5">{title}</h2>
          <button
            className="order-last"
            type="button"
            onClick={(e) => {
              document.getElementById(modalId).style.display = "none";
            }}
          >
            <span className="close">&times;</span>
          </button>
        </div>
        <div className="flex flex-col mt-12">
          <span className="text-xl mx-auto font-semibold font-StrongAF">
            {message}
          </span>
          <form encType="multipart/form-data" onSubmit={btnClick}>
            {children}
            <button
              id={btnId}
              type="submit"
              className="mx-auto w-[60px] h-[60px] mt-16"
            >
              <img src={btnImg} alt={btnId} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

Modal.propTypes = {
  modalId: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  children: PropTypes.node,
  btnId: PropTypes.string.isRequired,
  btnClick: PropTypes.func.isRequired,
  btnImg: PropTypes.node.isRequired,
};

Modal.defaultProps = {
  children: "",
};

FormModal.propTypes = {
  modalId: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  children: PropTypes.node,
  btnId: PropTypes.string.isRequired,
  btnClick: PropTypes.func.isRequired,
  btnImg: PropTypes.node.isRequired,
};

FormModal.defaultProps = {
  children: "",
};

export { Modal, FormModal };
