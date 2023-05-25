import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import dayjs from "dayjs";

function TextInput(props) {
  const { id, placeholder, onChange } = props;
  return (
    <div className="flex justify-center">
      <input
        id={id}
        className="w-4/6 h-12 border-2 border-gray-300 rounded-lg mt-5 p-5 font-StrongAF"
        type="text"
        placeholder={placeholder}
        onChange={onChange}
      />
    </div>
  );
}

function DateInput(props) {
  const { id, placeholder, onChange } = props;
  return (
    <div className="flex justify-center">
      <input
        id={id}
        className="w-4/6 h-12 border-2 border-gray-300 rounded-lg mt-5 p-5 font-StrongAF"
        type="text"
        placeholder={placeholder}
        onChange={onChange}
        onFocus={(e) => {
          e.target.type = "date";
          e.target.max = "9999-12-31";
          e.target.min = "2010-01-01";
        }}
        onBlur={(e) => {
          e.target.type = "text";
        }}
      />
    </div>
  );
}

function TimeInput(props) {
  const { id, placeholder, onChange } = props;
  return (
    <div className="flex justify-center">
      <input
        id={id}
        className="w-4/6 h-12 border-2 border-gray-300 rounded-lg mt-5 p-5 font-StrongAF"
        type="text"
        placeholder={placeholder}
        onChange={onChange}
        onFocus={(e) => {
          e.target.type = "time";
        }}
        onBlur={(e) => {
          e.target.type = "text";
        }}
      />
    </div>
  );
}

function FileInput(props) {
  const { id, name, placeholder, onChange, file, fileType } = props;
  return (
    <div className="flex justify-center">
      <div className="w-4/6 h-12 border-2 border-gray-300 rounded-lg mt-5 p-5 font-StrongAF">
        <label
          htmlFor={id}
          className="text-gray-400"
          style={{ position: "relative", top: "-0.6rem" }}
        >
          {file ? "" : placeholder}
          <span className="italic text-black">{file ? file.name : ""}</span>
          <input
            id={id}
            name={name}
            type="file"
            style={{ display: "none" }}
            accept={fileType}
            onChange={onChange}
          />
        </label>
      </div>
    </div>
  );
}

TextInput.propTypes = {
  id: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

DateInput.propTypes = {
  id: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

DateInput.defaultProps = {
  placeholder: "날짜를 입력해주세요!",
};

TimeInput.propTypes = {
  id: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

TimeInput.defaultProps = {
  placeholder: "시간을 입력해주세요!",
};

FileInput.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  file: PropTypes.instanceOf(File).isRequired,
  fileType: PropTypes.string.isRequired,
};

FileInput.defaultProps = {
  placeholder: "파일을 첨부해주세요!",
};

export { TextInput, DateInput, TimeInput, FileInput };
