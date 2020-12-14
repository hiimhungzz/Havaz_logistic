/* eslint-disable react/prop-types */
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
    placeholder = " Tuyến", ////sửa khi có api
    labelInValue = true,
    onChange,
    loadOnMount = true,
    typeSearch = "local",
    allowClear,
  }) => {
    const [dataSource, setDataSource] = useState([]);
    const [fetching, setFetching] = useState(false);
    const [search, setSearch] = useState("");

    // Handlers

    /**
     * Handler Lấy dữ liệu
     */
    const _handleLoadData = useCallback(async () => {
      setFetching(true);
      const result = await ServiceBase.requestJson({
        method: "GET",
        url: "v1/van-phong/list-not-paginate",
        data: {
          q: search,
        },
      });
      if (result.hasErrors) {
        Ui.showErrors(result.errors);
      } else {
        setDataSource(result.value.data);
      }
      // TODO: call api
      // console.log("result", result);
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
        allowClear={allowClear}
        style={{ width: "100%" }}
        showSearch
        placeholder={placeholder}
        labelInValue={labelInValue}
        className={className}
        filterOption={typeSearch === "local" ? localSearchFunc : false}
        loading={fetching}
        notFoundContent={fetching ? <Spin size="small" /> : "Không có dữ liệu"}
        onChange={_handleOnChange}
        onSearch={_handleSearch}
        onFocus={typeSearch === "local" ? null : _handleSearch}
      >
        {_.map(dataSource, (item, itemId) => (
          <Select.Option key={itemId} value={item.id}>
            {item.name}
          </Select.Option>
        ))}
      </Select>
    );
  }
);
export default styled(TypeOfficeSelect)``;
