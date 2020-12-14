/**
 * Input (Styled Component)
 */
import React, {useCallback} from "react";
import styled from "styled-components";
import { Table } from "antd";
import PropTypes from "prop-types";
import * as style from "components/Variables";

const StyledInput = ({ className, columns, dataSource, summary, scroll_Y  }) => {
  let maxHeight = window.innerHeight;
  maxHeight = maxHeight * 65 / 100
  let objScroll = { x: "100%" }
  if(maxHeight) {
    objScroll = {...objScroll,...{y: maxHeight}}
  }
	return (
    <div className={className}>
      <Table
        bordered
        columns={columns}
        dataSource={dataSource}
        scroll={objScroll}
        // rowKey={() => {
        //   return new Date().getTime()
        // }}
        summary={() => {
          let a = summary ? summary : ""
          return a
        }}
        pagination={false}
      />
    </div>
	)
};

StyledInput.propTypes = {
  className: PropTypes.any,
  placeholder: PropTypes.any
};
export default styled(StyledInput)`
.ant-row-end {
  // display: none
}
.ant-table-ping-right:not(.ant-table-has-fix-right)
  .ant-table-container::after {
  box-shadow: none;
}
.ant-table-tbody > tr > td,
.ant-table tfoot > tr > th,
.ant-table tfoot > tr > td {
  padding-top:0px !important;
  padding-bottom:0px !important;
  padding-left: 5px !important;
  padding-right: 5px !important;
}
.ant-table-thead > tr > th {
  background-color : rgba(233, 195, 43);
  padding-top:5px !important;
  padding-bottom:5px !important;
  padding-left: 5px !important;
  padding-right: 5px !important;
}
`;