import React, { memo, useState, useCallback } from "react";
import { EditTwoTone, DeleteTwoTone, PrinterTwoTone } from "@ant-design/icons";
import { Table, Row, Col, Space, Button, Modal, Tag } from "antd";
import { ARR_STATUS_ORDER, ARR_HTTT_ORDER } from "../constants";
import { DefineTextArea, DefinePagination } from "components";
import ServiceBase from "utils/ServiceBase";
import { Ui } from "utils/Ui";
import _ from "lodash";
import moment from "moment";
import styled from "styled-components";
import PropTypes from "prop-types";
import { createStructuredSelector } from "reselect";
import { makeSelectDefinitions } from "containers/App/selectors";
import { connect } from "react-redux";

const convert = function (str) {
  if (str) return str.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  else return "";
};

const finalFee = function(objOder){
  let final_fee = 0;
  if(objOder['order_fee']['amount'] && objOder['order_fee']['amount'] > 0)
    final_fee += objOder['order_fee']['amount']
  
  if(objOder['cod_fee']['amount'] && objOder['cod_fee']['amount'] > 0)
    final_fee += objOder['cod_fee']['amount']
  
  if(objOder['r_shipping_fee']['amount'] && objOder['r_shipping_fee']['amount'] > 0)
    final_fee += objOder['r_shipping_fee']['amount']

  if(objOder['d_shipping_fee']['amount'] && objOder['d_shipping_fee']['amount'] > 0)
    final_fee += objOder['d_shipping_fee']['amount']

  if(objOder['discount'])
    final_fee = final_fee - objOder['discount']
  
  return final_fee
}
/*
 * table đơn hàng
 *
 */
