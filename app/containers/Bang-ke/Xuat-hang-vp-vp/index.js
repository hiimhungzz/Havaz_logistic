import React, { useState, useCallback, useLayoutEffect, useEffect } from "react";
import { Row, Col, Spin, Button } from "antd";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Map } from "immutable";
import {
  useLoadBangKeXhXeTrungChuyen,
  useLoadDrivers,
  useLoadVehicles,
  useLoadDriversActive
} from "utils/hooks";
import Modal from "./Modal";
import Filter from "./Filter";
import ListTrungChuyen from "./List";
import moment from "moment";
import _ from "lodash";
import { API_BASE_URL, DATE_TIME_FORMAT } from "utils/constants";
import ServiceBase from "utils/ServiceBase";
import { Ui } from "utils/Ui";
import { createStructuredSelector } from "reselect";
import { makeSelectDefinitions } from "containers/App/selectors";
import { connect } from "react-redux";
import { useLocation } from "react-router-dom";
import * as qs from "query-string";
import { List, fromJS } from "immutable";
/**
 *
 * Hiển thị bảng kê xuất hàng xe tuyến, at the '/bang-ke/xuat-hang/xe-tuyen' route
 *
 */
const Page = ({ className, definitions }) => {
  // const a  = useSelector(state=>state.App.getIn(['definitions']));
  // console.log(a.toJS())
  const { search } = useLocation();
  const [reload, setReLoad] = useState(false);
  const [firstLoad, setFirstLoad] = useState(true);
  const [data, setData] = useState(List());
  const [loading, setLoading] = useState(true);
  const [params, setParams] = useState({
    begin: moment().startOf("day"),
    finish: moment().endOf("day"),
  })

  const [filter, setFilter] = useState(
    Map({
      MTableId: "",
      license_plate: "",
      time_start: undefined,
      begin: moment().startOf("day"),
      finish: moment().endOf("day"),
    })
  );

  const [, drivers, ,] = useLoadDriversActive();
  const [, vehicles, ,] = useLoadVehicles();
  const [modal, setModal] = useState(Map({ visible: false, isEdit: false }));

  const _handleCancelMTableRecord = useCallback(
    async (mTableId) => {
      let result = await ServiceBase.requestJson({
        baseUrl: API_BASE_URL,
        url: `/v1/transshipment/${mTableId}/cancel`,
        method: "POST",
        data: {
          note: "Huỷ chuyến",
        },
      });
      if (result.hasErrors) {
        Ui.showError({ message: "Có lỗi khi hủy bản kê." });
      } else {
        Ui.showSuccess({ message: "Hủy bản kê thành công." });
      }
    },
    []
  );
  const _handleEditMTableRecord = useCallback(async (mTable) => {
    setModal((prev) =>
      prev.update((x) => {
        x = x.set("visible", true);
        x = x.set("isEdit", true);
        x = x.set("mTableId", mTable.mTableId);
        x = x.set("mTableStatus", mTable.status);
        x = x.set("create_time", mTable.create_time);
        x = x.set("staff_create", mTable.staff_create);
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
        next = next.set("mTableId", null);
        next = next.set("mTableStatus", null);

        return next;
      });
      if (visible) {
        // setReLoadMTables(Boolean(false));
      } else {
        getData()
      }
    },
    []
  );
  let _handleFiltered = useCallback(() => {
    return data.filter((MTable) => {
      return (
        (filter.get("MTableId")
          ? MTable.get("code").includes(filter.get("MTableId"))
          : true) &&
        (filter.get("license_plate")
          ? MTable.get("license_plate").includes(filter.get("license_plate"))
          : true) &&
        (filter.get("time_start")
          ? MTable.get("time_start") === filter.get("time_start")
          : true)
      );
    })
      .toJS()
      .map((dt) => {
        return {
          mTableId: dt.code,
          license_plate: dt.car?.license_plate,
          time_start: dt.time_start,
          created_at: dt.created_at,
          create_time: moment(dt.create_time).format(
            DATE_TIME_FORMAT.DD_MM_YYYY__HH_MM
          ),
          staff_create: dt.actor?.name,
          destination_name: dt.destination?.name,
          status: dt.status,
          amount: _.sumBy(dt.orders, (x) => (_.get(x, 'order_fee.amount', 0) - _.get(x, 'discount', 0)) + _.get(x, 'cod_fee.amount', 0) + _.get(x, 'r_shipping_fee.amount', 0) + _.get(x, 'd_shipping_fee.amount', 0)),
          numberPackage: _.sumBy(dt.orders, (x) => x.num_of_package),
          driver: dt.driver?.name,
          driver_phone: dt.car?.phone,
          children: _.map(dt.orders, (order, orderId) => {
            return {
              stt: orderId + 1,
              order_id: order.code,
              destination: order.destination?.name,
              note: order.note,
              description: order.description,
              depot_destination_name: order.destination?.name,
              receiver_address: order.receiver?.address,
              receiver_phone: order.receiver?.phone,
              receiver_name: order.receiver?.name,
              sender_name: order.sender?.name,
              source_name: order.source?.name,
              sender_address: order.sender?.address,
              sender_phone: order.sender?.phone,
              num_of_package: order.num_of_package,
              order_fee: order.order_fee,
              discount: order.discount,
              cod_fee: order.cod_fee,
              r_shipping_fee: order.r_shipping_fee,
              d_shipping_fee: order.d_shipping_fee,
              order_cod: order.order_cod,
              create_time: moment(order.created_at).format(
                DATE_TIME_FORMAT.DD_MM_YYYY__HH_MM
              ),
              status: order.status,
            };
          }),
        };
      });
  }, [filter, data]);

  const loadID = useCallback( async () => {
    let parsed = qs.parse(search);
    let result = await ServiceBase.requestJson({
      baseUrl: API_BASE_URL,
      url: `/v1/export-transshipment/${parsed.id}?scope=should_exported`,
      method: "GET",
    });
    console.log("result loadID", result)
    if (result && result.hasErrors) {
      Ui.showError({ message: "Có lỗi khi đọc bảng kê." });
    } else {
      setTimeout(() => {
        setModal((prev) =>
          prev.update((x) => {
            x = x.set("visible", true);
            x = x.set("isEdit", true);
            x = x.set("mTableId", parsed.id);
            x = x.set("mTableStatus", result.value.data.status);
            x = x.set("create_time", result.value.data.create_time);
            x = x.set("staff_create", result.value.data.staff_create);
            return x;
          })
        );
      }, 300);
    }
  }, [search])

  // Load bảng kê theo id trên url
  useLayoutEffect(() => {
    if (search) {
      loadID()
    }
  }, [search]);

  const getData = useCallback(async () => {
    setLoading(true);
    const result = await ServiceBase.requestJson({
      baseURL: API_BASE_URL,
      url: `v1/transshipments?scope=transshipment&filterBy[create_date]=${moment(params.begin).format("YYYY-MM-DD")},${moment(params.finish).format("YYYY-MM-DD")}:btw`,
      method: "GET",
      data: {},
    });
    if (result.hasErrors) {
      Ui.showErrors(result.errors);
    } else {
      setData(fromJS(result.value.data));
    }
    await setLoading(false);
  }, [params]);

  useEffect(() => {
    getData()
  }, [getData])
  let filtered = _handleFiltered();
  return (
    <Row className={className} gutter={[16, 0]}>
      <Col xs={24}>
        <Filter filter={filter} setFilter={setFilter} setParams={setParams} params={params} />
      </Col>
      <Col xs={24}>
        <div className="page-content">
          <div className="page-content__title">
            DANH SÁCH BẢNG KÊ XUẤT HÀNG TRUNG CHUYỂN
          </div>
          <div className="page-content__action">
            <Button
              type="ghost"
              onClick={() => {
                getData()
              }}
            >
              Tải lại
            </Button>
            <Button type="primary" onClick={() => _handleShowModal(true)}>
              Thêm mới
            </Button>
          </div>
        </div>

        <Spin spinning={loading}>
          <ListTrungChuyen
            dataSource={filtered}
            onCancelMTableRecord={_handleCancelMTableRecord}
            onEditMTableRecord={_handleEditMTableRecord}
          />
        </Spin>
      </Col>
      {modal.get("visible") && (
        <Modal
          definitions={definitions}
          drivers={drivers}
          vehicles={vehicles}
          modal={modal}
          handleShowModal={_handleShowModal}
        />
      )}
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
    padding: 5px 0;
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
