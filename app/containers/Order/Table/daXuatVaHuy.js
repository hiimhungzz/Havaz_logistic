import { DeleteTwoTone, EditTwoTone, PrinterOutlined } from "@ant-design/icons";
import { Button, Col, Dropdown, Form, Menu, Modal, Row, Table, Tag, Space } from "antd";
import { DefinePagination, DefineTextArea, DefineTable } from "components";
import { makeSelectDefinitions } from "containers/App/selectors";
import moment from "moment";
import PropTypes from "prop-types";
import React, { memo, useCallback, useState } from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import styled from "styled-components";
import ServiceBase from "utils/ServiceBase";
import { Ui } from "utils/Ui";
import Print from "../PrintBeta";
import PrintBill from "../PrintBill";
import PrintItem from "../PrintItem";
import PrintA6Beta from "../PrintA6Beta";
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
/*
 * table đơn hàng
 *
 */
const tableOrder = memo(

  ({
    dataBin,
    setUuid,
    onLoad,
    definitions,
    className,
    setParams,
    total,
    record,
    _visibleModal,
    setVisibleModal
  }) => {

    const _setUuid = useCallback(
      (uuid) => {
        setUuid(uuid);
      },
      [setUuid]
    );
    const [form] = Form.useForm();

    let columns = [
      {
        title: "Mã bảng kê",
        width: 130,
        fixed: "left",
        render: (text, record) => (
          <div className="d-flex" style={{ flexDirection: "column" }}>
            <p style={{ marginBottom: "0em" }}> {record["exported"]['exporting_id']}</p>
          </div>
        )
      },
      {
        title: "Mã đơn",
        width: 130,
        dataIndex: "code",
        fixed: "left",
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
        title: "Địa chỉ nhận",
        width: 150,
        fixed: "left",
        render: (text, record) => (
          <div className="d-flex" style={{ flexDirection: "column" }}>
            <h5 style={{ marginBottom: "0em" }}> {record["destination"]["name"]}</h5>
            <p style={{ marginBottom: "0em" }}> {record["receiver"]["address"]}</p>
          </div>
        ),
      },
      {
        title: "Người nhận",
        width: 120,
        fixed: "left",
        render: (text, record) => (
          <div className="d-flex" style={{ flexDirection: "column" }}>
            <h5 style={{ marginBottom: "0em" }}> {record["receiver"]["name"] === record["receiver"]["phone"] ? "" : record["receiver"]["name"]}</h5>
            <em style={{ marginBottom: "0em" }}> {record["receiver"]["phone"]}</em>
          </div>
        ),
      },
      {
        title: "VP nhận hàng",
        width: 150,
        fixed: "left",
        render: (text, record) => (
          <div className="d-flex" style={{ flexDirection: "column" }}>
            <h5 style={{ marginBottom: "0em" }}> {record["source"]["name"]}</h5>
            <p style={{ marginBottom: "0em" }}> {record["sender"]["address"]}</p>
          </div>
        ),
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
        title: "Số kiện",
        width: 70,
        dataIndex: "num_of_package",
        key: "num_of_package",
      },
      {
        title: "COD",
        width: 100,
        render: (text, record) => <div>{convert(record["order_cod"])}</div>,
      },
      {
        title: "Cước phí",
        width: 190,
        render: (text, record) => (
          <div className="d-flex" style={{ flexDirection: "column" }}>
            <h5 style={{ marginBottom: "0em" }}>{convert(finalFee(record))}</h5>
            {/* <em style={{ marginBottom: "0em" }}>{definitions.getIn([
              "payment_types",
              `${record['order_fee']['paying_side']}`,
              "text",
            ])}</em> */}
          </div>
        )
      },
      {
        title: "Người tạo",
        width: 150,
        render: (text, record) => (
          <div className="d-flex" style={{ flexDirection: "column" }}>
            <p style={{ marginBottom: "0em" }}>{record["creator"]["name"]}</p>
            <p style={{ marginBottom: "0em" }}>{moment(record["created_at"]).format("DD-MM-YYYY HH:mm")}</p>
          </div>
        ),
      },
      {
        title: "Mô tả hàng",
        width: 100,
        render: (text, record) => <div>{record["description"]}</div>,
      },
      {
        title: "THAO TÁC",
        width: 130,
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
            {/* <Button
              size="small"
              type="link"
              onClick={() => {
                Set_uuidXoaDonHang(record["id"]);
                Set_lyDoXoaDonHang("");
                Set_visibleOrder(true);
              }}
            >
              <DeleteTwoTone />
            </Button> */}
            <Button size="small" type="link" onClick={() => openModal(record)}  >
              <PrinterOutlined />
            </Button>
          </>
        ),
      },
    ];

    // modal
    // const [_visibleModal, setVisibleModal] = useState({
    //   isShow: false,
    //   dataItem: {} //khởi tạo data ban đầu
    // });
    const handleCancel = () => {
      setVisibleModal((preState) => {
        let nextState = { ...preState };
        nextState.isShow = false;
        return nextState
      });
    };
    const openModal = (record) => {
      setVisibleModal((preState) => {
        let nextState = { ...preState };
        nextState.isShow = true;
        nextState.dataItem = record;
        return nextState
      });
    }
    const [_visibleOrder, Set_visibleOrder] = useState(false);
    const [_lyDoXoaDonHang, Set_lyDoXoaDonHang] = useState("");
    const [_uuidXoaDonHang, Set_uuidXoaDonHang] = useState("");
    const modalhandleCancel = () => {
      Set_visibleOrder(false);
    };
    const CancelOrder = useCallback(async (_id) => {
      const values = await form.validateFields()
      if (values.errorFields) {
        return
      }
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
        onLoad()
      }
    }, [_lyDoXoaDonHang]);
    const huyDonHang = () => {
      CancelOrder(_uuidXoaDonHang);
    };
    const changeLydo = useCallback((value) => {
      form.setFieldsValue({
        'lyDoXoaDonHang': value
      })
    })
    return (

      <div className={className}>


        {/* Show Modal chọn máy in */}
        {_visibleModal &&
          <Modal
            width={500}
            title="Chọn loại máy in"
            visible={_visibleModal.isShow}
            onCancel={handleCancel}
            footer={null}
          >
            <Space>
              <Col span={1}>
                <Print dataBin={_visibleModal.dataItem} />
              </Col>
              <Col span={1} >
                <PrintItem dataBin={_visibleModal.dataItem} />
              </Col>
              <Col span={1} >
                <PrintA6Beta dataBin={_visibleModal.dataItem} />
              </Col>
              <Col span={1} >
                <PrintBill dataBin={_visibleModal.dataItem} />
              </Col>
            </Space>

          </Modal >
        }

        {/* End Modal máy in */}




        <Row justify="end" gutter={[8, 8]}>
          <Col style={{ marginTop: "10px" }}>
            <Form form={form}>
              <Modal
                title="Xác nhận hủy đơn hàng"
                visible={_visibleOrder}
                onOk={huyDonHang}
                confirmLoading={""}
                onCancel={modalhandleCancel}
              >
                <Form.Item
                  name="lyDoXoaDonHang"
                  initialValue={_lyDoXoaDonHang}
                  rules={[
                    {
                      required: true,
                      message: 'Hãy nhập lý do',
                    },
                  ]}
                >
                  <DefineTextArea
                    placeholder={"Nhập lý do"}
                    value={_lyDoXoaDonHang}
                    change={(e) => {
                      let { value } = e.target;
                      changeLydo(value)
                      Set_lyDoXoaDonHang(value);
                    }}
                  />
                </Form.Item>
              </Modal>
            </Form>
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
`;
