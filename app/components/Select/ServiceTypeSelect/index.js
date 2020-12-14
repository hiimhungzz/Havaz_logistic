/* eslint-disable react/prop-types */
import React, { memo, useState, useCallback, useEffect } from "react";
import styled from "styled-components";
import { Select, Spin } from "antd";
import ServiceBase from "utils/ServiceBase";
import _ from "lodash";
import { Ui } from "utils/Ui";
import {createStructuredSelector} from "reselect";
import { makeSelectDefinitions } from "containers/App/selectors";
import {connect} from "react-redux";

const localSearchFunc = (input, option) =>
  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
const ServiceTypeSelect = memo(
  ({
    className,
    placeholder = " Văn phòng",
    labelInValue = true,
    onChange,
    loadOnMount = true,
    typeSearch = "local",
    allowClear,
    definitions,
    ...props
  }) => {
    const { service_type_product } = definitions.toJS()
    const [dataSource, setDataSource] = useState([]);
    const [fetching, setFetching] = useState(false);
    const [search, setSearch] = useState("");

    // Handlers

    /**
     * Handler Lấy dữ liệu
     */
    const _handleLoadData = useCallback(async () => {
      setDataSource(service_type_product)
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

const mapStateToProps = createStructuredSelector({
  definitions: makeSelectDefinitions(),
});

const withConnect = connect(
  mapStateToProps,
  null
);

export default styled(withConnect(ServiceTypeSelect))``;
