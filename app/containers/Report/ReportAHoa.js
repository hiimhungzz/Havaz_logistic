import { Pagination, Row, Table, Modal, Tag, Col, Button, Divider } from "antd";
import "antd/dist/antd.css";
import PropTypes from "prop-types";
import React, { memo, useState, useCallback, useEffect } from "react";
import styled from "styled-components";
import ServiceBase from "utils/ServiceBase";
import downloadFile from "components/Utility/downloadFile";
import { createStructuredSelector } from "reselect";
import { Ui } from "utils/Ui";
import { formatNumber } from "utils/helper";
import moment from 'moment'
import { DownloadOutlined } from "@ant-design/icons";
import { connect } from "react-redux";
import { makeSelectDefinitions } from "containers/App/selectors";

const ReportAHoa = memo(({ className, itemSelected, definitions, type, params, setParams, excel }) => {
    const [total, setTotal] = useState(0);
    const [btnloadding, setBtnLoadding] = useState(false);
    const [dataItem, setDataItem] = useState([]);
    const [loaddingItem, setLoading] = useState(false);

    const columns = [
        {
            title: "STT",
            dataIndex: "id",
            width: 80,
            fixed: "left",
            render: (value, row, index) => index + 1,
        },
        {
            title: "Mã đơn hàng",
            dataIndex: "id",
            width: 140,
            fixed: "left",
            render: (record) => {
                return (
                    <div style={{ cursor: 'pointer' }} onClick={() => {
                        window.open(`/tracking/${record}`, "_blank")
                    }}>
                        <p style={{ marginBottom: "0em" }}> {record}</p>
                    </div>
                )
            }
        },
        {
            title: "Ngày nhận",
            dataIndex: "created_at",
            render: (value) => value ? moment(value).format("DD-MM-YYYY") : '',
            width: 120,
        },
        // {
        //     title: "Ngày xe chạy",
        //     dataIndex: "updated_at",
        //     render: (value) => value ? moment(value).format("DD-MM-YYYY") : '',
        //     width: 120,
        // },
        {
            title: "Mã NV nhận",
            dataIndex: "creator",
            width: 120,
            render: (value) => value?.code
        },
        {
            title: "Tên NV nhận",
            dataIndex: "creator",
            width: 160,
            render: (value) => value?.name
        },
        {
            title: "VP nhận",
            dataIndex: "source",
            width: 120,
            render: (value) => value?.name
        },
        {
            title: "Số kiện hàng",
            dataIndex: "num_of_package",
            width: 120,
            render: (value) => <div style={{ textAlign: 'right' }}> {value || 0} </div>
        },
        {
            title: "Mô tả hàng",
            dataIndex: "description",
            width: 200,
        },
        {
            title: "Thành tiền ( Cước VC bến- bến) ",
            dataIndex: "order_fee_final",
            width: 150,
            render: (value) => <div style={{ textAlign: 'right' }}> {formatNumber(value) || 0} </div>
        },
        {
            title: "Cước VC - Thu NG",
            width: 180,
            render: (value) => <div style={{ textAlign: 'right' }}> {formatNumber(CuocVanChuyenThuNguoiGui(value)) || 0} </div>
        },
        {
            title: "Cước VC - Thu NN",
            width: 170,
            render: (value) => <div style={{ textAlign: 'right' }}> {formatNumber(CuocVanChuyenThuNguoiNhan(value)) || 0} </div>
        },
        {
            title: "Cước Ship nhận tận nhà",
            dataIndex: "r_shipping_fee",
            width: 185,
            render: (text, record) => <div style={{ textAlign: 'right', color: record['r_shipping_fee']['paying_side'] === 2 ? "red" : "#1cb75b" }}>
                {formatNumber(record['r_shipping_fee']['amount'] || 0)}
            </div>,
        },
        {
            title: "Cước Ship trả tận nhà",
            dataIndex: "d_shipping_fee",
            width: 185,
            render: (text, record) => <div style={{ textAlign: 'right', color: record['d_shipping_fee']['paying_side'] === 2 ? "red" : "#1cb75b" }}>
                {formatNumber(record['d_shipping_fee']['amount'] || 0)}
            </div>,
        },
        {
            title: "Tiền thu hộ COD",
            dataIndex: "order_cod",
            render: (value) => <div style={{ textAlign: 'right' }}> {formatNumber(value) || 0} </div>,
            width: 150,
        },
        {
            title: "Cước thu hộ COD",
            dataIndex: "cod_fee",
            render: (value) => <div style={{ textAlign: 'right' }}> {formatNumber(value.amount) || 0} </div>,
            width: 150,
        },
        {
            title: "Tổng thu hộ và cước thu hộ ",
            width: 210,
        },
        {
            title: "Xe kết nối lên ( BKS)",
            width: 170,
        },
        {
            title: "Còn lưu kho",
            width: 120,
        },
        {
            title: "Số ngày lưu kho",
            width: 140,
        },
        {
            title: "Trạng thái đơn hàng",
            width: 160,
            dataIndex: "status",
            render: (text, record) => (<Tag
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
            </Tag>)
        },
        {
            title: "Trạng thái vận hành",
            width: 200,
            render: (text, record) => '',
        },
        {
            title: "Ghi chú nhận đơn",
            width: 200,
            render: (text, record) => <div>
                {record["note"]}
            </div>,
        },
        {
            title: "Ghi chú phát hàng",
            dataIndex: "delivered_note",
            width: 150,
        },
    ];

    const getDetailItem = useCallback(async () => {
        console.log("itemSelected", itemSelected)
        setLoading(true);
        if (type === 'trip') {
            const result = await ServiceBase.requestJson({
                method: "GET",
                url: `v1/shipments/${itemSelected.trip_id}`,
                data: {},
            });
            if (result.hasErrors) {
                Ui.showErrors(result.errors);
            } else {
                setDataItem(result.value.data.orders)
            }
        } else {
            const result = await ServiceBase.requestJson({
                method: "GET",
                url: "v1/report/get-orders",
                data: {
                    actor_id: itemSelected ? itemSelected.actor_id : undefined,
                    scope: type,
                    date: itemSelected && itemSelected.date,
                    hub_id: itemSelected && itemSelected.hub_id,
                },
            });
            if (result.hasErrors) {
                Ui.showErrors(result.errors);
            } else {
                setDataItem(result.value.data)
            }
        }
        await setLoading(false);

    }, [itemSelected, type]);

    useEffect(() => {
        getDetailItem();
    }, [getDetailItem]);



    const CuocVanChuyenThuNguoiGui = (DataItem) => {
        let final_fee = 0,
            discount = 0;
        if (DataItem['discount'])
            discount = DataItem['discount'] || 0

        if (DataItem['order_fee'] && DataItem['order_fee']['amount'] && DataItem['order_fee']['paying_side'] && DataItem['order_fee']['paying_side'] === 1 && DataItem['order_fee']['amount'] > 0)
            final_fee += (DataItem['order_fee']['amount'] - discount)
        return final_fee
    }
    const CuocVanChuyenThuNguoiNhan = (objOder) => {
        let final_fee = 0,
            discount = 0;
        if (objOder['discount'])
            discount = objOder['discount'] || 0

        if (objOder['order_fee'] && objOder['order_fee']['amount'] && objOder['order_fee']['paying_side'] && objOder['order_fee']['paying_side'] === 2 && objOder['order_fee']['amount'] > 0)
            final_fee += (objOder['order_fee']['amount'] - discount)


        return final_fee
    }


    const exportExcel = useCallback(async () => {
        setBtnLoadding(false);
        setTimeout(() => {
            setBtnLoadding(false);
        }, 3000);
        const result = await ServiceBase.requestJson({
            method: "EXPORT",
            url: "v1/report/general",
            data: {
                day_from: moment(params.from_date).format("YYYY-MM-DD"),
                day_to: moment(params.to_date).format("YYYY-MM-DD"),
                scope: 'excel',
            }
        });
        if (result.hasErrors) {
            Ui.showErrors(result.errors);
        } else {
            const url = window.URL.createObjectURL(new Blob([result.value]));
            downloadFile(url, `Báo cáo theo chi tiết.xlsx`)
        }
        await setLoading(false);
    }, [params]);

    const renderExportExcel = (excel) => {
        if (excel) {
            return (
                <Row className={className} gutter={[8, 16]} style={{ height: 40 }}>
                    <Col xs={16}>
                    </Col>
                    <Col style={{ marginLeft: "auto", padding: 1 }} >
                        <Button
                            type="primary"
                            icon={<DownloadOutlined />}
                            loading={btnloadding}
                            onClick={e => {
                                exportExcel()
                            }}
                            style={{
                                height: 35,
                            }}
                        >
                            <span>Xuất Excel</span>
                        </Button>
                    </Col>
                </Row>
            )
        }
        else null
    }
    return (
        <div className={className}>
            <div > {renderExportExcel(excel)}</div>
            <Table
                loading={loaddingItem}
                pagination={false}
                columns={columns}
                dataSource={dataItem}
                rowKey="id"
                scroll={{ x: "calc(700px + 50%)" }}
                summary={() => (
                    <Table.Summary.Row>
                        <Table.Summary.Cell index={0}></Table.Summary.Cell>
                        <Table.Summary.Cell index={1}></Table.Summary.Cell>
                        <Table.Summary.Cell index={1}></Table.Summary.Cell>
                        <Table.Summary.Cell index={1}></Table.Summary.Cell>
                        <Table.Summary.Cell index={1}></Table.Summary.Cell>
                        <Table.Summary.Cell index={1}></Table.Summary.Cell>
                        <Table.Summary.Cell index={1}></Table.Summary.Cell>
                        <Table.Summary.Cell index={1}><div style={{ textAlign: 'right' }}>Tổng kiện: {formatNumber(dataItem.reduce((accum, b) => accum + b.num_of_package, 0))}</div></Table.Summary.Cell>
                        <Table.Summary.Cell index={1}></Table.Summary.Cell>
                        <Table.Summary.Cell index={1}></Table.Summary.Cell>
                        <Table.Summary.Cell index={1}></Table.Summary.Cell>
                        <Table.Summary.Cell index={1}></Table.Summary.Cell>
                        <Table.Summary.Cell index={1}></Table.Summary.Cell>
                        <Table.Summary.Cell index={1}></Table.Summary.Cell>
                        <Table.Summary.Cell index={1}></Table.Summary.Cell>
                        <Table.Summary.Cell index={1}></Table.Summary.Cell>
                        <Table.Summary.Cell index={1}></Table.Summary.Cell>
                        {/* Thành tiền */}
                        {/* <Table.Summary.Cell index={1}><div style={{ textAlign: 'right' }}>Tổng: {formatNumber(dataItem.reduce((accum, b) => accum + b.order_fee.amount, 0))}</div></Table.Summary.Cell> */}

                        {/* Đã thu khi nhận */}
                        {/* <Table.Summary.Cell index={1}><div style={{ textAlign: 'right' }}>Tổng: {formatNumber(dataItem.reduce((accum, b) => accum + b.receiver_money, 0))}</div></Table.Summary.Cell> */}

                        {/* Còn phải thu khi phát */}
                        {/* <Table.Summary.Cell index={1}><div style={{ textAlign: 'right' }}>Tổng: {formatNumber(dataItem.reduce((accum, b) => accum + b.num_of_package, 0))}</div></Table.Summary.Cell> */}

                        {/* Cước ship nhận tận nhà */}
                        {/* <Table.Summary.Cell index={1}><div style={{ textAlign: 'right' }}>Tổng: {formatNumber(dataItem.reduce((accum, b) => accum + b.r_shipping_fee.amount, 0))}</div></Table.Summary.Cell> */}

                        {/* Cước Ship trả tận nhà */}
                        {/* <Table.Summary.Cell index={1}><div style={{ textAlign: 'right' }}>Tổng: {formatNumber(dataItem.reduce((accum, b) => accum + b.d_shipping_fee.amount, 0))}</div></Table.Summary.Cell> */}

                        {/* Tiền thu hộ COD */}
                        {/* <Table.Summary.Cell index={1}><div style={{ textAlign: 'right' }}>Tổng: {formatNumber(dataItem.reduce((accum, b) => accum + b.order_cod, 0))}</div></Table.Summary.Cell> */}

                        {/* Cước thu hộ COD */}
                        {/* <Table.Summary.Cell index={1}><div style={{ textAlign: 'right' }}>Tổng: {formatNumber(dataItem.reduce((accum, b) => accum + b.cod_fee.amount, 0))}</div></Table.Summary.Cell> */}

                        {/* Tổng thu hộ và cước thu hộ */}
                        {/* <Table.Summary.Cell index={1}><div style={{ textAlign: 'right' }}>Tổng: {formatNumber(dataItem.reduce((accum, b) => accum + b.num_of_package, 0))}</div></Table.Summary.Cell> */}
                        <Table.Summary.Cell index={1}></Table.Summary.Cell>
                        <Table.Summary.Cell index={1}></Table.Summary.Cell>
                        <Table.Summary.Cell index={1}></Table.Summary.Cell>
                        <Table.Summary.Cell index={1}></Table.Summary.Cell>
                        <Table.Summary.Cell index={1}></Table.Summary.Cell>
                        <Table.Summary.Cell index={1}></Table.Summary.Cell>
                        <Table.Summary.Cell index={0}></Table.Summary.Cell>
                    </Table.Summary.Row>
                )}
            />
        </div>
    );
});

const mapStateToProps = createStructuredSelector({
    definitions: makeSelectDefinitions(),
});
const withConnect = connect(
    mapStateToProps,
    null
);

ReportAHoa.propTypes = {
    className: PropTypes.any,
};
export default styled(withConnect(ReportAHoa))`
.ant-table-thead > tr > th {
    border-top: 1px solid rgb(130 126 126 / 12%) !important;
  }
  .ant-table-cell {
  border-left: 1px solid rgb(130 126 126 / 12%) !important;
  }
  .fix_drawer{
    padding-left : 100px
  }
  .ant-table-summary {
    font-weight: bold;
    text-align: right;
    .ant-table-cell {
        background-color: rgb(242,243,248);
        position: sticky;
        z-index: 10000;
        bottom: 0;
    }
  }

`;
