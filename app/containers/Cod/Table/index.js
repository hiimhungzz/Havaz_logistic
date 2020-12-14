import React, { memo, useState, useCallback, useEffect } from "react";
import { EditTwoTone, DeleteTwoTone, PrinterTwoTone } from "@ant-design/icons";
import { Table, Row, Pagination, Col, Space, Button, Modal, Tag, Checkbox } from "antd";
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
const finalFee = function (objOder) {
  let final_fee = 0;
  if (objOder['order_fee']['amount'] && objOder['order_fee']['amount'] > 0)
    final_fee += objOder['order_fee']['amount']

  if (objOder.cod_fee && objOder?.cod_fee?.amount && objOder?.cod_fee?.amount > 0)
    final_fee += objOder?.cod_fee?.amount

  if (objOder['r_shipping_fee'] && objOder['r_shipping_fee']['amount'] && objOder['r_shipping_fee']['amount'] > 0)
    final_fee += objOder['r_shipping_fee']['amount']

  if (objOder['d_shipping_fee'] && objOder['d_shipping_fee']['amount'] && objOder['d_shipping_fee']['amount'] > 0)
    final_fee += objOder['d_shipping_fee']['amount']

  if (objOder['discount'])
    final_fee = final_fee - objOder['discount']

  return final_fee
}
const calCuocPhi = function(objOder) {
  let final_fee = objOder?.order_cod;
  if (objOder.cod_fee && objOder?.cod_fee?.amount && objOder?.cod_fee?.amount > 0 && objOder?.cod_fee?.paying_side === 1)
    final_fee -= objOder?.cod_fee?.amount

  return  final_fee
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
    let objChecked = {}
    _.forEach(dataBin, (i) => {
      objChecked[i['id']] = false;
    })
    const [indeterminate, SetIndeterminate] = useState(false)
    const [checkAll, SetCheckAll] = useState(false)
    const [checkId, SetCheckId] = useState([])
    const [onChecked, SetOnChecked] = useState(objChecked)
    // onChange checkbox all
    const onCheckAll = useCallback((e) => {
      SetCheckAll(e.target.checked)
      SetOnChecked((props) => {
        let nextState = { ...props };
        _.forEach(nextState, (value, key) => {
          nextState[key] = e.target.checked
        })
        return nextState;
      });
    }, [checkId])
    // onChange checkbox 
    const onCheck = useCallback((e, id) => {
      SetOnChecked((props) => {
        let nextState = { ...props };
        nextState[id] = e.target.checked;
        return nextState;
      });

    }, [onChecked])

    useEffect(() => {
      let itemIndeterminate = false;
      let itemCheckAll = true;
      let ArrId = [];
      _.forEach(onChecked, (value, key) => {
        if (!value) {
          itemCheckAll = false;
        } else {
          ArrId.push(key)
          itemIndeterminate = true;
        }
      })
      if (itemCheckAll) {
        itemIndeterminate = false;
      }
      if (ArrId.length === 0) {
        itemCheckAll = false
      }
      SetIndeterminate(itemIndeterminate)
      SetCheckAll(itemCheckAll)
      SetCheckId(ArrId)
    }, [onChecked])

    let checkboxHeader = (
      <Checkbox
        indeterminate={indeterminate}
        checked={checkAll}
        onChange={onCheckAll}
      >
      </Checkbox>
    )
    let columns = [
      {
        title: checkboxHeader,
        width: 50,
        key: "checkbox",
        fixed: "left",
        render: (text, record) => (
          <Checkbox
            checked={onChecked[record.id] || false}
            onChange={(e) => {
              onCheck(e, record.id)
            }}
          >
          </Checkbox>
        )
      },
      {
        title: "Mã đơn",
        width: 130,
        dataIndex: "code",
        fixed: "left",
        render: (text, record) => (
          <>
            <div>{record["code"]}</div>
            <Tag
              color={definitions.getIn([
                "order_statuses",
                `${record['status']}`,
                "color",
              ])}
            >
              {definitions.getIn([
                "order_statuses",
                `${record['status']}`,
                "text",
              ])}
            </Tag>
          </>
        ),
      },
      {
        title: "Số kiện",
        width: 70,
        dataIndex: "num_of_package",
        key: "num_of_package",
      },
      
      {
        title: "VP nhận hàng",
        width: 100,
        // fixed: "left",
        render: (text, record) => (
          <div>{record["source"]["name"]}</div>
        ),
      },

      {
        title: "Ngày nhận hàng",
        width: 100,
        dataIndex: "created_at",
        key: "created_at",
        render: (text) => moment(text).format("DD-MM-YYYY HH:mm")
      },

      {
        title: "VP phát hàng",
        width: 100,
        // fixed: "left",
        render: (text, record) => (
          <div>{record["destination"]["name"]}</div>
        ),
      },
      {
        title: "Ngày phát hàng",
        width: 100,
        dataIndex: "delivered_at",
        key: "delivered_at",
        render: (text) => moment(text).format("DD-MM-YYYY HH:mm")
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
        title: "Người nhận",
        width: 120,
        render: (text, record) => (
          <div className="d-flex" style={{ flexDirection: "column" }}>
            <h5>{record["receiver"]["name"]}</h5>
            <em>{record["receiver"]["phone"]}</em>
          </div>
        ),
      },
      
      {
        title: "COD",
        width: 100,
        render: (text, record) => <div>{convert(record["order_cod"])}</div>,
      },
      {
        title: "Cước COD",
        width: 100,
        render: (text, record) => <div>{convert(record?.cod_fee?.amount)}</div>,
      },
      {
        title: "HTTT cước COD",
        width: 190,
        render: (text, record) => <div>
          <Tag
              color={record['cod_fee']['paying_side'] === 2 ? "#1cb75b" : "red"}
            >
          <em style={{ marginBottom: "0em" }}>{definitions.getIn([
              "payment_types",
              `${record['cod_fee']['paying_side']}`,
              "text",
            ])}</em>
          </Tag> 
        </div>,
      },
      {
        title: "Số tiền thanh toán NG (sau khấu trừ)",
        width: 170,
        render: (text, record) => <div>{convert(calCuocPhi(record))}</div>,
      },
      {
        title: "Trạng thái",
        width: 100,
        render: (text, record) => (
          <>
            <Tag
              color={record['cod_transferred'] ? "#1cb75b" : "red"}
            >
              <em>
                {record['cod_transferred'] ? "Đã trả" : "Chưa trả"}
              </em>
            </Tag>
          </>
        )
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

    const sendNotify = useCallback(async () => {
      const result = await ServiceBase.requestJson({
        method: "POST",
        url: `/v1/notification/delivery-orders`,
        data: {
          order_ids: checkId,
        },
      });
      if (result.hasErrors) {
        Ui.showErrors(result.errors);
      } else {
        SetCheckId([])
        Ui.showSuccess({ message: "Gửi SMS thành công." });
      }
    }, [checkId]);

    const huyDonHang = () => {
      CancelOrder(_uuidXoaDonHang);
    };
    return (
      <div className={className}>
        <Row justify="start" gutter={[8, 8]}>
          <Col style={{ marginTop: "10px" }}>
            <div style={{ display: checkId.length > 0 ? false : 'none' }}>
              <span style={{ color: 'rgb(248, 71, 1)' }}>Đã chọn {checkId.length} Đơn hàng</span>
              <Button type="primary" shape="round" style={{ marginLeft: '10px' }} onClick={sendNotify}>
                Send SMS
              </Button>
            </div>
          </Col>
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
        </Row>
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
