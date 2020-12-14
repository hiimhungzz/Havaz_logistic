/* eslint-disable react/prop-types */
import React, { memo, useState, useCallback, useEffect } from "react";
import styled from "styled-components";
import * as style from "components/Variables";
import { Select, Spin } from "antd";
import _ from "lodash";
import ServiceBase from "utils/ServiceBase";
import { Ui } from "utils/Ui";

const localSearchFunc = (input, option) =>
  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
const TripSelect = memo(
  ({
    value,
    className,
    placeholder = "Chọn chuyến",
    labelInValue = false,
    onChange,
    loadOnMount = true,
    typeSearch = "local",
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
        url: "v1/common/trips",
        data: {},
      });
      if (result.hasErrors) {
        Ui.showErrors(result.errors);
      } else {
        setDataSource(
          _.map(result.value.data, (item) => {
            return {
              key: item.trip_id,
              label: `${item.route_name} - ${item.time_run} - ${item.day}`,
            };
          })
        );
      }
      setFetching(false);
    }, [setDataSource]);

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
export default styled(TripSelect)``;
