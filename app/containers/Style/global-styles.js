import { createGlobalStyle } from "styled-components";

import DefaultStyle from "./default";
import FlexStyle from "./flex";
import ScrollBarStyle from "./scroll-bar";
import ValidationStyle from "./validation";
import OtherStyle from "./other";
// Ant Design
import SelectStyle from "./antd/select";
import DatePickerStyle from "./antd/datePicker";
const GlobalStyle = createGlobalStyle`

// Style Default
    ${DefaultStyle}
// Style Flex
    ${FlexStyle}
// Style Scroll bar
    ${ScrollBarStyle}
// Style Validation
    ${ValidationStyle}
// Style Other
    ${OtherStyle}
// Style for Ant Design
    ${SelectStyle}
    ${DatePickerStyle}

    .print-source {
      display: none;
    }
    
    body > .print-source {
      display: block;
    }
    
    @media print {
      .print-source {
        display: block;
      }
    }
// Customize
    @for $i from 0 through 7 {
        .mb_#{$i*5} {
          margin-bottom: 0px + $i * 5 !important;
        }
      }
    
      @for $i from 0 through 7 {
        .mt_#{$i*5} {
          margin-top: 0px + $i * 5 !important;
        }
      }
    
      @for $i from 0 through 7 {
        .mr_#{$i*5} {
          margin-right: 0px + $i * 5 !important;
        }
      }
      @for $i from 0 through 7 {
        .ml_#{$i*5} {
          margin-left: 0px + $i * 5 !important;
        }
      }

`;

export default GlobalStyle;
