/**
 * Input (Styled Component)
 */
import React, { useCallback } from "react";
import styled from "styled-components";
import { Select, Form } from "antd";
import PropTypes from "prop-types";
import * as style from "components/Variables";
import _ from "lodash"
const { Option } = Select;
const { Item } = Form

const StyledSelect = ({ placeholder, value, change, search, dataBin, _key, validate, disabled, allowClear }) => {
  let { required, message } = validate ? validate : { required: false, message: "" }
  return (
    <Select
      mode="multiple"
      allowClear={allowClear}
      showSearch
      style={{ width: '100%' }}
      placeholder={placeholder}
      value={value || undefined}
      disabled={disabled || false}
      onChange={change}
      onSearch={search}
      filterOption={(input, option) =>
        option.children.toString().toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
    >
      {
        _.map(dataBin, (i) => {
          return (<Option key={i['key'] ? i['key'] : i['id']} value={i['key'] ? i['key'] : i['id']}>{i['name'] ? i['name'] : i['text']} </Option>)
        })
      }
    </Select>
  )
};

export default StyledSelect;