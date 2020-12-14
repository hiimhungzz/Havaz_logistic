/* eslint-disable react/prop-types */

// Region đang lấy dữ liệu phục vụ cho Quản trị - Vp
import React, { memo, useState, useCallback, useEffect } from "react";
import styled from "styled-components";
import * as style from "components/Variables";
import { Select, Spin } from "antd";
import ServiceBase from "utils/ServiceBase";
import _ from "lodash";
import { Ui } from "utils/Ui";

const localSearchFunc = (input, option) =>
  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
const TypeOfficeSelect = memo(
  ({
    className,
    placeholder = "Chọn vùng",
    labelInValue = true,
    onChange,
    loadOnMount = true,
    typeSearch = "local",
    allowClear,
    data,
    ...props
  }) => {
    const [dataSource, setDataSource] = useState(data);
    const [fetching, setFetching] = useState(false);
    const [search, setSearch] = useState("");

    // Handlers

    /**

    /**
     * Xử lí khi chọn dữ liệu
     */
    const _handleOnChange = useCallback(
      (data) => {
        onChange(data);
      },
      [onChange]
    );

    /**
     * Xử lí khi tìm kiếm
     */
    const _handleSearch = useCallback((input) => {
      setSearch(input || "");
    }, []);
    // -------------------------

    // Events

    /*
     * Event Lấy dữ liệu
     */

    // ----------------------
    return (
      <Select
        {...props}
        allowClear={false}
        style={{ width: "100%" }}
        showSearch
        placeholder={placeholder}
        labelInValue={labelInValue}
        className={className}
        filterOption={typeSearch === "local" ? localSearchFunc : false}
        loading={fetching}
        notFoundContent={fetching ? <Spin size="small" /> : "Không có dữ liệu"}
        onChange={_handleOnChange}
      >
        {_.map(data, (item, itemId) => (
          <Select.Option key={itemId} value={item.id}>
            {item.name}
          </Select.Option>
        ))}
      </Select>
    );
  }
);
export default styled(TypeOfficeSelect)``;
