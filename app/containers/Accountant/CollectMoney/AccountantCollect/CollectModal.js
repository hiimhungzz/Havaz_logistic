import { Table, Button, Row, Col, Input, Card } from "antd";
import "antd/dist/antd.css";
import PropTypes from "prop-types";
import moment from "moment";
import React, { memo, useState, useCallback } from "react";
import { formatNumber } from "utils/helper";
import styled from "styled-components";
import ServiceBase from "utils/ServiceBase";
import { Ui } from "utils/Ui";
import _ from "lodash";
import { useSelector } from 'react-redux'

const { TextArea } = Input;
const convert = function (str) {
    if (str) return str.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    else return "";
};
const TableContent = memo(
    ({ className, data, itemSelected, SourceOption, params, setShowModal, setItemSelected, definitions, onRefreshList, create, setCreate }) => {
        const App = useSelector(state => state.App.toJS());
        // console.log("App", App);
        const [note, setNote] = useState("");
        const dataNew = data.filter(element => itemSelected.includes(element.id));
        const staff = SourceOption.find((x) => x.id === params.staff_id)
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
            { /// bill_types
                title: "Mã nhân viên",
                dataIndex: "created_by_code",
                key: "created_by_code",
                width: 120,
            },
            {
                title: "Mã đơn hàng",
                dataIndex: "order_id",
                width: 150,
                render: (record) => {
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
                dataIndex: "payment_type",
                width: 150,
                render: (value) => value === 1 ? 'Người gửi hàng thanh toán' : 'Người nhận hàng thanh toán',
            },
            {
                title: "Số tiền NV thu",
                dataIndex: "total_fee",
                width: 150,
                render: (text, record) => <div style={{ marginBottom: "0em", textAlign: 'right' }}>{convert(record["order_fee"] + record["r_shipping_fee"] + record["d_shipping_fee"] + record["cod_fee"] + record["order_cod"]) || 0}</div>

            },
        ];


        let total_fee = _.sumBy(dataNew, (record) => record["order_fee"] + record["r_shipping_fee"] + record["d_shipping_fee"] + record["cod_fee"] + record["order_cod"])

        const onCreate = useCallback(async () => {
            const result = await ServiceBase.requestJson({
                method: 'POST',
                url: 'v1/bill-exportings',
                data: {
                    staff_id: params.staff_id,
                    note: note,
                },
            });
            // console.log("TAOJ THANH result", result)
            if (result.hasErrors) {

            } else {
                let billIds = []; //tạo 1 mảng rỗng, push các item đã chọn vào mảng rồi gửi mảng lên 
                itemSelected.map((item) => (
                    billIds.push({ bill_id: item })
                ))
                // Goi thu tien
                const exporting_id = result.value.exporting_id;
                const result2 = await ServiceBase.requestJson({
                    method: 'POST',
                    url: `v1/bill-exportings/${exporting_id}/add-item`,
                    data: {
                        billIds: billIds,
                    },
                });
                if (result.hasErrors) {

                } else {
                    onRefreshList()
                    setCreate(new Date())
                    Ui.showSuccess({ message: "Tạo bảng thành công" })
                    setShowModal(false)
                    setItemSelected([])
                }
            }
        }, [params, note, create])
        return (
            <div className={className}>
                <Button type="primary" onClick={onCreate} style={{ float: "right" }}>Tạo bảng</Button>
                <Row gutter={[24, 16]}>
                    <Col span={12} >
                        <Row gutter={[16, 16]}>
                            <Col xs={8}>Kế toán lập bảng kê: </Col>
                            <Col xs={12}><h4>{App && App.profile && App.profile.name}</h4></Col>
                        </Row>
                        <Row gutter={[16, 16]}>
                            <Col xs={8}> Thời gian lập:</Col>
                            <Col xs={12}><h4>{moment().format("DD-MM-YYYY HH:mm")}</h4></Col>
                        </Row>
                        <Row gutter={[16, 16]}>
                            <Col xs={8}>Số tiền </Col>
                            <Col xs={12}><h4>{convert(total_fee)} &nbsp;VNĐ</h4></Col>
                        </Row>
                    </Col>
                    <Col span={12}>
                        <h3>Ghi chú</h3>
                        <TextArea rows={2} onChange={(e) => { setNote(e.target.value) }} />
                    </Col>
                </Row>
                <Col>
                    <Table
                        columns={columns}
                        dataSource={dataNew}
                        rowKey="id"
                        pagination={false}
                    />
                </Col>
            </div>
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