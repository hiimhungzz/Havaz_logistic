/**
 * Copyright 2020-present, TIENDUC.
 * All rights reserved.
 * @author ductt.it.hust@gmail.com on 27/06/2020.
 */

import React, { useCallback, memo, useMemo, useState } from "react";
import styled from "styled-components";
import { Draggable } from "react-beautiful-dnd";
import { Button, Popconfirm, Tag } from "antd";
import { AutoSizer, List } from "react-virtualized";
import { Input, Card } from "components";
import Order from "./Order";
import _ from "lodash";
import ServiceBase from "utils/ServiceBase";
import { API_BASE_URL, DATE_TIME_FORMAT } from "utils/constants";
import { Ui } from "utils/Ui";
import { formatNumber } from "utils/helper";
import { EditOutlined } from "@ant-design/icons";
import { connect } from "react-redux";
import moment from "moment";
import {
  makeSelectDefinitions,
  makeSelectProfile,
} from "containers/App/selectors";
import { createStructuredSelector } from "reselect";
import Print from "../../Print";
/*
 * Tạo mới bảng kê từ lịch chạy
 */
const CTable = memo(
  ({
    className,
    definitions,
    profile,
    cTable,
    index,
    setReLoadCTables,
    onEditCTableRecord,
    onShowOrderModal,
  }) => {
    const [dataBin, setDataBin] = useState({});
    let [search, setSearch] = useState("");

    const orders = search
      ? cTable.get("orders").filter((order) => {
        return order.get("code").includes(search);
      })
      : cTable.get("orders");
    const total = useMemo(() => {
      let ordersJs = (orders || List()).toJS();
      let amount = _.sumBy(ordersJs, (x) => (_.get(x, 'order_fee.amount', 0) - _.get(x, 'discount', 0)) + _.get(x, 'cod_fee.amount', 0) + _.get(x, 'r_shipping_fee.amount', 0) + _.get(x, 'd_shipping_fee.amount', 0));
      let numberPackage = _.sumBy(ordersJs, (x) => x.num_of_package);
      return { amount, numberPackage };
    }, [orders]);


    const _handleSearch = useCallback((e) => {
      let value = e.target.value;
      setSearch(value);
    }, []);
    const _handleShowOrderModal = useCallback(() => {
      onShowOrderModal(true, cTable.get("code"), index);
    }, [cTable, index, onShowOrderModal]);
    const _rowRenderer = useCallback(
      ({ index, key, style }) => {
        return <Order key={key} style={style} order={orders.get(index)} />;
      },
      [orders]
    );
    // Handlers

    /**
     * Handler Hủy bản kê
     */
    const _handleCancelCTable = useCallback(async () => {
      let result = await ServiceBase.requestJson({
        baseURL: API_BASE_URL,
        url: `/v1/exportings/${cTable.get("code")}/cancel`,
        data: { note: "Hủy bảng kê." },
        method: "POST",
      });
      if (result.hasErrors) {
        Ui.showError({ message: "Có lỗi khi hủy bản kê." });
      } else {
        Ui.showSuccess({ message: "Hủy bản kê thành công." });
        setReLoadCTables(true);
      }
    }, [cTable, setReLoadCTables]);

    /**
     * Handler Chốt bản kê
     */

    const _handleChot = useCallback(
      async (handlePrint) => {
        setTimeout(async () => {
          let values = cTable.toJS();
          let result = await ServiceBase.requestJson({
            baseUrl: API_BASE_URL,
            url: `v1/exportings/${values.code}/finalize`,
            data: {},
            method: "POST",
          });
          if (result.hasErrors) {
            Ui.showError({ message: "Có lỗi khi chốt bảng kê." });
          } else {
            Ui.showSuccess({ message: "Chốt bảng kê thành công." });
            setReLoadCTables(true);
            return;
          }
        }, 200);
      },
      [cTable, setReLoadCTables]
    );
    /**
     * Handler In bản kê
     */

    return (
      <Draggable draggableId={cTable.get("id")} index={index}>
        {(provided) => (
          <div
            className={className}
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <Card
              headStyle={{
                padding: "0px 0px",
                fontSize: "0.7rem",
              }}
              bodyStyle={{
                padding: "0 0",
                flex: 1,
              }}
              title={
                <div className="top">
                  <div
                    style={{
                      fontSize: "14px",
                      flexDirection: "column",
                      padding: "2.5px",
                    }}
                    className="item border-right d-flex align-items-center"
                  >
                    <Button
                      disabled={cTable.get("status") === 3}
                      style={{ display: "flex", alignItems: "center" }}
                      icon={<EditOutlined />}
                      onClick={() => onEditCTableRecord(cTable.toJS())}
                      type="link"
                    >
                      {cTable.get("code")}
                    </Button>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        flexDirection: "row",
                      }}
                    >
                      <Tag
                        color={definitions.getIn([
                          "export_statuses",
                          `${cTable.get("status")}`,
                          "color",
                        ])}
                      >
                        {definitions.getIn([
                          "export_statuses",
                          `${cTable.get("status")}`,
                          "text",
                        ])}
                      </Tag>
                      <Print idBangKe={cTable.get("code")} profile={profile}/>
                    </div>
                  </div>
                  <div className="item border-right d-flex flex-column">
                    <div> {cTable.get("drivers") ? (cTable.get("drivers").toJS()[0] && cTable.get("drivers").toJS()[0]?.name) : ''}</div>
                    <div>{cTable.getIn(["trip_bus", "license_plate"])}</div>
                    {/* <Divider style={{ margin: "2px 2px" }} type="horizontal" /> */}
                    <div>{cTable.get("license_plate")}</div>
                    <div>{cTable.get("driver_phone")}</div>
                  </div>
                  <div className="item border-right d-flex flex-column">
                    {/* <Divider style={{ margin: "2px 2px" }} type="horizontal" /> */}
                    <div>{cTable.getIn(["trip_route", "not_code"])}</div>
                    <div>{`${cTable.getIn(["trip_route", "day"]) ||
                      ""} ${cTable.getIn(["time_start"])}`}</div>
                  </div>
                </div>
              }
            >
              <div className="body">
                <div className="item border-right d-flex align-items-center flex-column">
                  <div>Số khách</div>
                  {/* <Divider style={{ margin: "2px 2px" }} type="horizontal" /> */}
                  <div>{`${cTable.get("occupy_seats")}/${cTable.get(
                    "seats"
                  )}`}</div>
                </div>
                <div className="item border-right d-flex flex-column">
                  <div>Tổng tiền</div>
                  {/* <Divider style={{ margin: "2px 2px" }} type="horizontal" /> */}
                  <div>{formatNumber(total.amount)}</div>
                </div>
                <div className="item border-right d-flex flex-column">
                  <div>Số kiện</div>
                  {/* <Divider style={{ margin: "2px 2px" }} type="horizontal" /> */}
                  <div>{total.numberPackage}</div>
                </div>
              </div>
              <div>
                <Input
                  value={search}
                  onChange={_handleSearch}
                  placeholder="Tìm kiếm đơn hàng"
                />
              </div>
              <div className="listOrder">
                <AutoSizer>
                  {({ width, height }) => (
                    <List
                      ref="List"
                      // className={styles.List}
                      height={height}
                      overscanRowCount={10}
                      // noRowsRenderer={this._noRowsRenderer}
                      rowCount={orders.size}
                      rowHeight={50}
                      rowRenderer={_rowRenderer}
                      // scrollToIndex={scrollToIndex}
                      width={width}
                    />
                  )}
                </AutoSizer>
              </div>
            </Card>
            <div className="card-action">
              <div className="left">
                {cTable.get("status") === 1 && (
                  <Button onClick={_handleShowOrderModal} size="middle">
                    Thêm đơn hàng
                  </Button>
                )}
              </div>
              <div className="right">
                <Popconfirm
                  title="Bạn có muốn hủy bản kê này?"
                  onConfirm={_handleCancelCTable}
                  onCancel={() => { }}
                  okText="Xác nhận"
                  cancelText="Quay lại"
                >
                  {cTable.get("status") === 1 && (
                    <Button className="mr-2" danger size="middle">
                      Hủy
                    </Button>
                  )}
                </Popconfirm>
                {cTable.get("status") === 1 && (
                  <Button size="middle" onClick={_handleChot} type="primary">
                    Chốt
                  </Button>
                )}
                {cTable.get("status") === 2 && (
                  <Tag
                    color={definitions.getIn(["export_statuses", "2", "color"])}
                  >
                    Đã chốt
                  </Tag>
                )}
              </div>
            </div>
          </div>
        )}
      </Draggable>
    );
  }
);
const mapStateToProps = createStructuredSelector({
  definitions: makeSelectDefinitions(),
  profile: makeSelectProfile(),
});
const withConnect = connect(
  mapStateToProps,
  null
);
export default styled(withConnect(CTable))`
  margin: 5px 5px;
  background: #fff;
  min-width: 400px;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  .ant-card {
    flex: 1;
    display: flex;
    flex-direction: column;
    .ant-card-head-title {
      padding: 0 0;
      width: 100%;
      .top {
        min-height: 48px;
        display: grid;
        grid-auto-flow: column;
        grid-template-columns: 40% 30% 30%;
        .item {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .border-right {
          border: 1px solid #e7e7e7;
        }
      }
    }
    .ant-card-body {
      display: flex;
      flex-direction: column;
      .body {
        font-size: 0.8rem;
        min-height: 48px;
        display: grid;
        grid-auto-flow: column;
        grid-template-columns: 40% 30% 30%;
        flex: 0 0 48px;
        .item {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .border-right {
          border: 1px solid #e7e7e7;
        }
      }
      .listOrder {
        flex: 1 1 auto;
        padding: 10px 5px;
      }
    }
  }
  .card-action {
    flex: 0 0 auto;
    padding: 5px 5px;
    display: flex;
    .left {
    }
    .right {
      flex: 1;
      display: flex;
      justify-content: flex-end;
    }
  }
`;