const tableOrder = memo(
  ({
    className,
    headerColumns,
    dataBin,
    params,
    setParams,
    uuid,
    setUuid,
    pagination,
    definitions,
    total
  }) => {

    const _setUuid = useCallback(
      (uuid) => {
        console.log('uuid', uuid)
        setUuid(uuid);
      },
      [setUuid]
    );

    let columns = [
      {
        title: "Mã đơn",
        width: 130,
        key: "code",
        fixed: "left",
        render: (text, record) => (
          <>
            <div>{record['order']["code"]}</div>
            <Tag
              style={{
                width: '100%'
              }}
              color={definitions.getIn([
                "order_statuses",
                `${record['order']['status']}`,
                "color",
              ])}
            >
              {definitions.getIn([
                "order_statuses",
                `${record['order']['status']}`,
                "text",
              ])}
            </Tag>
          </>
        ),
      },
      {
        title: "Địa chỉ nhận",
        width: 170,
        fixed: "left",
        render: (text, record) => (
          <>
            <span>{record['order']["destination"]["name"]}</span><br/>
            <span>{record['order']["receiver"]["address"]}</span>   
          </>       
        ),
      },
      {
        title: "Người nhận",
        width: 120,
        fixed: "left",
        render: (text, record) => (
          <>
          <span>{record['order']["receiver"]["name"]}</span><br/>
          <em>{record['order']["receiver"]["phone"]}</em>
          </>
        ),
      },
      {
        title: "VP nhận hàng",
        width: 170,
        fixed: "left",
        render: (text, record) => (
          <>
            <span>{record['order']["source"]["name"]}</span><br/>
            {/* <span>{record['order']["sender"]["address"]}</span>    */}
          </>  
        ),
      },
      {
        title: "Người gửi",
        width: 120,
        render: (text, record) => (
          <>
          <span>{record['order']["sender"]["name"]}</span><br/>
          <em>{record['order']["sender"]["phone"]}</em>
          </>
        ),
      },
      {
        title: "Số kiện",
        width: 70,
        render: (text, record) => (
          <span>{record['order']["num_of_package"]}</span>
        )
      },

      {
        title: "COD",
        width: 100,
        render: (text, record) => <div>{convert(record['order']["order_cod"])}</div>,
      },
      {
        title: "Cước phí",
        width: 120,
        render: (text, record) => (
          <>
            <span>{convert(finalFee(record['order']))}</span><br/>
            {/* <span>
              {definitions.getIn([
                "payment_types",
                `${record['order']['order_fee']['paying_side']}`,
                "text",
              ])}
            </span> */}
          </>
        )
      },
      {
        title: "Người tạo",
        width: 150,
        render: (text, record) => (
          <>
            <span>{record['order']["creator"]["name"]}</span><br/>
            <span>{moment(record['order']["created_at"]).format("DD-MM-YYYY HH:mm")}</span>
          </>
        )
      },
      {
        title: "Trạng thái",
        width: 140,
        dataIndex: "status",
        key: "status",
        render: (text, record) => (
          <>
            <span>{record['order']["creator"]["name"]}</span><br/>
            <Tag
              style={{
                width: '100%'
              }}
              color={definitions.getIn([
                "issue_statuses",
                `${record['status']}`,
                "color",
              ])}
            >
              {definitions.getIn([
                "issue_statuses",
                `${record['status']}`,
                "text",
              ])}
            </Tag>
          </>
        ),
      },
      {
        title: "   ",
        width: 40,
        dataIndex: "7",
        key: "7",
        fixed: "right",
        render: (text, record) => (
          <>
            <Button
              size="small"
              type="link"
              onClick={() => {
                _setUuid(record["id"]);
              }}
            >
              <EditTwoTone />
            </Button>
          </>
        ),
      },
    ];

    // modal

    const [_visibleOrder, Set_visibleOrder] = useState(false);
    const [_lyDoXoaDonHang, Set_lyDoXoaDonHang] = useState("");
    const [_uuidXoaDonHang, Set_uuidXoaDonHang] = useState("");
    const modalhandleCancel = () => {
      Set_visibleOrder(false);
    };
    const CancelOrder = useCallback(async (_id) => {
      const result = await ServiceBase.requestJson({
        method: "POST",
        url: `/v1/orders/${_id}/cancel`,
        data: {
          reason: _lyDoXoaDonHang,
        },
      });
      if (result.hasErrors) {
        Ui.showErrors(result.errors);
      } else {
        Ui.showSuccess({ message: "Hủy đơn hàng thành công." });
        Set_visibleOrder(false);
      }
    }, [_lyDoXoaDonHang]);
    const huyDonHang = () => {
      CancelOrder(_uuidXoaDonHang);
    };
    return (
      <div className={className}>

        <Table
          bordered
          columns={columns}
          dataSource={dataBin}
          scroll={{ x: "100%" }}
          rowKey="code"
          pagination={false}
        />
        <DefinePagination
          total={total}
          onPagination={(page, limit) => {
            setParams((props) => {
              let nextState = { ...props };
              nextState['per_page'] = limit;
              nextState['page'] = page;
              return nextState;
            });
          }}
          margin="bottom"
        />
        <Row justify="end" gutter={[8, 8]}>
          <Col style={{ marginTop: "10px" }} />
        </Row>
      </div>
    );
  }
);
tableOrder.propTypes = {
  className: PropTypes.any,
  dataBin: PropTypes.array,
};
const mapStateToProps = createStructuredSelector({
  definitions: makeSelectDefinitions(),
});
const withConnect = connect(
  mapStateToProps,
  null
);
export default styled(withConnect(tableOrder))`
  .ant-row-end {
    // display: none
  }
  .ant-table-ping-right:not(.ant-table-has-fix-right)
    .ant-table-container::after {
    box-shadow: none;
  }
  .ant-table-tbody > tr > td,
  .ant-table tfoot > tr > th,
  .ant-table tfoot > tr > td {
    padding-top:0px !important;
    padding-bottom:0px !important;
    padding-left: 5px !important;
    padding-right: 5px !important;
  }
  .ant-table-thead > tr > th {
    background-color : rgba(233, 195, 43);
    padding-top:5px !important;
    padding-bottom:5px !important;
    padding-left: 5px !important;
    padding-right: 5px !important;
  }
`;
