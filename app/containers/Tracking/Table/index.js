import React, { memo, useState, useCallback } from "react";
import { EditTwoTone, DeleteTwoTone, PrinterTwoTone } from "@ant-design/icons";
import { Table, Row, Col, Space, Button, Modal, Tag } from "antd";
import { ARR_STATUS_ORDER, ARR_HTTT_ORDER } from "../constants";
import { DefineTextArea, DefinePagination, DefineTable } from "components";
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
const finalFee = function (objOder) {
  let final_fee = 0;
  if (objOder['order_fee']['amount'] && objOder['order_fee']['amount'] > 0)
    final_fee += objOder['order_fee']['amount']

  if (objOder['cod_fee']['amount'] && objOder['cod_fee']['amount'] > 0)
    final_fee += objOder['cod_fee']['amount']

  if (objOder['r_shipping_fee']['amount'] && objOder['r_shipping_fee']['amount'] > 0)
    final_fee += objOder['r_shipping_fee']['amount']

  if (objOder['d_shipping_fee']['amount'] && objOder['d_shipping_fee']['amount'] > 0)
    final_fee += objOder['d_shipping_fee']['amount']

  if (objOder['discount'])
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
        setUuid(uuid);
      },
      [setUuid]
    );

    let columns = [
      {
        title: "Mã đơn",
        width: 130,
        dataIndex: "code",
        key: "code",
        fixed: "left",
      },
      {
        title: "VP đích",
        width: 100,
        fixed: "left",
        render: (text, record) => (
          <div>{record["destination"]["name"]}</div>
        ),
      },
      {
        title: "Địa chỉ nhận",
        width: 200,
        fixed: "left",
        render: (text, record) => (
          <div>{record["receiver"]["address"]}</div>
        ),
      },
      {
        title: "Người nhận",
        width: 120,
        fixed: "left",
        render: (text, record) => (
          <div className="d-flex" style={{ flexDirection: "column" }}>
            <h5> {record["receiver"]["name"]}</h5>
            <em> {record["receiver"]["phone"]}</em>
          </div>
        ),
      },
      {
        title: "Người gửi",
        width: 120,
        render: (text, record) => (
          <div className="d-flex" style={{ flexDirection: "column" }}>
            <h5>{record["sender"]["name"]}</h5>
            <em>{record["sender"]["phone"]}</em>
          </div>
        ),
      },
      {
        title: "Số kiện",
        width: 70,
        dataIndex: "num_of_package",
        key: "num_of_package",
      },
      {
        title: "Cước phí",
        width: 100,
        render: (text, record) => <div>{convert(finalFee(record))}</div>,
      },
      {
        title: "COD",
        width: 100,
        render: (text, record) => <div>{convert(record["order_cod"])}</div>,
      },
      // {
      //   title: "HTTT",
      //   width: 130,
      //   dataIndex: "payment_type",
      //   key: "payment_type",
      //   render: (text, record) => (
      //     <div>{definitions.getIn([
      //       "payment_types",
      //       `${record['order_fee']['paying_side']}`,
      //       "text",
      //     ])}</div>
      //   ),
      // },
      {
        title: "Người tạo",
        width: 150,
        render: (text, record) => <div>{record["creator"]["name"]}</div>,
      },
      {
        title: "Thời gian tạo",
        width: 150,
        render: (text, record) => (
          <div>
            {moment(record["created_at"]).format("DD-MM-YYYY HH:mm")}
          </div>
        ),
      },
      {
        title: "Trạng thái",
        width: 130,
        dataIndex: "status",
        key: "status",
        render: (text) => (
          <Tag
            color={definitions.getIn([
              "order_statuses",
              `${text}`,
              "color",
            ])}
          >
            {definitions.getIn([
              "order_statuses",
              `${text}`,
              "text",
            ])}
          </Tag>
        ),
      },
      {
        title: "THAO TÁC",
        width: 80,
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
      <div>
        <Row justify="end" gutter={[8, 8]}>
          <Col style={{ marginTop: "10px" }}>
            <Modal
              title="Xác nhận hủy đơn hàng"
              visible={_visibleOrder}
              onOk={huyDonHang}
              confirmLoading={""}
              onCancel={modalhandleCancel}
            >
              <DefineTextArea
                placeholder={"Nhập lý do"}
                minRows={6}
                maxRows={6}
                value={_lyDoXoaDonHang}
                change={(e) => {
                  let { value } = e.target;
                  Set_lyDoXoaDonHang(value);
                }}
              />
            </Modal>
          </Col>
        </Row>
        <DefineTable
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
  padding: 5px 5px;
  .ant-table-ping-right:not(.ant-table-has-fix-right)
    .ant-table-container::after {
    box-shadow: none;
  }
`;
