import React from "react";
import PropTypes from "prop-types";
import { Input } from "antd";

function SearchInput({ value, changeHandle }) {
  return (
    <Input
      placeholder="Type to search..."
      style={{ maxWidth: 939, width: "100%", height: 40, fontSize: 16 }}
      value={value}
      onChange={changeHandle}
    />
  );
}

SearchInput.propTypes = {
  value: PropTypes.string.isRequired,
  changeHandle: PropTypes.func.isRequired,
};

SearchInput.defaultProps = {
  value: "",
  changeHandle: () => {},
};

export default SearchInput;
