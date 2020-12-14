import { Table, Button, Row, Col, Input, Card } from "antd";
import { PrinterTwoTone } from '@ant-design/icons';
import "antd/dist/antd.css";
import PropTypes from "prop-types";
import moment from "moment";
import React, { memo, useState, useCallback, useEffect } from "react";
import { formatNumber } from "utils/helper";
import styled from "styled-components";
import ServiceBase from "utils/ServiceBase";
import { useSelector } from 'react-redux'
import PrintOrder from "./PrintOrder";
import { Ui } from "utils/Ui";
const { TextArea } = Input;

const convert = function (str) {
    if (str) return str.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    else return "";
};
const TableContent = memo(
    ({ className, itemSelected, params, definitions }) => {
        const App = useSelector(state => state.App.toJS());
        const [loadding, setLoading] = useState(false);
        const [_visibleModal, setVisibleModal] = useState({
            isShow: false,
            dataItem: {} //khởi tạo data ban đầu
        });
        const [data, setData] = useState([]);
        const columns = [
            {
                title: "STT",
                dataIndex: "id",
                render: (value, row, index) => {
                    return (
                        <h5>{index + 1}</h5>
                    )
                },
                width: 60,
                fixed: "left",
            },
            {
                title: "Tên nhân viên",
                dataIndex: "created_by_name",
                width: 200,
            },
            {
                title: "Mã nhân viên",
                dataIndex: "submitter",
                key: "submitter",
                width: 120,
                render: value => value && value.code

            },
            {
                title: "Mã đơn hàng",
                dataIndex: "order_id",
                width: 150,
                render: (record) => {
                    console.log("record",);
                    return (
                        <div style={{ cursor: 'pointer' }} onClick={() => {
                            window.open(`tracking/${record}`, "_blank")
                        }}>
                            <p style={{ marginBottom: "0em" }}> {record}</p>
                        </div>
                    )
                }
            },
            {
                title: "Loại khoản thu",
                dataIndex: "type",
                width: 150,
                render: (text) => {
                    return (
                        <div>
                            {definitions.getIn(["bill_payment_type", text + "", "text"])}
                        </div>
                    );
                },
            },
            {
                title: "Số tiền NV thu",
                dataIndex: "sum_price",
                width: 150,
                render: (value, record) => <div style={{ textAlign: 'right' }}> {convert(record["order_fee"] + record["r_shipping_fee"] + record["d_shipping_fee"] + record["cod_fee"] + record["order_cod"]) || 0} </div>,

            },
            {
                title: "Cước VC thu NN",
                dataIndex: "receiver_order_fee",
                width: 150,
                render: (value) => <div style={{ textAlign: 'right' }}> {formatNumber(value)} </div>,
            },
            {
                title: "Cước VC thu NG",
                dataIndex: "sender_order_fee",
                width: 150,
                render: (value) => <div style={{ textAlign: 'right' }}> {formatNumber(value)} </div>,
            },
            {
                title: "Tiền COD",
                dataIndex: "order_cod",
                width: 100,
                render: (value) => <div style={{ textAlign: 'right' }}> {formatNumber(value)} </div>,
                dataIndex: "order_cod"
            },
        ];

        const getItem = useCallback(async () => {
            setLoading(true);
            const result = await ServiceBase.requestJson({
                method: "GET",
                url: `v1/bill-exportings/${itemSelected.id}`,
                data: {},
            });
            if (result.hasErrors) {
                Ui.showErrors(result.errors);
            } else {
                setData(result.value.data.bills)
            }
            await setLoading(false);
        }, [itemSelected]);

        useEffect(() => {
            getItem()
        }, [itemSelected])
        return (
            <div div className={className} >
                <Row gutter={[24, 16]}>
                    <Col span={12} >
                        <Row gutter={[16, 16]}>
                            <Col xs={8}>Người tạo bảng kê: </Col>
                            <Col xs={12}><h4>{itemSelected.creator.name}</h4></Col>
                        </Row>
                        <Row gutter={[16, 16]}>
                            <Col xs={8}> Thời gian lập:</Col>
                            <Col xs={12}><h4>{moment(itemSelected.created_at).format("DD-MM-YYYY HH:mm")}</h4></Col>
                        </Row>
                        <Row gutter={[16, 16]}>
                            <Col xs={8}>Số tiền </Col>
                            <Col xs={12}><h4>{convert(itemSelected.sum_price)} &nbsp;VNĐ</h4></Col>
                        </Row>
                    </Col>
                    <Col span={8}>
                        <span><h4>Ghi chú:</h4></span>
                        <span>{itemSelected.note}</span>
                    </Col>
                    <Col span={4} style={{ textAlign: "right" }}>
                        <PrintOrder definitions={definitions} itemSelected={itemSelected} data={data} />
                    </Col>
                </Row>
                <Table
                    columns={columns}
                    dataSource={data}
                    rowKey="id"
                    scroll={{ x: "calc(700px + 50%)" }}
                    pagination={false}
                    summary={() => (
                        <Table.Summary.Row>
                            <Table.Summary.Cell index={0}>Tổng</Table.Summary.Cell>
                            <Table.Summary.Cell colSpan={4}></Table.Summary.Cell>
                            <Table.Summary.Cell index={1}><div style={{ textAlign: 'right' }}>A điệp</div></Table.Summary.Cell>
                            <Table.Summary.Cell index={1}><div style={{ textAlign: 'right' }}></div></Table.Summary.Cell>
                            <Table.Summary.Cell index={1}><div style={{ textAlign: 'right' }}></div></Table.Summary.Cell>
                            <Table.Summary.Cell index={1}><div style={{ textAlign: 'right' }}></div></Table.Summary.Cell>
                        </Table.Summary.Row>
                    )}
                ></Table>
            </div >
        );
    }
);
TableContent.propTypes = {
    className: PropTypes.any,
};
export default styled(TableContent)`
  .ant-table-wrapper {
    border: 1px solid rgba(0, 0, 0, 0.12) !important;
  }
  .ant-table-thead > tr > th,
  .ant-table-tbody > tr > td,
  .ant-table tfoot > tr > th,
  .ant-table tfoot > tr > td {
    position: relative;
    padding: 5px 16px !important ;
    overflow-wrap: break-word;
  }
  .ant-table-thead > tr > th {
    background: rgb(242, 243, 248);
    padding: 16px;

    font-family: "Roboto", "Helvetica", "Arial", sans-serif;
    line-height: 1.43;
    border-bottom: 1px solid rgba(224, 224, 224, 1);
    letter-spacing: 0.01071em;
  }
  .ant-table-tbody > tr > td {
    border-bottom: 1px solid #f0f0f0;
  }
  .ant-btn {
    border-color: none;
  }
  .ant-table-thead > tr > th {
    border-top: 1px solid rgb(130 126 126 / 12%) !important;
  }
  .ant-table-cell {
  border-left: 1px solid rgb(130 126 126 / 12%) !important;
  }
  .fix_drawer{
    padding-left : 100px
  }
  .ant-row.ant-row-start {
    margin: 0px 0px !important;
}
.ant-card-head-title {
    padding-top: 8px;
    padding-bottom: 8px;
}
.ant-card-body {
    15px
}
.ant-row {
    margin-bottom: 0px !important;
}
.ant-card-head {
    min-height: 35px;
    padding-left: 15px
}
`;
