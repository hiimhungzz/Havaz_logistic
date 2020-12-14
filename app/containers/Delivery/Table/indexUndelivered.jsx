import React, { memo, useCallback, useState, useEffect } from "react";
import { EditTwoTone } from "@ant-design/icons";
import { Table, Row, Col, Space, Button, Tag, Checkbox } from "antd";
import moment from "moment";
import styled from "styled-components";
import PropTypes from "prop-types";
import { createStructuredSelector } from "reselect";
import ServiceBase from "utils/ServiceBase";
import { Ui } from "utils/Ui";
import { makeSelectDefinitions } from "containers/App/selectors";
import { connect } from "react-redux";
import _ from "lodash"
import { DefinePagination, DefineTable } from "components";

/*
 * table đơn hàng
 *
 */
const calculatorTotalnumber = function (reccord) {
  let totalNumber = reccord['order_cod'];

  if (reccord['order_fee']['amount'] && reccord['order_fee']['amount'] > 0) {
    if (reccord['order_fee']['paying_side'] === 2) {
      totalNumber += reccord['order_fee']['amount']
    }
  }

  if (reccord['cod_fee']['amount'] && reccord['cod_fee']['amount'] > 0) {
    if (reccord['cod_fee']['paying_side'] === 2) {
      totalNumber += reccord['cod_fee']['amount']
    }
  }

  if (reccord['r_shipping_fee']['amount'] && reccord['r_shipping_fee']['amount'] > 0) {
    if (reccord['r_shipping_fee']['paying_side'] === 2) {
      totalNumber += reccord['r_shipping_fee']['amount']
    }
  }

  if (reccord['d_shipping_fee']['amount'] && reccord['d_shipping_fee']['amount'] > 0) {
    if (reccord['d_shipping_fee']['paying_side'] === 2) {
      totalNumber += reccord['d_shipping_fee']['amount']
    }
  }

  return totalNumber
}

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

const convertTime = function (key, record) {
  let time = ""
  if (key === 'TAB1') {
    time = moment(record["create_date"]).format("DD-MM-YYYY HH:mm")
  }
  if (key === 'TAB2') {
    time = moment(record["delivered_at"]).format("DD-MM-YYYY HH:mm")
  }
  if (key === 'TAB3') {
    time = moment(record["undelivered_at"]).format("DD-MM-YYYY HH:mm")
  }

  return time
}
const tongCuocNguoiNhanTra = function (objOder) {
  let final_fee = 0,
    discount = 0;
  if (objOder['discount'])
    discount = objOder['discount'] || 0

  if (objOder['order_fee']['amount'] && objOder['order_fee']['paying_side'] && objOder['order_fee']['paying_side'] === 2 && objOder['order_fee']['amount'] > 0)
    final_fee += (objOder['order_fee']['amount'] - discount)

  if (objOder.cod_fee && objOder['cod_fee']['paying_side'] && objOder['cod_fee']['paying_side'] === 2 && objOder?.cod_fee?.amount && objOder?.cod_fee?.amount > 0)
    final_fee += objOder?.cod_fee?.amount

  if (objOder['r_shipping_fee'] && objOder['r_shipping_fee']['paying_side'] && objOder['r_shipping_fee']['paying_side'] === 2 && objOder['r_shipping_fee']['amount'] && objOder['r_shipping_fee']['amount'] > 0)
    final_fee += objOder['r_shipping_fee']['amount']

  if (objOder['d_shipping_fee'] && objOder['d_shipping_fee']['paying_side'] && objOder['d_shipping_fee']['paying_side'] === 2 && objOder['d_shipping_fee']['amount'] && objOder['d_shipping_fee']['amount'] > 0)
    final_fee += objOder['d_shipping_fee']['amount']

  if (objOder['order_cod'])
    final_fee += objOder['order_cod'] || 0

  return final_fee
}

