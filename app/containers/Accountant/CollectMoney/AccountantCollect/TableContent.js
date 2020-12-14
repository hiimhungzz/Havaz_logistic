import { Table, Tag } from "antd";
import "antd/dist/antd.css";
import PropTypes from "prop-types";
import moment from "moment";
import React, { memo, useState } from "react";
import { formatNumber } from "utils/helper";
import styled from "styled-components";
import _ from "lodash";
import { Ui } from "utils/Ui";

const convert = function (str) {
    if (str) return str.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    else return "";
};

const colorColumn = (payment_type, paying_status) => {
    if (payment_type === 1) {
        if (paying_status === 1) return '#14e055'
        if (paying_status === 0) return '#e01b14'
    }
    if (payment_type === 2) {
        if (paying_status === 0) return '#14e055'
        if (paying_status === 1) return '#e01b14'
    }
    return '#14e055'
}


const colorColumnCuocCOD = (payment_type, paying_status) => {
    if (payment_type === 1) {
        if (paying_status === 1) return '#000'
        if (paying_status === 0) return '#e01b14'
    }
    if (payment_type === 2) {
        if (paying_status === 0) return '#000'
        if (paying_status === 1) return '#e01b14'
    }
    return '#000'
}

// const renderSumCuocVCNG = (data) => {
//     console.log("data tinh tong cuoc", data);
//     let SumCuocVCNG = 0;
//     SumCuocVCNG = data.reduce((accum, b) => {
//         console.log("1b paymentype", b.payment_type)
//         console.log("2b.paying_status", b?.json_order_fee.paying_status)
//         console.log("Đây là tổng cần tính", accum + b?.json_order_fee.amount)
//         if (b.payment_type === 1) {
//             if (b?.json_order_fee.paying_status === 1) {
//                 return accum + b?.json_order_fee.amount
//             } else return 0
//         } else return 0

