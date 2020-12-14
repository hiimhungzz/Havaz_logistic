/**
 * Copyright 2020-present, TIENDUC.
 * All rights reserved.
 * @author ductt.it.hust@gmail.com on 27/06/2020.
 */

import React, { useState, useCallback, useLayoutEffect } from "react";
import { Row, Button } from "antd";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Tabs, TabPane } from "components";
import { Map } from "immutable";
import UnBoard from "./UnBoard/Loadable";
import Board from "./Board/Loadable";
import { useLoadBangKeXhXeTuyen, useLoadOrders } from "utils/hooks";
import CreateFromNew from "./Modal";
// import CreateOrderModal from "containers/Order/Modal";
import CreateOrderModalBeta from "containers/Order/ModalBeta";
import ServiceBase from "utils/ServiceBase";
import { API_BASE_URL } from "utils/constants";
import { Ui } from "utils/Ui";
import _ from "lodash";
import { createStructuredSelector } from "reselect";
import { makeSelectDefinitions } from "containers/App/selectors";
import { connect } from "react-redux";
import { ReloadOutlined, DownloadOutlined } from "@ant-design/icons";
import { useLocation } from "react-router-dom";
import * as qs from "query-string";
/**
 *
 * Hiển thị bảng kê xuất hàng xe tuyến, at the '/bang-ke/xuat-hang/xe-tuyen' route
 *
 */
