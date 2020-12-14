/* eslint-disable react/prop-types */
import React, { memo, useState, useCallback, useEffect } from "react";
import styled from "styled-components";
import { Select, Spin } from "antd";
import ServiceBase from "utils/ServiceBase";
import _ from "lodash";
import { Ui } from "utils/Ui";

const localSearchFunc = (input, option) =>
  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
const OfficeSelectByType = memo(
  ({
    className,
    placeholder = " Văn phòng",
    labelInValue = true,
    onChange,
    loadOnMount = true,
    typeSearch = "local",
    allowClear,
    active = 2,
    type = 0, // 0 là tất cả, 1 là  vp trung chuyển, 2 là vp kết nối, 3 là  vp hàng hóa
    ...props
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
        url: "v1/van-phong/list",
        data: {
          type: type,
          page: 1,
          per_page: 100000000,
          name: "",
          active: active,
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
        {...props}
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
export default styled(OfficeSelectByType)``;
