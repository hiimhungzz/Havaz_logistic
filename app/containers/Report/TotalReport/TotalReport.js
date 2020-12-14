import { DatePicker, Input, Pagination, Row, Table, Select, Tag } from "antd";
import "antd/dist/antd.css";
import moment from "moment";
import PropTypes from "prop-types";
import { DrawerBase, DefineInput, DefineSelect, DefineTextArea, OfficeSelectByType } from "components";
import React, { memo, useCallback } from "react";
import { createStructuredSelector } from "reselect";
import { makeSelectDefinitions } from "containers/App/selectors";
import { formatNumber } from "utils/helper";
import { } from "containers/App/selectors";
import _ from "lodash";
import styled from "styled-components";
import { connect } from "react-redux";
const { RangePicker } = DatePicker;
let inputTimer = null;

const TotalReport = memo(({ className, data, params, total, setParams, definitions, }) => {
  const _changeQuery = useCallback(
    (payload) => {
      if (inputTimer) {
        clearTimeout(inputTimer);
      }
      inputTimer = setTimeout(() => {
        setParams((prevState) => {
          let nextState = { ...prevState };
          nextState[payload.name] = payload.value;
          return nextState;
        });
      }, 500);
    },
    [setParams]
  );
  let { order_statuses } = definitions.toJS()
  // let orderStatus = _.map(order_statuses, (value, k) => {
  //   return value
  // })
  // let { export_statuses } = definitions.toJS()
  // let exportStatus = _.map(export_statuses, (value, k) => {
  //   return value
  // })
  const columns = [
    {
      title: "STT",
      dataIndex: "order_id",
      width: 60,
      render: (value, row, index) => {
        const stringIndex = `${params.page - 1}${index}`;
        return (
          <h5>{params.page === 1 ? index + 1 : parseInt(stringIndex) + 1}</h5>
        );
      },
      fixed: "left",
    },
    {
      title: () => {
        return (
          <div className="header-nav">
            <p className="ant_header">Mã đơn hàng</p>
            <Input placeholder="Mã đơn hàng"
              onChange={(e) => {
                _changeQuery({
                  name: "order_code",
                  value: e.target.value,
                });
              }} />
          </div>
        );
      },
      dataIndex: "order_id",
      key: "order_id",
      width: 150,
      fixed: "left",
    },
    {
      title: "Thông tin hàng hóa",
      children: [

        {
          title: () => {
            return (
              <div className="header-nav-children">
                <p className="ant_header">Ngày tạo</p>

                <RangePicker
                  allowClear={false}
                  value={[moment(params.day_from), moment(params.day_to)]}
                  style={{ width: "100%" }}
                  format={"DD-MM-YYYY"}
                  ranges={{
                    "Hôm nay": [moment(), moment()],
                    "Tuần hiện tại": [
                      moment().startOf("week"),
                      moment().endOf("week"),
                    ],
                    "Tháng hiện tại": [
                      moment().startOf("month"),
                      moment().endOf("month"),
                    ],
                    "Tuần trước": [
                      moment()
                        .add(-1, "weeks")
                        .startOf("week"),
                      moment()
                        .add(-1, "weeks")
                        .endOf("week"),
                    ],
                    "Tháng trước": [
                      moment()
                        .add(-1, "months")
                        .startOf("month"),
                      moment()
                        .add(-1, "months")
                        .endOf("month"),
                    ],
                    "Tuần sau": [
                      moment()
                        .add(1, "weeks")
                        .startOf("week"),
                      moment()
                        .add(1, "weeks")
                        .endOf("week"),
                    ],
                    "Tháng sau": [
                      moment()
                        .add(1, "months")
                        .startOf("month"),
                      moment()
                        .add(1, "months")
                        .endOf("month"),
                    ],
                  }}
                  onChange={(dates) => {
                    setParams((prevState) => {
                      let nextState = { ...prevState };
                      nextState.day_from = dates[0];
                      nextState.day_to = dates[1];
                      return nextState;
                    });
                  }}
                />
              </div>
            );
          },
          // dataIndex: "created_order_at",
          render: (text, record) => (
            <div>{moment(record["created_order_at"]).format("DD-MM-YYYY")}</div>
          ),
          width: 250,

        },
        {
          title: () => {
            return (
              <div className="header-nav-children">
                <p className="ant_header">Số kiện</p>
                <Input placeholder="Số kiện" disabled />
              </div>
            );
          },
          dataIndex: "total_package",
          key: "total_package",
          width: 120,
        },
        {
          title: () => {
            return (
              <div className="header-nav-children">
                <p className="ant_header">VP gửi</p>
                <OfficeSelectByType
                  allowClear={true}
                  placeholder="VP gửi"
                  typeSearch="local"
                  type={1}
                  active={1}
                  onChange={(data) => {
                    _changeQuery({
                      name: "source_id",
                      value: data ? data.value : null,
                    });
                  }}
                />
              </div>
            );
          },
          dataIndex: "departure_name",
          key: "departure_name",
          width: 150,
        },
        {
          title: () => {
            return (
              <div className="header-nav-children">
                <p className="ant_header">VP nhận</p>
                <OfficeSelectByType
                  allowClear={true}
                  placeholder="VP nhận"
                  typeSearch="local"
                  active={1}
                  type={1}
                  onChange={(data) => {
                    _changeQuery({
                      name: "destination_id",

                      value: data ? data.value : null,
                    });
                  }}
                />
              </div>
            );
          },
          dataIndex: "arrival_name",
          key: "arrival_name",
          width: 150,
        },
        {
          title: () => {
            return (
              <div className="header-nav-children">
                <p className="ant_header">Giá cước</p>
                <Input placeholder="Giá cước" disabled />
              </div>
            );
          },
          dataIndex: "goods_fee",
          key: "goods_fee",
          width: 100,

          render: (text) => <div style={{ textAlign: 'right' }}> {formatNumber(text)} </div>
        },

        {
          title: (text) => {
            return (
              <div className="header-nav-children">
                <p className="ant_header">HTTT</p>
                <Input placeholder="HTTT" disabled />
              </div>
            );
          },
          dataIndex: "payment_type",
          key: "payment_type",
          width: 150,
          render: (text) => (
            <div>{definitions.getIn(["payment_types", `${text}`, "text"])}</div>
          ),
        },
      ],
    },
    {
      title: "Thông tin bảng kê xe tuyến",
      children: [
        {
          title: () => {
            return (
              <div className="header-nav-children">
                <p className="ant_header">Mã bảng kê</p>
                <Input placeholder="Mã bảng kê"
                  onChange={(e) => {
                    _changeQuery({
                      name: "export_code",
                      value: e.target.value,
                    });
                  }} />
              </div>
            );
          },
          dataIndex: "export_id",
          key: "export_id",
          width: 120,
        },

        {
          title: () => {
            return (
              <div className="header-nav-children">
                <p className="ant_header">Ngày tạo</p>
                <Input placeholder="Ngày tạo" disabled />
                {/* <RangePicker
                  style={{ width: "100%" }}
                  format={"DD-MM-YYYY"}
                  ranges={{
                    "Hôm nay": [moment(), moment()],
                    "Tuần hiện tại": [
                      moment().startOf("week"),
                      moment().endOf("week"),
                    ],
                    "Tháng hiện tại": [
                      moment().startOf("month"),
                      moment().endOf("month"),
                    ],
                    "Tuần trước": [
                      moment()
                        .add(-1, "weeks")
                        .startOf("week"),
                      moment()
                        .add(-1, "weeks")
                        .endOf("week"),
                    ],
                    "Tháng trước": [
                      moment()
                        .add(-1, "months")
                        .startOf("month"),
                      moment()
                        .add(-1, "months")
                        .endOf("month"),
                    ],
                    "Tuần sau": [
                      moment()
                        .add(1, "weeks")
                        .startOf("week"),
                      moment()
                        .add(1, "weeks")
                        .endOf("week"),
                    ],
                    "Tháng sau": [
                      moment()
                        .add(1, "months")
                        .startOf("month"),
                      moment()
                        .add(1, "months")
                        .endOf("month"),
                    ],
                  }}
                /> */}
              </div>
            );
          },
          dataIndex: "created_export_at",
          render: (text, record) => (
            <div>{record["created_export_at"] ? moment(record["created_export_at"]).format("DD-MM-YYYY") : ""} </div>
          ),

          width: 250,

        },
        {
          title: () => {
            return (
              <div className="header-nav-children">
                <p className="ant_header">Lái xe</p>
                <Input placeholder="Lái xe" disabled />
              </div>
            );
          },
          dataIndex: "driver_name",
          key: "driver_name",
          width: 150,
        },
        {
          title: () => {
            return (
              <div className="header-nav-children">
                <p className="ant_header">SĐT lái xe</p>
                <Input placeholder="Sđt lái xe" disabled />
              </div>
            );
          },
          dataIndex: "driver_phone",
          key: "driver_phone",
          width: 150,
        },
      ],
    },
    {
      title: "Thông tin người gửi",
      children: [
        {
          title: () => {
            return (
              <div className="header-nav-children">
                <p className="ant_header">Người gửi</p>
                <Input placeholder="Người gửi" disabled />
              </div>
            );
          },
          dataIndex: "sender_name",
          key: "sender_name",
          width: 150,
        },
        {
          title: () => {
            return (
              <div className="header-nav-children">
                <p className="ant_header">SĐT người gửi</p>
                <Input placeholder="Sđt người gửi" disabled />
              </div>
            );
          },
          dataIndex: "sender_phone",
          key: "sender_phone",
          width: 150,
        },
      ],
    },
    {
      title: "Thông tin khách hàng nhận ",
      children: [
        {
          title: () => {
            return (
              <div className="header-nav-children">
                <p className="ant_header">Người nhận</p>
                <Input placeholder="Người nhận" disabled />
              </div>
            );
          },
          dataIndex: "receiver_name",
          key: "receiver_name",
          width: 150,
        },
        {
          title: () => {
            return (
              <div className="header-nav-children">
                <p className="ant_header">SĐT</p>
                <Input placeholder="SĐT" disabled />
              </div>
            );
          },
          dataIndex: "receiver_phone",
          key: "receiver_phone",
          width: 150,
        },
      ],
    },
    {
      title: "Nơi xử lý nhận hàng",
      children: [
        {
          title: () => {
            return (
              <div className="header-nav-children">
                <p className="ant_header">VP nhận</p>
                <Input placeholder="VP nhận" disabled />
              </div>
            );
          },
          dataIndex: "hub_source_name",
          key: "hub_source_name",
          width: 150,
        },
        {
          title: () => {
            return (
              <div className="header-nav-children">
                <p className="ant_header">NV tiếp nhận</p>
                <Input placeholder="NV tiếp nhận" disabled />
              </div>
            );
          },
          dataIndex: "staff_receiver_name",
          key: "staff_receiver_name",
          width: 150,
        },
      ],
    },
    {
      title: "Cước ",
      children: [
        {
          title: () => {
            return (
              <div className="header-nav-children">
                <p className="ant_header">Tiền cước</p>
                <Input disabled placeholder="Tiền cước" disabled />
              </div>
            );
          },
          dataIndex: "fee",
          key: "fee",
          width: 100,
          render: (text) => <div style={{ textAlign: 'right' }}> {formatNumber(text)} </div>
        },
        {
          title: () => {
            return (
              <div className="header-nav-children">
                <p className="ant_header">Đã thu</p>
                <Input disabled placeholder="Đã thu" disabled />
              </div>
            );
          },
          dataIndex: "paid",
          key: "paid",
          width: 100,
          render: (text) => <div style={{ textAlign: 'right' }}> {formatNumber(text)} </div>
        },
        {
          title: () => {
            return (
              <div className="header-nav-children">
                <p className="ant_header">Số phải thu</p>
                <Input disabled placeholder="Số phải thu" disabled />
              </div>
            );
          },
          dataIndex: "owe",
          key: "owe",
          width: 120,
          render: (text) => <div style={{ textAlign: 'right' }}> {formatNumber(text)} </div>
        },
        {
          title: () => {
            return (
              <div className="header-nav-children">
                <p className="ant_header">Nơi thu</p>
                <Input placeholder="Nơi thu" disabled />
              </div>
            );
          },
          dataIndex: "owe_of_payment",
          key: "owe_of_payment",
          width: 150,
        },
      ],
    },
    {
      title: "COD ",
      children: [
        {
          title: () => {
            return (
              <div className="header-nav-children">
                <p className="ant_header">Tiền COD</p>
                <Input disabled placeholder="Tiền COD" disabled />
              </div>
            );
          },
          dataIndex: "cod",
          key: "cod",
          width: 120,
          render: (text) => <div style={{ textAlign: 'right' }}> {formatNumber(text)} </div>
        },
        {
          title: () => {
            return (
              <div className="header-nav-children">
                <p className="ant_header">Đã thu</p>
                <Input disabled placeholder="Đã thu" disabled />
              </div>
            );
          },
          dataIndex: "cod_paid",
          key: "cod_paid",
          width: 120,
          render: (text) => <div style={{ textAlign: 'right' }}> {formatNumber(text)} </div>
        },
        {
          title: () => {
            return (
              <div className="header-nav-children">
                <p className="ant_header">Còn phải thu</p>
                <Input disabled placeholder="Còn phải thu" disabled />
              </div>
            );
          },
          dataIndex: "cod_owe",
          key: "cod_owe",
          width: 120,
          render: (text) => <div style={{ textAlign: 'right' }}> {formatNumber(text)} </div>
        },
        {
          title: () => {
            return (
              <div className="header-nav-children">
                <p className="ant_header">Nơi sẽ thu</p>
                <Input disabled placeholder="Nơi sẽ thu" disabled />
              </div>
            );
          },
          dataIndex: "cod_owe_of_payment",
          key: "cod_owe_of_payment",
          width: 150,
          render: (text) => <div style={{ textAlign: 'right' }}> {formatNumber(text)} </div>
        },
      ],
    },

    {
      title: "Trạng thái",
      children: [
        {
          title: () => {
            return (
              <div className="header-nav-children">
                <p className="ant_header">Trạng thái đơn hàng</p>
                <Input placeholder="Trạng thái bảng kê" disabled />
                {/* <DefineSelect
                  placeholder="Chọn trạng thái"

                  onChange={(e) => {
                    _changeQuery(e, 'filterBy[status]')
                  }
                  }
                  dataBin={orderStatus}
                  value={params['filterBy[status]']}
                /> */}
              </div>
            );
          },
          dataIndex: "order_status",

          key: "order_status",
          align: "center",
          width: 180,
          render: (text) => (
            <Tag color={definitions.getIn(["order_statuses", `${text}`, "color"])}>{definitions.getIn(["order_statuses", `${text}`, "text"])}</Tag>
          ),
        },
        {
          title: () => {
            return (
              <div className="header-nav-children">
                <p className="ant_header">Trạng thái bảng kê</p>
                <Input placeholder="Trạng thái bảng kê" disabled />
                {/* <DefineSelect
                  placeholder="Chọn trạng thái"

                  onChange={(e) => {
                    _changeQuery(e, 'filterBy[status]')
                  }
                  }
                  dataBin={exportStatus}
                  value={params['filterBy[status]']}
                /> */}
              </div >
            );
          },
          dataIndex: "export_status",
          key: "export_status",
          width: 180,
          align: "center",
          render: (text) => (
            <Tag color={definitions.getIn(["export_statuses", `${text}`, "color"])}>{definitions.getIn(["export_statuses", `${text}`, "text"])}</Tag>
          ),
        },
      ],
    },
    {
      title: "Nơi xử lý trả hàng ",
      children: [
        {
          title: () => {
            return (
              <div className="header-nav-children">
                <p className="ant_header">Văn phòng trả hàng</p>
                <Input placeholder="Văn phòng trả hàng" disabled />
              </div>
            );
          },
          dataIndex: "hub_delivery",
          key: "hub_delivery",
          width: 180,
        },
        {
          title: () => {
            return (
              <div className="header-nav-children">
                <p className="ant_header">NV phát hàng</p>
                <Input placeholder="NV phát hàng" disabled />
              </div>
            );
          },
          dataIndex: "staff_delivery",
          key: "staff_delivery",
          width: 180,
        },
      ],
    },
  ];
  const renderContent = () => {
    return (
      <Row justify="end" style={{ marginBottom: 5, marginTop: 5 }}>
        <Pagination
          onShowSizeChange={(current, size) => {
            setParams((prevState) => {
              let nextState = { ...prevState };
              nextState.page = 1;
              nextState.per_page = size;
              return nextState;
            });
          }}
          onChange={(page, pageSize) => {
            setParams((prevState) => {
              let nextState = { ...prevState };
              nextState.page = page;
              return nextState;
            });
          }}
          total={total}
          current={params.page}
          pageSize={params.per_page}
          // showSizeChanger={params.per_page}
          showSizeChanger
        />
      </Row>
    );
  };
  return (
    <div className={className}>
      {renderContent()}
      < Table
        columns={columns}
        dataSource={data}
        rowKey="order_id"
        pagination={false}
        bordered
        scroll={{ x: "calc(700px + 50%)" }}
      />
      {renderContent()}
    </div>
  );
});
TotalReport.propTypes = {
  className: PropTypes.any,
};
const mapStateToProps = createStructuredSelector({
  definitions: makeSelectDefinitions(),
});
const withConnect = connect(
  mapStateToProps,
  null
);
export default styled(withConnect(TotalReport))`
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
.ant-pagination-options-size-changer.ant-select {
  margin-right: 0px !important ;
.header-nav {
  margin-top: 40px;
}
.header-nav-children {
  margin-top: -15px;
}

.ant-table-thead > tr > th {
  text-align: center;
  background: rgb(242, 243, 248);
  padding: 16px;
  font-family: "Roboto", "Helvetica", "Arial", sans-serif;
  line-height: 1.43;
  border-bottom: 1px solid rgba(224, 224, 224, 1);
  letter-spacing: 0.01071em;
}
.ant_header {
  text-align: center;
  background: rgb(242, 243, 248);
  padding: 16px;
  font-family: "Roboto", "Helvetica", "Arial", sans-serif;
  line-height: 1.43;
  letter-spacing: 0.01071em;
  height: 40px;
}

.ant-table.ant-table-bordered
  > .ant-table-container
  > .ant-table-content
  > table
  > tbody
  > tr
  > td {
  border: 1px solid rgb(242, 243, 248);
}
.ant-table.ant-table-bordered
  > .ant-table-container
  > .ant-table-content
  > table
  > thead
  > tr
  > th {
  border-right: 1px solid rgba(224, 224, 224, 1);
}
.ant-table.ant-table-bordered
  > .ant-table-container
  > .ant-table-content
  > table
  > thead
  > tr:not(:last-child)
  > th {
  border-bottom: 1px solid rgba(224, 224, 224, 1);
}
.ant-table-tbody > tr > td {
  border-bottom: 1px solid #f0f0f0;
  text-align: center !important;
}
`;


