import { Table, Tag } from "antd";
import "antd/dist/antd.css";
import PropTypes from "prop-types";
import moment from "moment";
import React, { memo, useState } from "react";
import { formatNumber } from "utils/helper";
import styled from "styled-components";
const convert = function (str) {
    if (str) return str.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    else return "";
};
const TableContent = memo(
    ({ className, data, itemSelected, setItemSelected, definitions }) => {

        const columns = [
            {
                title: "Ngày nhận hàng",
                width: 130,
                dataIndex: "code",
                fixed: "left",
                render: (text, record) => (<></>
                )
            },
            {
                title: "Số phiếu gửi",
                width: 130,
                dataIndex: "code",
                fixed: "left",
                render: (text, record) => (<></>
                )
            },
            {
                title: "Tổng cước phí",
                width: 130,
                dataIndex: "code",
                render: (text, record) => (<></>
                )
            },
            {
                title: "VP nhận hàng",
                width: 130,
                dataIndex: "code",
                render: (text, record) => (<></>
                )
            },
            {
                title: "VP nhận thu",
                width: 130,
                dataIndex: "code",
                render: (text, record) => (<></>
                )
            },
            {
                title: "VP trả hàng",
                width: 130,
                dataIndex: "code",
                render: (text, record) => (<></>
                )
            },
            {
                title: "VP trả hàng treo",
                width: 130,
                dataIndex: "code",
                render: (text, record) => (<></>
                )
            },
            {
                title: "Đã thu theo xe",
                width: 130,
                dataIndex: "code",
                render: (text, record) => (<></>
                )
            },
            {
                title: "TT cuối tháng",
                width: 130,
                dataIndex: "code",
                render: (text, record) => (<></>
                )
            },
            {
                title: "Số tiền thu hộ",
                width: 130,
                dataIndex: "code",
                render: (text, record) => (<></>
                )
            },
            {
                title: "Dư cuối",
                width: 130,
                dataIndex: "code",
                fixed: "right",
                render: (text, record) => (<></>
                )
            }
        ];

        return (
            <div className={className}>
                <Table
                    columns={columns}
                    dataSource={data}
                    rowKey="id"
                    scroll={{ x: "calc(700px + 50%)" }}
                    pagination={false}
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
`;