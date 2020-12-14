import { css } from "styled-components";
import * as style from "components/Variables";

const DefaultStyle = css`
  body {
    font-family: Roboto, Helvetica, Arial, sans-serif !important;
    font-size: ${style.fontsize.reg};
    color: ${style.color.haiVan.primary};
    background: #f0f2f5;
  }
  body.fontLoaded {
    font-family: Roboto, Helvetica, Arial, sans-serif !important;
  }
  *:placeholder-shown {
    color: #58595b;
    font-weight: 700;
  }
  .ant-select-selection-placeholder {
    color: #58595b;
    font-weight: 500;
  }
  .ant-pagination-item-link {
    display: flex !important;
    justify-content: center;
    align-items: center;
  }
  .ant-table-thead > tr > th,
  .ant-table-tbody > tr > td,
  .ant-table tfoot > tr > th,
  .ant-table tfoot > tr > td {
    padding-top: 8px !important;
    padding-bottom: 8px !important;
  }
  .ant-table-column-sorters {
    padding: 0px 16px !important;
  }
`;

export default DefaultStyle;
