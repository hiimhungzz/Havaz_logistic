/**
 * Input (Styled Component)
 */
import React, {useCallback} from "react";
import styled from "styled-components";
import { Input } from "antd";
import PropTypes from "prop-types";
import * as style from "components/Variables";
const { TextArea } = Input;


const StyledInput = ({ className, placeholder, value, change , minRows, maxRows}) => {
	return (
		<TextArea placeholder={placeholder} value={value} onChange={change} />
	)
};

StyledInput.propTypes = {
  placeholder: PropTypes.any
};
export default styled(StyledInput)``;