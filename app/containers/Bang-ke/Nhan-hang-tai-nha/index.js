
import React, { useState, useCallback, useLayoutEffect } from "react";
import { Row, Button } from "antd";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Tabs, TabPane } from "components";
import { Map } from "immutable";
import moment from "moment";
import { useLoadBangKeXhXeTuyen, useLoadOrders } from "utils/hooks";
import ServiceBase from "utils/ServiceBase";
import { API_BASE_URL } from "utils/constants";
import { Ui } from "utils/Ui";
import { DATE_TIME_FORMAT } from "utils/constants";
import _ from "lodash";
import { createStructuredSelector } from "reselect";
import { makeSelectDefinitions } from "containers/App/selectors";
import { connect } from "react-redux";
import * as qs from "query-string";
import List from "./List";
import Modal from "./Modal";
/**
 *
 * Hiển thị bảng kê xuất hàng xe tuyến, at the '/bang-ke/xuat-hang/xe-tuyen' route
 *
 */
const data = [
    {
        "id":"7461972739",
        "code":"7461972739",
        "create_time":"2020-08-10T06:43:44.000000Z",
        "time_start":"11:00",
        "driver":"",
        "driver_phone":"",
        "seats":44,
        "occupy_seats":0,
        "staff_create":"Đồng Văn Sơn",
        "updated_at":"2020-08-10T06:43:44.000000Z",
        "status":1,
        "orders":[
        {
        "id":"167461319512",
        "code":"167461319512",
        "source":{
        "id":2,
        "name":"Mỹ Đình",
        "code":"MDI"
        },
        "destination":{
        "id":20,
        "name":"Yên Bái (Km 110 - 130)",
        "code":"YBA"
        },
        "status":2,
        "sender":{
        "phone":"0936148732",
        "name":"Nguyễn Hữu Hoà",
        "address":null
        },
        "receiver":{
        "phone":"0936148732",
        "name":"Nguyễn Hữu Hoàn",
        "address":"125 Hoang Ngan"
        },
        "num_of_package":3,
        "payment_type":1,
        "order_fee":140000,
        "order_cod":0,
        "note":"Chuyển thẳng về nhà",
        "undelivered_reason":null,
        "cod_transferred":false,
        "creator":{
        "id":1,
        "name":"Đồng Văn Sơn"
        },
        "created_at":"2020-08-10T04:59:54.000000Z",
        "updated_at":"2020-08-10T04:59:54.000000Z"
        },
        {
        "id":"167461319515",
        "code":"167461319515",
        "source":{
        "id":2,
        "name":"Mỹ Đình",
        "code":"MDI"
        },
        "destination":{
        "id":20,
        "name":"Yên Bái (Km 110 - 130)",
        "code":"YBA"
        },
        "status":2,
        "sender":{
        "phone":"0936148732",
        "name":"Nguyễn Hữu Hoà",
        "address":null
        },
        "receiver":{
        "phone":"0936148732",
        "name":"Nguyễn Hữu Hoàn",
        "address":"125 Hoang Ngan"
        },
        "num_of_package":3,
        "payment_type":1,
        "order_fee":140000,
        "order_cod":0,
        "note":"Chuyển thẳng về nhà",
        "undelivered_reason":null,
        "cod_transferred":false,
        "creator":{
        "id":1,
        "name":"Đồng Văn Sơn"
        },
        "created_at":"2020-08-10T04:59:54.000000Z",
        "updated_at":"2020-08-10T04:59:54.000000Z"
        }
        ],
        "trip_route":{
        "trip_id":126,
        "not_code":"MDI - LCA1100B",
        "route_id":10,
        "route_name":"Mỹ Đình - Lào Cai",
        "direction":2,
        "day":"01-10-2015"
        },
        "destination":{
        "id":1,
        "code":"GBA",
        "name":"Giáp Bát"
        },
        "creator":{
        "id":1,
        "name":"Đồng Văn Sơn",
        "username":"admin",
        "email":"sondv@gmail.com",
        "phone":"0356071198",
        "status":1
        }
    },
]
const Page = ({ className, definitions }) => {
    const [modal, setModal] = useState(Map({ visible: false, isEdit: false }));
    const [filter, setFilter] = useState(
        Map({
          cTableId: "",
          license_plate: "",
          time_start: undefined,
          begin: moment().startOf("day"),
          finish: moment().endOf("day"),
        })
      );
    
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
    },
    []
  );
    const cTables = data
    let _handleFiltered = useCallback(() => {
        return cTables
          // .filter((cTable) => {
          //     console.log("cTable", cTable)
          //   return (
          //     (filter.get("cTableId")
          //       ? cTable.get("code").includes(filter.get("cTableId"))
          //       : true) &&
          //     (filter.get("license_plate")
          //       ? cTable.get("license_plate").includes(filter.get("license_plate"))
          //       : true) &&
          //     (filter.get("time_start")
          //       ? cTable.get("time_start") === filter.get("time_start")
          //       : true) &&
          //     (filter.get("route")
          //       ? cTable.getIn(["trip_route", "route_id"]) === filter.get("route")
          //       : true) &&
          //     (filter.get("begin") && cTable.get("create_time")
          //       ? moment(cTable.get("create_time")).isBetween(
          //           moment(filter.get("begin").startOf("day")),
          //           moment(filter.get("finish").endOf("day"))
          //         )
          //       : true)
          //   );
          // })
          // .toJS()
          .map((dt) => {
            return {
              cTableId: dt.code,
              license_plate: dt.license_plate,
              time_start: dt.time_start,
              created_at: dt.created_at,
              status: dt.status,
              trip_route: dt.trip_route,
              seats: `${dt.occupy_seats}/${dt.seats}`,
              amount: _.sumBy(dt.orders, (x) => x.order_fee),
              numberPackage: _.sumBy(dt.orders, (x) => x.num_of_package),
              children: _.map(dt.orders, (order, orderId) => {
                return {
                  stt: orderId + 1,
                  order_id: order.code,
                  depot_destination_name: order.destination?.name,
                  receiver_address: order.receiver?.address,
                  receiver_phone: order.receiver?.phone,
                  receiver_name: order.receiver?.name,
                  sender_name: order.sender?.name,
                  sender_phone: order.sender?.phone,
                  sender_address: order.sender?.address,
                  num_of_package: order.num_of_package,
                  order_fee: order.order_fee,
                  order_cod: order.order_cod,
                  create_time: moment(order.created_at).format(
                    DATE_TIME_FORMAT.DD_MM_YYYY
                  ),
                  status: order.status,
                };
              }),
            };
          });
      }, [filter, cTables]);
    let filtered = _handleFiltered();
  return (
   <div>
      <Button type="primary" onClick={() => _handleShowModal(true)}>
        Tạo bảng kê
      </Button>
       <List dataSource={filtered}/>
       <Modal
          definitions={definitions}
          modal={modal}
          handleShowModal={_handleShowModal}
        />
   </div>
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