const tongCuocNguoiGuiTra = function (objOder) {
  let final_fee = 0,
    discount = 0;
  if (objOder['discount'])
    discount = objOder['discount'] || 0

  if (objOder['order_fee'] && objOder['order_fee']['amount'] && objOder['order_fee']['paying_side'] && objOder['order_fee']['paying_side'] === 2 && objOder['order_fee']['amount'] > 0)
    final_fee += (objOder['order_fee']['amount'] - discount)


  console.log(objOder['order_fee'])
  return final_fee
}
const tableOrder = memo(
  ({
    tableType,
    dataBin,
    setUuid,
    definitions,
    setParams,
    total,
    className
  }) => {
    const convert = function (str) {
      if (str) return str.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      else return "";
    };
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
        title: "NV cập nhật trạng thái cuối",
        width: 150,
        // fixed: "left",
        render: (text, record) => (
          <div className="d-flex" style={{ flexDirection: "column" }}>
            {/* <h5 style={{ marginBottom: "0em" }}> {record["destination"]["name"]}</h5> */}
            {/* <p style={{ marginBottom: "0em" }}> {record["destination"]["address"]}</p> */}
          </div>
        ),
      },
      {
        title: "Mã đơn",
        width: 130,
        dataIndex: "code",
        render: (text, record) => (
          <div className="d-flex" style={{ flexDirection: "column" }}>
            <div style={{ cursor: 'pointer' }} onClick={() => {
              window.open(`tracking/${record.code}`, "_blank")
            }}>
              <p style={{ marginBottom: "0em" }}> {record["code"]}</p>
            </div>
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
          </div>
        )
      },
      {
        title: "VP phát hàng",
        width: 150,
        render: (text, record) => (
          <div className="d-flex" style={{ flexDirection: "column" }}>
            <h5 style={{ marginBottom: "0em" }}> {record["destination"]["name"]}</h5>
            {/* <p style={{ marginBottom: "0em" }}> {record["destination"]["address"]}</p> */}
          </div>
        ),
      },
      {
        title: "NV phát",
        width: 150,
        // render: (text, record) => <Space>{record?.delivered_by?.code} {record?.delivered_by?.name}</Space>,
        render: (text, record) => <div>
          <div>{record?.delivered_by?.code}</div>
          <div>{record?.delivered_by?.name}</div>
        </div>,
      },
      {
        title: "Tiền thu hộ COD",
        width: 150,
        render: (text, record) => <div>{convert(record["order_cod"])}</div>,
      },
      {
        title: "Cước VC - thu NN",
        width: 150,
        render: (text, record) => <div>{convert(tongCuocNguoiGuiTra(record))}</div>,
      },
      {
        title: "Thu NN",
        width: 100,
        render: (text, record) => <div style={{ color: "red" }}>
          {convert(tongCuocNguoiNhanTra(record))}
        </div>,
      },
      {
        title: "Tổng cước",
        width: 190,
        render: (text, record) => (
          <div className="d-flex" style={{ flexDirection: "column" }}>
            <h5 style={{ marginBottom: "0em" }}>{convert(finalFee(record))}</h5>
          </div>
        )
      },
      {
        title: "Cước vận chuyển (bến - bến)",
        width: 130,
        render: (text, record) => <div style={{ color: record['order_fee']['paying_side'] === 2 ? "red" : "#1cb75b" }}>
          {convert(record['order_fee']['amount'] - record?.discount * 1)}
        </div>,
      },
      {
        title: "Cước COD",
        width: 100,
        render: (text, record) => <div style={{ color: record['cod_fee']['paying_side'] === 2 ? "red" : "black" }}>
          {convert(record['cod_fee']['amount'])}
        </div>,
      },
      {
        title: "Cước ship nhận",
        width: 130,
        render: (text, record) => <div style={{ color: record['r_shipping_fee']['paying_side'] === 2 ? "red" : "#1cb75b" }}>
          {convert(record['r_shipping_fee']['amount'])}
        </div>,
      },
      {
        title: "Cước ship trả",
        width: 130,
        render: (text, record) => <div style={{ color: record['d_shipping_fee']['paying_side'] === 2 ? "red" : "#1cb75b" }}>
          {convert(record['d_shipping_fee']['amount'])}
        </div>,
      },
      // {
      //   title: "Mô tả hàng",
      //   width: 200,
      //   render: (text, record) => <div>
      //     {record["description"]}
      //   </div>,
      // },
      {
        title: "Số kiện",
        width: 70,
        dataIndex: "num_of_package",
        key: "num_of_package",
      },
      {
        title: "Người gửi",
        width: 120,
        render: (text, record) => (
          <div className="d-flex" style={{ flexDirection: "column" }}>
            <h5>{record["sender"]["name"] === record["sender"]["phone"] ? "" : record["sender"]["name"]}</h5>
            <p style={{ marginBottom: "0em" }}>{record["sender"]["phone"]}</p>
          </div>
        ),
      },
      {
        title: "NV Nhận hàng",
        width: 150,
        render: (text, record) => (
          <div className="d-flex" style={{ flexDirection: "column" }}>
            <p style={{ marginBottom: "0em" }}>{record["creator"]["name"]}</p>
            <p style={{ marginBottom: "0em" }}>{moment(record["created_at"]).format("DD-MM-YYYY HH:mm")}</p>
          </div>
        ),
      },
      {
        title: "VP nhận hàng",
        width: 150,
        // fixed: "left",
        render: (text, record) => (
          <div className="d-flex" style={{ flexDirection: "column" }}>
            <h5 style={{ marginBottom: "0em" }}> {record["source"]["name"]}</h5>
            <p style={{ marginBottom: "0em" }}> {record["sender"]["address"]}</p>
          </div>
        ),
      },
      {
        title: "Ghi chú nhận hàng",
        width: 200,
        render: (text, record) => <div>
          {record["note"]}
        </div>,
      },
      {
        title: "Địa chỉ phát hàng",
        width: 200,
        render: (text, record) => <div>
          {record?.receiver?.address}
        </div>,
      },
      {
        title: "Người nhận",
        width: 120,
        // fixed: "left",
        render: (text, record) => (
          <div className="d-flex" style={{ flexDirection: "column" }}>
            <h5 style={{ marginBottom: "0em" }}> {record["receiver"]["name"] === record["receiver"]["phone"] ? "" : record["receiver"]["name"]}</h5>
            <em style={{ marginBottom: "0em" }}> {record["receiver"]["phone"]}</em>
          </div>
        ),
      },
      {
        title: "Mô tả hàng",
        width: 200,
        render: (text, record) => <div>
          {record["description"]}
        </div>,
      },
      {
        title: "BKS tuyến kế nối",
        width: 150,
        render: (text, record) => (
          <div className="d-flex" style={{ flexDirection: "column" }}>
            {/* <p style={{ marginBottom: "0em" }}>{record["creator"]["name"]}</p>
            <p style={{ marginBottom: "0em" }}>{moment(record["created_at"]).format("DD-MM-YYYY HH:mm")}</p> */}
          </div>
        ),
      },
      {
        title: "Thời gian nhập hàng vào ĐKN",
        width: 180,
        render: (text, record) => (
          <div className="d-flex" style={{ flexDirection: "column" }}>
            <p style={{ marginBottom: "0em" }}>{moment(record["current_imported_at"]).format("DD-MM-YYYY HH:mm")}</p>
          </div>
        ),
      },
      {
        title: "Ghi chú phát hàng",
        width: 180,
        render: (text, record) => (
          <div className="d-flex" style={{ flexDirection: "column" }}>
            <p style={{ marginBottom: "0em" }}>{record?.delivered_note}</p>
          </div>
        ),
      },
      {
        title: "Lý do phát hàng không thành công",
        width: 150,
        render: (text, record) => (
          <Tag
            color={definitions.getIn([
              "undelivered_reasons",
              `${record["undelivered_reason"]}`,
              "color",
            ])}
          >
            {definitions.getIn([
              "undelivered_reasons",
              `${record["undelivered_reason"]}`,
              "text",
            ])}
          </Tag>
        ),
      },
      {
        title: "",
        width: 60,
        fixed: "right",
        align: "center",
        render: (text, record) => (
          <Button
            size="small"
            type="link"
            onClick={() => {
              _setUuid(record["id"]);
            }}
          >
            <EditTwoTone />
          </Button>
        ),
      },
    ]
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
    return (
      <div className={className}>
        <Row justify="start" gutter={[8, 8]}>
          <Col style={{ marginTop: "10px" }} >
            <div style={{ display: checkId.length > 0 ? false : 'none' }}>
              <span style={{ color: 'rgb(248, 71, 1)' }}>Đã chọn {checkId.length} Đơn hàng</span>
              <Button type="primary" shape="round" style={{ marginLeft: '10px' }} onClick={sendNotify}>
                Send SMS
              </Button>
            </div>
          </Col>
        </Row>
        <DefineTable
          bordered
          columns={columns}
          dataSource={dataBin}
          scroll={{ x: "100%" }}
          rowKey="phat"
          pagination={false}
        />
        {/*<Table
          bordered
          columns={columns}
          dataSource={dataBin}
          scroll={{ x: "100%" }}
          rowKey="code"
          pagination={false}
        />*/}
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