const Page = ({ className, definitions }) => {
  const { search } = useLocation();
  const [
    cTablesLoading,
    cTables,
    setCTables,
    setReLoadCTables,
  ] = useLoadBangKeXhXeTuyen();
  const [, orders, , setReLoadOrders] = useLoadOrders();
  const [uuid, setUuid] = useState("");
  const [modal, setModal] = useState(Map({ visible: false, isEdit: false }));
  const [orderModal, setOrderModal] = useState(
    Map({ visible: false, isEdit: false })
  );
  const _handleAddToCTable = useCallback(
    async (order) => {
      if (orderModal.get("cTableId")) {
        let newOrder = Map({
          code: order.order_id,
          num_of_package: order.num_of_package,
          destination: { name: order.receiver_address },
          order_fee: order.order_fee,
          isNew: true,
        });
        // Thêm order vừa tạo vào bảng kê
        setCTables((cTables) => {
          cTables = cTables.updateIn(
            [orderModal.get("cTableIndex"), "orders"],
            (x) => x.push(newOrder)
          );
          let resultPromise = ServiceBase.requestJson({
            baseURL: API_BASE_URL,
            url: `/v1/exportings/${orderModal.get("cTableId")}/add-item`,
            data: {
              order_id: order.order_id,
            },
            method: "POST",
          });
          resultPromise
            .then((result) => {
              if (result.hasErrors) {
                Ui.showError({ message: "Có lỗi khi lưu bản kê." });
              } else {
                Ui.showSuccess({ message: "Lưu bản kê thành công." });
              }
              setReLoadCTables(true);
            })
            .catch((error) => {
              Ui.showSuccess({ message: "Có lỗi khi lưu bản kê." });
              setReLoadCTables(true);
            });

          return cTables;
        });
      }
    },
    [orderModal, setCTables, setReLoadCTables]
  );

  const _handleEditCTableRecord = useCallback(async (cTable) => {
    setModal((prev) =>
      prev.update((x) => {
        x = x.set("visible", true);
        x = x.set("isEdit", true);
        x = x.set("cTableId", cTable.cTableId || cTable.code);
        x = x.set("create_time", cTable.create_time);
        x = x.set("staff_create", cTable.staff_create);
        x = x.set("cTableStatus", cTable.status);
        x = x.set("cTableStatus", cTable.status);
        return x;
      })
    );
  }, []);

  const _handleShowModal = useCallback(
    (visible, isEdit = false) => {
      setModal((prev) => {
        let next = prev;
        next = next.set("visible", visible);
        next = next.set("isEdit", isEdit);
        next = next.set("cTableId", null);
        next = next.set("cTableStatus", null);

        return next;
      });
      if (visible) {
        setReLoadOrders(Boolean(false));
        setReLoadCTables(Boolean(false));
      } else {
        setReLoadOrders(Boolean(true));
        setReLoadCTables(Boolean(true));
      }
    },
    [setReLoadCTables, setReLoadOrders]
  );
  const _handleShowOrderModal = useCallback(
    (visible, cTableId, cTableIndex) => {
      setOrderModal((prev) => {
        let next = prev;
        next = next.set("visible", visible);
        next = next.set("cTableId", visible ? cTableId : null);
        next = next.set("cTableIndex", visible ? cTableIndex : null);
        next = next.set("isEdit", false);
        return next;
      });
      if (visible) {
        setReLoadOrders(Boolean(false));
        setReLoadCTables(Boolean(false));
      } else {
        setReLoadOrders(Boolean(true));
        setReLoadCTables(Boolean(true));
      }
    },
    [setReLoadCTables, setReLoadOrders]
  );

  const _callBackHiddenModal = useCallback(() => {
    setOrderModal((prev) => {
      let next = prev;
      next = next.set("visible", false);
      return next;
    });
  }, [])

  const loadID = useCallback( async () => {
    let parsed = qs.parse(search);
      let result = await ServiceBase.requestJson({
        baseUrl: API_BASE_URL,
        url: `/v1/exportings/${parsed.id}?scope=should_exported`,
        method: "GET",
      });
      if (result && result.hasErrors) {
        Ui.showError({ message: "Có lỗi khi đọc bảng kê." });
      } else {
        setTimeout(() => {
          setModal((prev) => {
            let next = prev;
            next = next.set("visible", true);
            next = next.set("isEdit", true);
            next = next.set("cTableId", parsed.id);
            next = next.set("cTableStatus", result.value.data.status);
            return next;
          });
        }, 300);
      }
  }, [search])

  // Load bảng kê theo id trên url
  useLayoutEffect(() => {
    if (search) {
      loadID()
    }
  }, [search]);

  return (
    <Row className={className} gutter={[16, 16]}>
      <Tabs
        style={{ width: "100%" }}
        defaultActiveKey={"2"}
        type="card"
        margin="0px 0px"
        renderTabBar={(props, DefaultTabBar) => (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <DefaultTabBar {...props} className="site-custom-tab-bar" />
            <div
              style={{
                display: "flex",
                flexDirection: "row",
              }}
            >
              {/* <Button
                type="default"
                icon={<DownloadOutlined style={{ color: "#1890ff" }} />}
                // loading={btnloadding}
                onClick={() => {
                  alert("Chức năng đang chờ backend phát triển")
                }}
                className="d-flex"
                style={{ alignItems: "center", marginRight: 5 }}
              >
                <span style={{ color: "#1890ff" }}> Xuất Excel</span>
              </Button> */}
              <Button
                onClick={() => {
                  setReLoadCTables(true);
                }}
                className="d-flex"
                style={{ alignItems: "center", marginRight: 5 }}
                type="ghost"
                icon={<ReloadOutlined />}
              >
                Tải lại
              </Button>
              <Button type="primary" onClick={() => _handleShowModal(true)}>
                Tạo bảng kê
              </Button>
            </div>
          </div>
        )}
      >
        <TabPane tab="DANH SÁCH" key="1">
          <UnBoard
            cTablesLoading={cTablesLoading}
            cTables={cTables}
            orders={orders}
            setReLoadOrders={setReLoadOrders}
            setCTables={setCTables}
            setReLoadCTables={setReLoadCTables}
            onShowModal={_handleShowModal}
            onEditCTableRecord={_handleEditCTableRecord}
          />
        </TabPane>
        <TabPane tab="BẢNG" key="2">
          <Board
            cTables={cTables}
            setCTables={setCTables}
            setReLoadCTables={setReLoadCTables}
            orders={orders}
            setReLoadOrders={setReLoadOrders}
            onShowModal={_handleShowModal}
            onShowOrderModal={_handleShowOrderModal}
            onEditCTableRecord={_handleEditCTableRecord}
          />
        </TabPane>
      </Tabs>
      {modal.get("visible") && (
        <CreateFromNew
          modal={modal}
          definitions={definitions}
          handleShowModal={_handleShowModal}
        />
      )}
      <CreateOrderModalBeta
        uuid={uuid}
        setUuid={setUuid}
        isAddToCTable={true}
        onAddToCTable={_handleAddToCTable}
        modal={orderModal}
        handleShowModal={_handleShowOrderModal}
      />
    </Row>
  );
};
const mapStateToProps = createStructuredSelector({
  definitions: makeSelectDefinitions(),
});
const withConnect = connect(
  mapStateToProps,
  null
);
Page.propTypes = {
  className: PropTypes.any,
};
export default styled(withConnect(Page))`
  margin-bottom: 0px !important;
  .page-content {
    padding: 1rem 1rem;
    border: 1px solid #ebedf2;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .page-content__action {
      display: flex;
      flex-wrap: wrap;
      .ant-btn {
        margin-left: 5px;
      }
    }
  }
`;
