import { Button, Col, Input, Row, Table, Tag } from "antd";
import "antd/dist/antd.css";
import PropTypes from "prop-types";
import React, { memo, useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import ServiceBase from "utils/ServiceBase";
import { Ui } from "utils/Ui";
import FilterModal from "./FilterModal";
import { API_BASE_URL, BASE_URL } from "utils/constants";
import { useLocation } from "react-router-dom";

import { formatNumber } from "utils/helper";
const { TextArea } = Input;

const convert = function (str) {
    if (str) return str.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    else return "";
};
const Modal = memo(
    ({ className, itemSelected, definitions, setItemSelected, onRefreshList }) => {
        const location = useLocation();
        const [dataServer, setDataServer] = useState([])
        const [loadding, setLoadding] = useState(false);
        const [data, setData] = useState([]);
        const [selectedRow, setSelectedRow] = useState([]);


        const rowSelection = {
            onChange: (selectedRowKeys) => {
                setSelectedRow(selectedRowKeys)
            },
            getCheckboxProps: (record) => ({
                disabled: record.transshipment_item_order.status_accepted !== 'Chưa nhập',
            }),
        };

        const getItem = useCallback(async () => {
            setLoadding(true);
            const result = await ServiceBase.requestJson({
                method: "GET",
                url: `v1/export-transshipment/${itemSelected.id}`,
                data: {},
            });
            if (result.hasErrors) {
                Ui.showErrors(result.errors);
            } else {
                setData(result.value.data.orders)
                setDataServer(result.value.data.orders)
            }
            await setLoadding(false);
        }, [itemSelected]);


        const importOrder = useCallback(async (record) => {
            setLoadding(true);
            const result = await ServiceBase.requestJson({
                method: "POST",
                url: `v1/transshipments/${itemSelected.code}/receiving-accept`,
                data: {
                    order_id: record.id
                }
            });
            if (result.hasErrors) {
                Ui.showErrors(result.errors);
            } else {
                setLoadding(false);
                Ui.showSuccess({ message: "Nhập hàng thành công" });
                await getItem();
                const selectNew = selectedRow.filter(x => x !== record.id)
                setSelectedRow(selectNew)
            }
        }, [itemSelected, selectedRow]);


        const importAllOrder = useCallback(async () => {
            setLoadding(true);
            for (const item of selectedRow) {
                const result = await ServiceBase.requestJson({
                    method: "POST",
                    url: `v1/transshipments/${itemSelected.code}/receiving-accept`,
                    data: {
                        order_id: item
                    }
                });
                if (result.hasErrors) {
                    Ui.showErrors(result.errors);
                } else {
                    setLoadding(false);
                    Ui.showSuccess({ message: "Nhập hàng thành công" });
                    await getItem();
                }
            }
        }, [selectedRow]);


        useEffect(() => {
            getItem()
        }, [getItem])

        const columns = [
            {
                title: "Mã đơn hàng",
                dataIndex: "code",
                width: 180,
                fixed: "left",
                render: (record) => {
                    return (
                        <div style={{ cursor: 'pointer' }} onClick={() => {
                            window.open(`/tracking/${record}`, "_blank", "", true)
                        }}>
                            <p style={{ marginBottom: "0em" }}> {record}</p>
                        </div>
                    )
                }
            },
            {
                title: "Mô tả hàng",
                dataIndex: "description",
                width: 150,
            },
            {
                title: "Số kiện ",
                dataIndex: "num_of_package",
                key: "num_of_package",
                width: 120,

            },
            {
                title: "VP nhận hàng",
                dataIndex: "source",
                width: 180,
                render: (text, record) => (
                    <div div style={{ marginBottom: "0em" }}> {record.source && record.source.name ? record["source"]["name"] : ""}</div>
                ),

            },
            {
                title: "VP phát hàng",
                dataIndex: "receiver",
                width: 180,
                render: (text, record) => (
                    <div style={{ marginBottom: "0em" }}> {record.destination && record.destination.name ? record["destination"]["name"] : ""}</div>
                ),

            },
            {
                title: "Địa chỉ phát",
                dataIndex: "destination",
                width: 180,
                render: (text, record) => (
                    <div style={{ marginBottom: "0em" }}> {record.receiver && record.receiver.name ? record["receiver"]["address"] : ""}</div>
                ),
            },
            {
                title: "SĐT người nhận",
                dataIndex: "receiver",
                width: 180,
                render: (text, record) => (
                    <div style={{ marginBottom: "0em" }}> {record.receiver && record.receiver.phone ? record["receiver"]["phone"] : ""}</div>
                ),
            },
            {
                title: "Tổng cước phí (sau giảm giá)",
                dataIndex: "total_fee",
                width: 150,
                // render: (text, record) =>
                //     <div style={{ marginBottom: "0em", textAlign: 'right' }}>
                //         {convert((record["order_fee"].paying_side === 2 ? record["order_fee"].amount - record["discount"] : 0)
                //             + (record["d_shipping_fee"].paying_side === 2 ? record["d_shipping_fee"].amount : 0)
                //             + (record["r_shipping_fee"].paying_side === 2 ? record["r_shipping_fee"].amount : 0)
                //             + (record["cod_fee"].paying_side === 2 ? record["cod_fee"].amount : 0)
                //         )}
                //     </div>
                render: (text, record) => {
                    return (
                        <div style={{ marginBottom: "0em", textAlign: 'right' }}>
                            {convert((record["order_fee"].amount - record["discount"])
                                + (record["d_shipping_fee"].amount)
                                + (record["r_shipping_fee"].amount)
                                + (record["cod_fee"].amount)
                            )}
                        </div>
                    )
                }

            },
            {
                title: "Ghi chú nhận hàng",
                dataIndex: "note",
                width: 220,
            },
            {
                title: "Trạng thái đơn hàng",
                dataIndex: "transshipment_item_order",
                width: 180,
                render: (text, record) => (
                    <div style={{ marginBottom: "0em" }}> {record.transshipment_item_order && record.transshipment_item_order.status_accepted ? record["transshipment_item_order"]["status_accepted"] : ""}</div>
                ),
            },
            {
                title: "Thao tác",
                dataIndex: "action",
                align: 'center',
                fixed: "right",
                width: 120,
                render: (text, record, row) => (
                    <div style={{ marginBottom: "0em" }}>
                        {record["transshipment_item_order"]["status_accepted"] === "Chưa nhập" ?
                            < Button

                                size="small"
                                type="link"
                                onClick={() => {
                                    importOrder(record)
                                }}
                            >
                                <Tag style={{ cursor: 'pointer' }} color="#87d068"> Nhập hàng</Tag>
                            </Button> : " "
                        }
                    </div>
                ),
            },
        ];
        return (
            <div className={className}>
                <Col xs={24}>
                    <div className="container" >
                        <div className="page-content">
                            <Row>
                                <Col xs={12} className="title">Danh sách đơn hàng trong bảng kê trung chuyển</Col>

                                <Col xs={12}>
                                    <FilterModal data={data} setData={setData} dataServer={dataServer} />
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={12}>
                                    {
                                        selectedRow.length > 0 ? (
                                            <Button
                                                type="primary"
                                                onClick={importAllOrder}
                                            >Nhập hàng</Button>
                                        ) : null
                                    }
                                </Col>
                            </Row>
                            &nbsp;
                        </div>
                        <div className="content">
                            <Table
                                rowSelection={{
                                    ...rowSelection,
                                }}
                                columns={columns}
                                dataSource={data}
                                rowKey="code"
                                scroll={{ x: "calc(700px + 50%)", y: 400 }}
                                pagination={false}
                                summary={() => (
                                    <Table.Summary.Row>
                                        <Table.Summary.Cell index={0}> </Table.Summary.Cell>
                                        <Table.Summary.Cell index={0}> </Table.Summary.Cell>
                                        <Table.Summary.Cell index={2}> </Table.Summary.Cell>
                                        <Table.Summary.Cell ><div>Tổng kiện: {data.reduce((accum, b) => accum + b.num_of_package, 0)}</div></Table.Summary.Cell>
                                        <Table.Summary.Cell index={0} ><div></div></Table.Summary.Cell>
                                        <Table.Summary.Cell index={0} ><div></div></Table.Summary.Cell>
                                        <Table.Summary.Cell index={0} ><div></div></Table.Summary.Cell>
                                        <Table.Summary.Cell index={0} ><div></div></Table.Summary.Cell>
                                        <Table.Summary.Cell index={3} ><div>Tổng tiền: {formatNumber(data.reduce((accum, record) => accum +
                                            (record["order_fee"].amount - record["discount"])
                                            + (record["d_shipping_fee"].amount)
                                            + (record["r_shipping_fee"].amount)
                                            + (record["cod_fee"].amount)
                                            , 0))}</div></Table.Summary.Cell>
                                        <Table.Summary.Cell></Table.Summary.Cell>
                                        <Table.Summary.Cell></Table.Summary.Cell>
                                        <Table.Summary.Cell></Table.Summary.Cell>
                                        <Table.Summary.Cell></Table.Summary.Cell>
                                    </Table.Summary.Row>
                                )}
                            ></Table>
                        </div>
                    </div>
                </Col>
            </div>
        );
    }
);
Modal.propTypes = {
    className: PropTypes.any,
};
export default styled(Modal)`
.title {
    padding: 8px;
    font-weight: bold;
    font-size: 18px;
}
.ant-table-tbody > tr > td {
    border-bottom: 1px solid #f0f0f0;
  }
  .ant-btn {
    border-color: none;
  }
  .ant-table-cell {
  border-left: 1px solid rgb(130 126 126 / 12%) !important;
  }
  

  .ant-table-thead > tr > th {
    padding: 8px;
  }
  .ant-table-tbody > tr > td {
    padding: 0.5rem;
  }
  .ant-table-pagination.ant-pagination {
    margin: 8px 0;
  }
  .ant-table-filter-trigger-container {
  }
  .ant-table-row-indent + .ant-table-row-expand-icon {
    margin: auto;
  }
  label {
    color: cornflowerblue;
  }
`;
