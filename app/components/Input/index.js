/**
 * Input (Styled Component)
 */

import styled from "styled-components";
import { Input } from "antd";
import * as style from "components/Variables";

const StyledInput = styled(Input)`
  &:hover,
  &:focus {
    border-color: #dcdcdc !important;
    box-shadow: none !important;
  }
`;

export default StyledInput;
