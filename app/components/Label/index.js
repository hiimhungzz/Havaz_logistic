/**
 * Select / Label (Styled Component)
 */

import styled from 'styled-components';
import * as style from 'components/Variables';

const StyledLabel = styled.label`
  color: ${props =>
  props.color ? style.color[props.color] : style.color.charcoal};
  display: inline-block;
  font-size: ${style.fontsize.reg};
  font-family: ${style.fontfamily.roboto};
  margin: ${props => props.margin};
  position: relative;
  text-align: left;
  width: 100%;
  margin:auto;

  &.hidden {
    display: none;
  }
`;

export default StyledLabel;