//     }, 0);
//     return formatNumber(SumCuocVCNG);
// }
const TableContent = memo(
    ({ className, data, itemSelected, setItemSelected, definitions, aggregate }) => {
        const [dataTable, setDataTable] = useState(data)
        // const onCheckBill = {
        //     onSelectAll: (selected, selectedRows, changeRows) => {
        //         let itemSelected = [];
        //         selectedRows.map(function (item) {
        //             if (item.status !== 3) {
        //                 itemSelected.push(item['id'])
        //             }
        //         });
        //         setItemSelected(selected ? itemSelected : [])
        //     },
        //     onSelect: (record, selected, selectedRows) => {
        // if (record.status !== 3) {
        //     const itemSelected = selectedRows.map(function (item) {
        //         return item['id'];
        //     });
        //     setItemSelected(itemSelected)
        // } else {
        //     Ui.showWarning({ message: "Đơn hàng đã thu vui lòng không thao tác" })
        // }
        //     }

        // };
        const columns = [
            {
                title: "STT",
                dataIndex: "id",
                render: (value, row, index) => {
                    return (
                        <h5>{index + 1}</h5>
                    )
                },
                width: 80,
                fixed: "left",
            },
            {
                title: "Thời gian thu tiền",
                dataIndex: "create_at",
                render: (text, record) => (
                    <div>{moment(record["create_at"]).format("DD-MM-YYYY HH:mm")}</div>
                ),
                width: 150,
                fixed: "left",
            },
            { /// bill_types
                title: "Người nộp tiền",
                dataIndex: "type",
                render: (text) => {
                    return (
                        <div style={{ textAlign: "center" }}>
                            {definitions.getIn(["bill_types", text + "", "text"])}
                        </div>
                    );
                },
                width: 180,
            },
            {
                // bill_statuses
                title: "Trạng thái nghiệm thu tiền",
                dataIndex: "status",
                render: (text) => {
                    return (
                        <div style={{ textAlign: "center" }}>
                            {definitions.getIn(["bill_statuses", text + "", "text"])}
                        </div>
                    );
                },
                width: 210,
            },
            {
                title: "Tên nhân viên",
                dataIndex: "created_by_name",
                width: 200,
            },
            {
                title: "Mã nhân viên",
                dataIndex: "created_by_code",
                width: 150,
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
                title: () => {
                    return (
                        <div className="header-nav">
                            <p className="ant_header">Cước vận chuyển</p>
                        </div>
                    );
                },
                dataIndex: "json_order_fee",
                width: 150,
                render: (value, row) =>
                    <div style={{
                        color: colorColumn(row.payment_type, value.paying_status),
                        textAlign: 'right'
                    }}> {formatNumber(value.amount)} </div>,
            },
            {
                title: () => {
                    return (
                        <div className="header-nav">
                            <p className="ant_header">Cước ship trả</p>
                        </div>
                    );
                },
                dataIndex: "json_d_shipping_fee",
                width: 150,
                render: (value, row) =>
                    <div style={{
                        color: colorColumn(row.payment_type, value.paying_status),
                        textAlign: 'right'
                    }}> {formatNumber(value.amount)} </div>,
            },
            {
                title: () => {
                    return (
                        <div className="header-nav">
                            <p className="ant_header">Cước ship nhận</p>
                        </div>
                    );
                },
                dataIndex: "json_r_shipping_fee",
                width: 150,
                render: (value, row) =>
                    <div style={{
                        color: colorColumn(row.payment_type, value.paying_status),
                        textAlign: 'right'
                    }}> {formatNumber(value.amount)} </div>,
            },
            {
                title: () => {
                    return (
                        <div className="header-nav">
                            <p className="ant_header">Cước COD</p>
                        </div>
                    );
                },
                dataIndex: "json_cod_fee",
                width: 150,
                render: (value, row) =>
                    <div style={{
                        color: colorColumnCuocCOD(row.payment_type, value.paying_status),
                        textAlign: 'right'
                    }}> {formatNumber(value.amount)} </div>,
            },
            {
                title: () => {
                    return (
                        <div className="header-nav">
                            <p className="ant_header">Tiền COD</p>
                        </div>
                    );
                },
                dataIndex: "json_order_cod",
                width: 150,
                render: (value, row) =>
                    <div style={{
                        color: colorColumn(row.payment_type, value.paying_status),
                        textAlign: 'right'
                    }}> {formatNumber(value.amount)} </div>,
            },
            {
                title: () => {
                    return (
                        <div className="header-nav">
                            <p className="ant_header">Tổng cước</p>
                        </div>
                    );
                },
                dataIndex: "sum_fee",
                width: 150,
                render: (value) => <div style={{ textAlign: 'right' }}> {formatNumber(value)} </div>,
            },
            {
                title: () => {
                    return (
                        <div className="header-nav">
                            <p className="ant_header">Cước đã thu NG</p>
                        </div>
                    );
                },
                dataIndex: "r_payment",
                width: 150,
                render: (value) => <div style={{ textAlign: 'right' }}> {formatNumber(value)} </div>,
            },
            {
                title: () => {
                    return (
                        <div className="header-nav">
                            <p className="ant_header">Cước đã thu NN</p>
                        </div>
                    );
                },
                dataIndex: "d_payment",
                width: 150,
                render: (value) => <div style={{ textAlign: 'right' }}> {formatNumber(value)} </div>,
            },
            {
                title: () => {
                    return (
                        <div className="header-nav">
                            <p className="ant_header">Cước VC thu NG</p>
                        </div>
                    );
                },
                dataIndex: "sender_order_fee",
                width: 150,
                render: (value) => <div style={{ textAlign: 'right' }}> {formatNumber(value)} </div>,
            },
            {
                title: () => {
                    return (
                        <div className="header-nav">
                            <p className="ant_header">Cước VC thu NN</p>
                        </div>
                    );
                },
                dataIndex: "receiver_order_fee",
                width: 150,
                render: (value) => <div style={{ textAlign: 'right' }}> {formatNumber(value)} </div>,
            },
            {
                title: () => {
                    return (
                        <div className="header-nav">
                            <p className="ant_header">Kế toán thu tiền NV nhận hàng</p>
                        </div>
                    );
                },
                dataIndex: "r_payment",
                width: 150,
                render: (value) => <div style={{ textAlign: 'right' }}> {formatNumber(value)} </div>,
            },
            {
                title: () => {
                    return (
                        <div className="header-nav">
                            <p className="ant_header">Kế toán thu tiền NV phát hàng</p>
                        </div>
                    );
                },
                width: 150,
                render: (text, record) => <div style={{ marginBottom: "0em", textAlign: 'right' }}>
                    {convert(record["d_payment"] + record["json_order_cod"].amount) || 0}
                </div>
            },
            {
                title: "Loại khoản thu",
                dataIndex: "payment_type",
                width: 150,
                render: (value) => value === 1 ? 'Người gửi hàng thanh toán' : 'Người nhận hàng thanh toán',
            },
            {
                title: "Ghi chú phát hàng",
                dataIndex: "orders",
                width: 150,
                render: (value) => value?.delivered_note,
            },
            {
                dataIndex: "Số tiền NV thu",
                title: () => {
                    const total = _.sumBy(data, (x) => x.order_fee + x.r_shipping_fee + x.d_shipping_fee + x.cod_fee + x.order_cod)
                    return (
                        <div className="header-nav">
                            <p className="ant_header">Số tiền NV thu</p>
                        </div>
                    );
                },
                dataIndex: "remaining_fee",
                width: 150,
                render: (value) => <div style={{ textAlign: 'right' }}> {formatNumber(value)} </div>,
            },

        ];

        const _handleSelectAll = async (selected, selectedRows, changeRows) => {
            if (!selected) {
                setItemSelected([])
            } else {
                const arrayAction = data.filter(x => x.status !== 3)
                if (arrayAction.length === itemSelected.length) { // Trường hợp click vào xóa tất cả khi chưa full item
                    setItemSelected([])
                } else {
                    let selectKeyNew = [];
                    await selectedRows.map((item) => {
                        if (item.status !== 3) {
                            selectKeyNew.push(item.id)
                        }
                    })
                    await setItemSelected(selectKeyNew);
                }
            }
        }

        const _handleSelect = (record, status) => {
            if (record.status !== 3) {
                if (status && record.status !== 3 && !itemSelected.includes(record.id)) {
                    const selectKeyNew = [...itemSelected]
                    selectKeyNew.push(record.id)
                    setItemSelected(selectKeyNew)
                } else if (!status) {
                    const selectKeyNew = [...itemSelected]
                    const index = selectKeyNew.indexOf(record.id);
                    selectKeyNew.splice(index, 1);
                    setItemSelected(selectKeyNew)
                }
            } else {
                Ui.showWarning({ message: "Đơn hàng đã thu vui lòng không thao tác" })
            }

        };
        return (
            <div className={className} >
                <Table
                    rowSelection={{
                        selectedRowKeys: itemSelected,
                        onSelect: _handleSelect,
                        onSelectAll: _handleSelectAll,
                    }}
                    columns={columns}
                    dataSource={data}
                    rowKey="id"
                    pagination={false}
                    scroll={{ x: "calc(700px + 50%)", y: 400 }}
                    summary={() => (
                        <Table.Summary.Row fixed>
                            <Table.Summary.Cell fixed></Table.Summary.Cell>
                            <Table.Summary.Cell fixed>Tổng</Table.Summary.Cell>
                            <Table.Summary.Cell fixed> </Table.Summary.Cell>
                            <Table.Summary.Cell></Table.Summary.Cell>
                            <Table.Summary.Cell></Table.Summary.Cell>
                            <Table.Summary.Cell></Table.Summary.Cell>
                            <Table.Summary.Cell></Table.Summary.Cell>
                            <Table.Summary.Cell></Table.Summary.Cell>
                            {/* Cước vận chuyển */}
                            <Table.Summary.Cell><div>{formatNumber(aggregate?.order_fee)} </div></Table.Summary.Cell>
                            {/* Cước ship trả */}
                            <Table.Summary.Cell><div>{formatNumber(aggregate?.d_shipping_fee)} </div></Table.Summary.Cell>
                            {/* Cước ship nhận */}
                            <Table.Summary.Cell><div>{formatNumber(aggregate?.r_shipping_fee)} </div></Table.Summary.Cell>
                            {/* Cước COD */}
                            <Table.Summary.Cell><div>{formatNumber(aggregate?.cod_fee)} </div></Table.Summary.Cell>
                            {/* Tiền COD */}
                            <Table.Summary.Cell><div>{formatNumber(aggregate?.order_cod)} </div></Table.Summary.Cell>
                            {/* Tổng cước */}
                            <Table.Summary.Cell><div>{formatNumber(aggregate?.sum_fee)} </div></Table.Summary.Cell>
                            {/* Cước đã thu NG */}
                            <Table.Summary.Cell><div>{formatNumber(aggregate?.r_payment)}</div></Table.Summary.Cell>
                            {/* Cước đã thu NN */}
                            <Table.Summary.Cell><div>{formatNumber(aggregate?.d_payment)}</div></Table.Summary.Cell>

                            {/* Cước VC thu NG */}
                            <Table.Summary.Cell><div>{formatNumber(aggregate?.sender_order_fee)}</div></Table.Summary.Cell>
                            {/* Cước VC thu NN */}
                            <Table.Summary.Cell><div>{formatNumber(aggregate?.receiver_order_fee)}</div></Table.Summary.Cell>
                            {/* Kế toán thu tiền NV nhận hàng */}
                            <Table.Summary.Cell><div>{formatNumber(aggregate?.r_payment)}</div></Table.Summary.Cell>
                            {/* Kế toán thu tiền NV phát hàng */}
                            <Table.Summary.Cell><div>{formatNumber(aggregate?.accountant_staff_delivery)}</div></Table.Summary.Cell>
                            <Table.Summary.Cell></Table.Summary.Cell>
                            <Table.Summary.Cell></Table.Summary.Cell>
                            {/* Số tiền NV thu */}
                            <Table.Summary.Cell><div>{formatNumber(aggregate?.remaining_fee)}</div></Table.Summary.Cell>
                        </Table.Summary.Row>
                    )}
                />
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

