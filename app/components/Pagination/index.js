/**
 * Input (Styled Component)
 */
import React, {useState} from "react";
import styled from "styled-components";
import { Row, Pagination } from "antd";
import PropTypes from "prop-types";
import * as style from "components/Variables";

const StyledInput = ({ className, total , onPagination, margin}) => {
  return (
    <Row justify="end" className={className}>
      <div className={margin === 'top' ? 'pagination-top' : 'pagination-bottom'}>
        <Pagination 
          showSizeChanger
          pageSizeOptions={[10, 20, 50, 100]} 
          onChange={(page, pageSize)=>{
            onPagination(page, pageSize)
          }}
          total={total || 0}/>
      </div>
    </Row>
	)
};

StyledInput.propTypes = {
  className: PropTypes.any,
  placeholder: PropTypes.any
};
export default styled(StyledInput)`
  .pagination-top {
    margin-bottom: 5px
  }
  .pagination-bottom {
    margin-top: 5px
  }
`;