/* eslint-disable react/prop-types */
import React, { memo, useState, useCallback, useEffect } from "react";
import styled from "styled-components";
import * as style from "components/Variables";
import { Select, Spin } from "antd";
import _ from "lodash";

const localSearchFunc = (input, option) =>
  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
const RouteSelect = memo(
  ({
    value,
    className,
    placeholder = "Chọn tuyến",
    labelInValue = true,
    onChange,
    loadOnMount = true,
    typeSearch = "local",
  }) => {
    const [dataSource, setDataSource] = useState([
      { key: 1, label: "Hn-sp" },
      { key: 2, label: "bk-tn" },
    ]);
    const [fetching, setFetching] = useState(false);
    const [search, setSearch] = useState("");

    // Handlers

    /**
     * Handler Lấy dữ liệu
     */
    const _handleLoadData = useCallback(() => {
      setFetching(true);
      // TODO: call api
      // setDataSource([]);
      setFetching(false);
    }, [setDataSource, search]);

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
    useEffect(() => {
      if (loadOnMount) {
        _handleLoadData(search);
      }
    }, [_handleLoadData, loadOnMount, search]);
    // ----------------------
    return (
      <Select
        value={value}
        style={{ width: "100%" }}
        showSearch
        placeholder={placeholder}
        labelInValue={labelInValue}
        className={className}
        filterOption={typeSearch === "local" ? localSearchFunc : false}
        loading={fetching}
        notFoundContent={fetching ? <Spin size="small" /> : "Không có dữ liệu"}
        onChange={_handleOnChange}
        onSearch={typeSearch === "local" ? null : _handleSearch}
        onFocus={typeSearch === "local" ? null : _handleSearch}
      >
        {_.map(dataSource, (item, itemId) => (
          <Select.Option key={itemId} value={item.key}>
            {item.label}
          </Select.Option>
        ))}
      </Select>
    );
  }
);
export default styled(RouteSelect)``;
