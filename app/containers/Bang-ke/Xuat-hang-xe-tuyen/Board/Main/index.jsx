/**
 * Copyright 2020-present, TIENDUC.
 * All rights reserved.
 * @author ductt.it.hust@gmail.com on 27/06/2020.
 */

import React, { useCallback, useState } from "react";
import { Card } from "antd";
import styled from "styled-components";
import { Input, OfficeStaffSelect } from "components";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import CTable from "./CTable";
import { fromJS, Map } from "immutable";
import { AutoSizer, List as ReactList } from "react-virtualized";
import Order from "./Order";

const loadingContainer = {
  width: "100%",
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
};
/*
 * Tạo mới bảng kê từ lịch chạy
 */
const MainGrid = ({ className, orders, cTables, setCTables, onShowOrderModal, onEditCTableRecord, setReLoadCTables }) => {
  const [search, setSearch] = useState(Map({ office: undefined, order_id: '' }))
  // Handlers

  const _handleChangeInput = useCallback((value, name) => {
    setSearch(prev => prev.set(name, value));
  }, []);

  const _handleFilterOrder = useCallback(() => {
    if (orders.size > 0) {
      let param = {
        office: search.getIn(['office', 'value']),
        order_id: search.get('order_id')
      };
      return orders.filter(order => {
        return (param.office ? order.getIn(['destination', 'id']) === param.office : true) && (param.order_id ? order.get('code').includes(param.order_id) : true)
      });
    }
    return orders;
  }, [search, orders]);

  const onDragEnd = useCallback((result) => {
    const { destination, source } = result;
    if (!result.destination) {
      return;
    }

    if (
      destination.index === source.index &&
      destination.droppableId === source.droppableId
    ) {
      return;
    }
    setCTables((prev) => {
      let next = prev;
      next = next.update((cTablesList) => {
        let cTablesJs = cTablesList.toJS();
        let [removed] = cTablesJs.splice(source.index, 1);
        cTablesJs.splice(destination.index, 0, removed);
        return fromJS(cTablesJs);
      });
      return next;
    });
  }, [setCTables]);
  let filteredOrders = _handleFilterOrder();
  const _rowRenderer = useCallback(
    ({ index, key, style }) => {
      if (filteredOrders.size === 0) {
        return null;
      }
      return (
        <Order
          key={key}
          style={style}
          order={filteredOrders.get(index)}
        />
      );
    },
    [filteredOrders]
  );

  return (
    <DragDropContext
      onDragEnd={onDragEnd}
    >
      <div id="mainGrid" className={className}>
        <div id="left">
          <Card
            bodyStyle={{
              padding: "0 0",
              flex: 1,
            }}
          // title="Danh sách hàng tồn xuất"
          >
            <div className="filter">
              <OfficeStaffSelect
                allowClear={true}
                value={search.get('office')}
                placeholder="Chọn VP đích"
                typeSearch="local"
                onChange={(e) => _handleChangeInput(e, "office")}
              />
              <Input value={search.get('order_id')} onChange={e => _handleChangeInput(e.target.value, "order_id")}
                placeholder="Nhập đơn hàng" className="ml-2" />
            </div>
            <div className="list">
              {filteredOrders.size > 0 ? <AutoSizer>
                {({ width, height }) => (
                  <ReactList
                    ref="List"
                    // className={styles.List}
                    height={height}
                    overscanRowCount={10}
                    // noRowsRenderer={this._noRowsRenderer}
                    rowCount={filteredOrders.size}
                    rowHeight={50}
                    rowRenderer={_rowRenderer}
                    // scrollToIndex={scrollToIndex}
                    width={width}
                  />
                )}
              </AutoSizer> : <div style={loadingContainer}>
                  <div>Không có đơn hàng</div>
                </div>}
            </div>
          </Card>
        </div>
        <Droppable
          droppableId="droppable-1"
          type="cTables"
          direction="horizontal"
        >
          {(provided) => {
            return (
              <div id="content">
                {cTables.size > 0 ? <div
                  className="inner"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {cTables.map((cTable, cTableId) => {
                    return (
                      <CTable
                        key={cTable.get("code")}
                        cTable={cTable}
                        index={cTableId}
                        setReLoadCTables={setReLoadCTables}
                        onShowOrderModal={onShowOrderModal}
                        onEditCTableRecord={onEditCTableRecord}
                      />
                    );
                  })}
                  {provided.placeholder}
                </div> : <div ref={provided.innerRef} style={loadingContainer}>
                    <div>Không có bảng kê</div>
                  </div>}
              </div>
            );
          }}
        </Droppable>
      </div>
    </DragDropContext>
  );
};

export default styled(MainGrid)`
  display: grid;
  // padding: 1rem 1rem;
  // border: 1px solid #e7e7e7;
  grid-gap: 1rem;
  grid-template-columns: 400px auto;
  max-width: 100%;
  min-width: 100%;
  height: calc(100vh - 215px);
  min-height: 100%;
  #left {
    border: 1px solid #e7e7e7;
    .ant-card {
      flex: 1;
      display: flex;
      flex-direction: column;
      height: 100%;
      .ant-card-body {
        display: flex;
        flex: 1;
        flex-direction: column;
        .filter {
          flex: 0 0 48px;
          display: flex;
          align-items: center;
          padding: 0 5px;
        }
        .list {
          flex: 1 1 auto;
        }
      }
    }
  }

  #content {
    background: #f0f2f5;
    max-width: 100%;
    overflow-x: scroll;
    max-height: 100%;
    overflow-y: hidden;
    .inner {
      border: 1px solid #e7e7e7;
      padding: 0.5rem 0.5rem;
      width: min-content;
      height: 100%;
      max-height: 100%;
      display: flex;
    }
  }
`;
