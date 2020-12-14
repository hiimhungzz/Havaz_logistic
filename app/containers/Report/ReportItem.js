import { Pagination, Row, Table, Modal } from "antd";
import "antd/dist/antd.css";
import PropTypes from "prop-types";
import React, { memo, useState, useCallback, useEffect } from "react";
import styled from "styled-components";
import ServiceBase from "utils/ServiceBase";
import { createStructuredSelector } from "reselect";
import { Ui } from "utils/Ui";
import { formatNumber } from "utils/helper";
import moment from 'moment'
import { connect } from "react-redux";
import { makeSelectDefinitions } from "containers/App/selectors";

const CustomerItem = memo(({ className, itemSelected, params, definitions, type }) => {
    const [total, setTotal] = useState(0);
    const [dataItem, setDataItem] = useState([]);
    const [loaddingItem, setLoading] = useState(false);
    const [paramsItem, setParamsItem] = useState({
        page: 1,
        per_page: 15,
        day_from: params.day_from,
        day_to: params.day_to,
        hub_id: params && params.hub_id,
    });

    const columns = [
        {
            title: "STT",
            dataIndex: "depot",
            width: 80,
            fixed: "left",
            render: (value, row, index) => {
                const stringIndex = `${((paramsItem.page - 1) * paramsItem.per_page + index)}`;
                return (
                    <h5>{paramsItem.page === 1 ? index + 1 : parseInt(stringIndex) + 1}</h5>
                );
            },
        },
        {
            title: "Số phiếu gửi",
            dataIndex: "id",
            width: 120,
            fixed: "left",
        },
        {
            title: "Số tiền",
            dataIndex: "price",
            render: (value) => <div style={{ textAlign: 'right' }}> {formatNumber(value)} </div>,
            width: 100,
        },
        {
            title: "Hình thức thanh toán",
            dataIndex: "payment_type",
            render: (text) => (
                <div>{definitions.getIn(["payment_types", `${text}`, "text"])}</div>
            ),
            width: 150,
        },
        {
            title: "Điểm kết nối nhận",
            dataIndex: "source_name",
            width: 150,
        },
        {
            title: "Mã NV nhận",
            dataIndex: "staff_code",
            width: 150,
        },
        {
            title: "Tên NV nhận",
            dataIndex: "staff_name",
            width: 180,
        },
        {
            title: "Tên tuyến xe",
            dataIndex: "route_name",
            width: 180,
        },
        {
            title: "Ngày gửi hàng",
            dataIndex: "created_at",
            render: (value) => moment(value).format("DD-MM-YYYY"),
            width: 120,
        },
        {
            title: "Họ tên người gửi",
            dataIndex: "sender_name",
            width: 150,
        },
        {
            title: "SĐT người gửi",
            dataIndex: "sender_phone",
            width: 120,
        },
        {
            title: "Họ tên người nhận",
            dataIndex: "receiver_name",
            width: 150,
        },
        {
            title: "SĐT người nhận",
            dataIndex: "receiver_phone",
            width: 120,
        },
        {
            title: "Mô tả hàng",
            dataIndex: "note",
            width: 200,
        },
        {
            title: "Tiền thu hộ",
            dataIndex: "cod",
            render: (value) => <div style={{ textAlign: 'right' }}> {formatNumber(value)} </div>,
            width: 120,
        },
        {
            title: "Phí thu hộ",
            dataIndex: "cod_fee",
            render: (value) => <div style={{ textAlign: 'right' }}> {formatNumber(value)} </div>,
            width: 120,
        },
    ];

    const renderContent = () => {
        return (
            <Row justify="end" style={{ marginBottom: 5, marginTop: 5 }}>
                <Pagination
                    onShowSizeChange={(current, size) => {
                        setParamsItem((prevState) => {
                            let nextState = { ...prevState };
                            nextState.page = 1;
                            nextState.per_page = size;
                            return nextState;
                        });
                    }}
                    onChange={(page, pageSize) => {
                        setParamsItem((prevState) => {
                            let nextState = { ...prevState };
                            nextState.page = page;
                            return nextState;
                        });
                    }}
                    total={total}
                    current={paramsItem.page}
                    pageSize={paramsItem.per_page}
                    showSizeChanger={paramsItem.per_page}
                />
            </Row>
        );
    };

    const getDetailItem = useCallback(async () => {
        setLoading(true);
        if (itemSelected && type === 'customer') {
            const result = await ServiceBase.requestJson({
                method: "GET",
                url: "v1/report/customer-detail",
                data: {
                    ...paramsItem,
                    customer_id: itemSelected && itemSelected.customer_id,
                    source_id: itemSelected && itemSelected.source_id,
                    day_from: moment(paramsItem.day_from).format("YYYY-MM-DD"),
                    day_to: moment(paramsItem.day_to).format("YYYY-MM-DD"),
                    hub_id: params.hub_id,
                },
            });
            if (result.hasErrors) {
                Ui.showErrors(result.errors);
            } else {
                setDataItem(result.value.data.dataDetail)
                setTotal(result.value.data.meta.total)
            }
            await setLoading(false);
        }
        if (itemSelected && type === 'staff') {
            const result = await ServiceBase.requestJson({
                method: "GET",
                url: "v1/report/staff-receiver-detail",
                data: {
                    ...paramsItem,
                    staff_id: itemSelected && itemSelected.created_by,
                    source_id: itemSelected && itemSelected.source_id,
                    day_from: moment(paramsItem.day_from).format("YYYY-MM-DD"),
                    day_to: moment(paramsItem.day_to).format("YYYY-MM-DD"),
                    hub_id: params.hub_id,
                },
            });
            if (result.hasErrors) {
                Ui.showErrors(result.errors);
            } else {
                setDataItem(result.value.data.dataDetail)
                setTotal(result.value.data.meta.total)
            }
            await setLoading(false);
        }

    }, [itemSelected, paramsItem, params, type]);

    useEffect(() => {
        getDetailItem();
    }, [getDetailItem]);

    return (
        <div className={className}>
            {renderContent()}
            <Table
                loading={loaddingItem}
                pagination={false}
                columns={columns}
                dataSource={dataItem}
                rowKey="id"
                scroll={{ x: "calc(700px + 50%)", y: 400 }}
                summary={() => (
                    <Table.Summary.Row>
                        <Table.Summary.Cell index={0}>Tổng </Table.Summary.Cell>
                        <Table.Summary.Cell index={1}></Table.Summary.Cell>
                        <Table.Summary.Cell index={1}><div style={{ textAlign: 'right' }}>{formatNumber(dataItem.reduce((accum, b) => accum + b.price, 0))}</div></Table.Summary.Cell>
                        <Table.Summary.Cell index={1}></Table.Summary.Cell>
                        <Table.Summary.Cell index={1}></Table.Summary.Cell>
                        <Table.Summary.Cell index={1}></Table.Summary.Cell>
                        <Table.Summary.Cell index={1}></Table.Summary.Cell>
                        <Table.Summary.Cell index={1}></Table.Summary.Cell>
                        <Table.Summary.Cell index={1}></Table.Summary.Cell>
                        <Table.Summary.Cell index={1}></Table.Summary.Cell>
                        <Table.Summary.Cell index={1}></Table.Summary.Cell>
                        <Table.Summary.Cell index={1}></Table.Summary.Cell>
                        <Table.Summary.Cell index={1}></Table.Summary.Cell>
                        <Table.Summary.Cell index={1}></Table.Summary.Cell>
                        <Table.Summary.Cell index={1}><div style={{ textAlign: 'right' }}>{formatNumber(dataItem.reduce((accum, b) => accum + b.cod, 0))}</div></Table.Summary.Cell>
                        <Table.Summary.Cell index={1}><div style={{ textAlign: 'right' }}>{formatNumber(dataItem.reduce((accum, b) => accum + b.cod_fee, 0))}</div></Table.Summary.Cell>
                    </Table.Summary.Row>
                )}
            />
            {renderContent()}
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

CustomerItem.propTypes = {
    className: PropTypes.any,
};
export default styled(withConnect(CustomerItem))`
  .ant-table-thead > tr > th {
    padding: 8px;
  }
  .ant-table-tbody > tr > td {
    padding: 0.5rem;
  }
  .ant-table-filter-trigger-container {
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
  .ant-table-cell ant-table-cell-fix-left ant-table-cell-fix-left-last {
    padding: 8px !important;
  }
`;
