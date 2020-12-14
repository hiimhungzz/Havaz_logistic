/**
 * Input (Styled Component)
 */
import React, {useCallback} from "react";
import styled from "styled-components";
import { Input, Form } from "antd";
import PropTypes from "prop-types";
import * as style from "components/Variables";
const { Item } = Form

const StyledInput = ({ className, placeholder, value, change , _key, validate}) => {
  let { required, message } = validate ? validate : { required: false, message: "" }
	return (
		  <Input className={className} placeholder={placeholder} value={value} onChange={change}/>
	)
};

StyledInput.propTypes = {
  className: PropTypes.any,
  placeholder: PropTypes.any
};
export default styled(StyledInput)`
  &:hover,
  &:focus {
    border-color: #dcdcdc !important;
    box-shadow: none !important;
  }
`;