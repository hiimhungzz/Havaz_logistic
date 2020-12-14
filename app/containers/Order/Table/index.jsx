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
import _ from "lodash";
import PrintA6Beta from "../PrintA6Beta";
import { CuocVanChuyenThuNguoiGui, CuocVanChuyenThuNguoiNhan, finalFee, FormatMoney, TongCuocNguoiNhanTra, TongCuocNguoiGuiTra } from "../constants"

/*
 * table đơn hàng
 *
 */

const showLyDo = (items) => {
  let item = {}
  if(items && items.length >= 0){
    item = items[0]
  }
  return item
}
const tableOrder = memo(

  ({
    dataBin,
    setUuid,
    onLoad,
    definitions,
    className,
    _setParams,
    _params,
    total,
    record,
    _visibleModal,
    setVisibleModal,
    _info,
    scroll_Y
  }) => {
    // const [params, setParams] = useState(TEMP_BODY);
    const _setUuid = useCallback(
      (uuid) => {
        setUuid(uuid);
      },
      [setUuid]
    );
    const [form] = Form.useForm();

    let columns = [
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
        title: "Số kiện",
        width: 70,
        dataIndex: "num_of_package",
        key: "num_of_package",
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
        title: "VP phát hàng",
        width: 150,
        // fixed: "left",
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
        // fixed: "left",
        render: (text, record) => (
          <div className="d-flex" style={{ flexDirection: "column" }}>
            <h5 style={{ marginBottom: "0em" }}> {record["receiver"]["name"] === record["receiver"]["phone"] ? "" : record["receiver"]["name"]}</h5>
            <em style={{ marginBottom: "0em" }}> {record["receiver"]["phone"]}</em>
          </div>
        ),
      },


      {
        title: "Tiền thu hộ COD",
        width: 150,
        render: (text, record) => <div>{FormatMoney(record["order_cod"])}</div>,
      },
      {
        title: "Tổng cước",
        width: 190,
        render: (text, record) => (
          <div className="d-flex" style={{ flexDirection: "column" }}>
            <h5 style={{ marginBottom: "0em" }}>{FormatMoney(finalFee(record))}</h5>
            {/* <em style={{ marginBottom: "0em" }}>{definitions.getIn([
              "payment_types",
              `${record['order_fee']['paying_side']}`,
              "text",
            ])}</em> */}
          </div>
        )
      },
      {
        title: "Cước vận chuyển (bến - bến)",
        width: 130,
        render: (text, record) => <div style={{ color: record['order_fee']['paying_side'] === 2 ? "red" : "#1cb75b" }}>
          {FormatMoney(record['order_fee']['amount'] - record?.discount * 1)}
        </div>,
      },
      // {
      //   title: "Cước VC - thu NN",
      //   width: 150,
      //   render: (text, record) => <div>{FormatMoney(CuocVanChuyenThuNguoiNhan(record))}</div>,
      // },
      // {
      //   title: "Cước VC - thu NG",
      //   width: 150,
      //   render: (text, record) => <div>{FormatMoney(CuocVanChuyenThuNguoiGui(record))}</div>,
      // },
      {
        title: "Cước COD",
        width: 100,
        render: (text, record) => <div style={{ color: record['cod_fee']['paying_side'] === 2 ? "red" : "black" }}>
          {FormatMoney(record['cod_fee']['amount'])}
        </div>,
      },
      {
        title: "Cước ship nhận",
        width: 130,
        render: (text, record) => <div style={{ color: record['r_shipping_fee']['paying_side'] === 2 ? "red" : "#1cb75b" }}>
          {FormatMoney(record['r_shipping_fee']['amount'])}
        </div>,
      },
      {
        title: "Cước ship trả",
        width: 130,
        render: (text, record) => <div style={{ color: record['d_shipping_fee']['paying_side'] === 2 ? "red" : "#1cb75b" }}>
          {FormatMoney(record['d_shipping_fee']['amount'])}
        </div>,
      },
      {
        title: "Đã thu NG hàng",
        width: 150,
        render: (text, record) => <div style={{ color: "#1cb75b" }}>
          {FormatMoney(TongCuocNguoiGuiTra(record))}
        </div>,
      },
      {
        title: "Cước VC - thu NG",
        width: 150,
        render: (text, record) => <div>{FormatMoney(CuocVanChuyenThuNguoiGui(record))}</div>,
      },
      {
        title: "Phải thu NN",
        width: 100,
        render: (text, record) => <div style={{ color: "red" }}>
          {FormatMoney(TongCuocNguoiNhanTra(record))}
        </div>,
      },
      {
        title: "Cước VC - thu NN",
        width: 150,
        render: (text, record) => <div>{FormatMoney(CuocVanChuyenThuNguoiNhan(record))}</div>,
      },
      {
        title: "Mô tả hàng",
        width: 200,
        render: (text, record) => <div>
          {record["description"]}
        </div>,
      },
      {
        title: "Ghi chú nhận đơn",
        width: 200,
        render: (text, record) => <div>
          {record["note"]}
        </div>,
      },
      {
        title: "Người sửa cuối",
        width: 140,
        render: (text, record) => <div style={{ color: record['cod_fee']['paying_side'] === 2 ? "red" : "#1cb75b" }}>
          {moment(record["updated_at"]).format("DD-MM-YYYY HH:mm")}
        </div>,
      },
      // lý do tồn
      {
        title: "NV cập nhật tồn",
        width: 140,
        render: (text, record) => <div >
          {showLyDo(record?.order_note)?.actor_name}
        </div>,
      },
      {
        title: " Thời gian cập nhật tồn",
        width: 140,
        render: (text, record) => <div>
          { showLyDo(record?.order_note) && moment(showLyDo(record?.order_note)?.created_at).format("DD-MM-YYYY HH:mm")}
        </div>,
      },
      {
        title: "Lý do tồn",
        width: 140,
        render: (text, record) => <div>
          {showLyDo(record?.order_note)?.note}
        </div>,
      },
      {
        title: "Ghi chú tồn",
        width: 140,
        render: (text, record) => <div>
          {definitions.getIn([
            "order_note",
            `${showLyDo(record?.order_note)?.reason_id}`,
            "text",
          ])}
          {/* {showLyDo(record?.order_note)?.reason_id} */}
        </div>,
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
            <Button
              size="small"
              type="link"
              onClick={() => {
                Set_uuidXoaDonHang(record["id"]);
                Set_lyDoXoaDonHang("");
                Set_visibleOrder(true);
              }}
            >
              <DeleteTwoTone />
            </Button>
            <Button size="small" type="link" onClick={() => openModal(record)}  >
              <PrinterOutlined />
            </Button>
          </>
        ),
      },
    ];

    let summary = _info?.count_order > 0 ? (
      <Table.Summary.Row>
        <Table.Summary.Cell ><span style={{ fontWeight: 'bold' }}>Tổng :</span> {_info?.count_order}</Table.Summary.Cell>
        <Table.Summary.Cell >{FormatMoney(_info?.sum_number_package)}</Table.Summary.Cell>
        <Table.Summary.Cell colSpan={5}></Table.Summary.Cell>
        <Table.Summary.Cell >{FormatMoney(_info?.sum_cod)}</Table.Summary.Cell>
        <Table.Summary.Cell >{FormatMoney(_info?.sum_fee)}</Table.Summary.Cell>
        <Table.Summary.Cell >{FormatMoney(_info?.sum_order_fee_final)}</Table.Summary.Cell>


        <Table.Summary.Cell >{FormatMoney(_info?.cod_fee)}</Table.Summary.Cell>
        <Table.Summary.Cell >{FormatMoney(_info?.r_shipping_fee)}</Table.Summary.Cell>
        <Table.Summary.Cell >{FormatMoney(_info?.d_shipping_fee)}</Table.Summary.Cell>
        <Table.Summary.Cell >{FormatMoney(_info?.sender_payment_price)}</Table.Summary.Cell>
        <Table.Summary.Cell >{FormatMoney(_info?.sender_order_fee)}</Table.Summary.Cell>
        <Table.Summary.Cell >{FormatMoney(_info?.receiver_payment_price)}</Table.Summary.Cell>
        <Table.Summary.Cell >{FormatMoney(_info?.receiver_order_fee)}</Table.Summary.Cell>
        <Table.Summary.Cell colSpan={3}></Table.Summary.Cell>
      </Table.Summary.Row>
    ) : ""
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
          summary={summary}
          scroll_Y={scroll_Y}
        />
        <DefinePagination
          total={total}
          onPagination={(page, limit) => {
            _setParams((props) => {
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
  .filter-tab1 {
    margin-top: 20px;
  }
`;
