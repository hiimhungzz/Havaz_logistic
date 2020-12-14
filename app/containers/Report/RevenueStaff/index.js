import PropTypes from "prop-types";
import React, { memo, useState, useEffect, useCallback } from "react";
import { Button, Col, Row, Divider, Spin } from "antd";
import styled from "styled-components";
import StaffList from "./StaffList";
import Filter from "./Filter";
import { DownloadOutlined } from "@ant-design/icons";
import ServiceBase from "utils/ServiceBase";
import { Ui } from "utils/Ui";
import downloadFile from "components/Utility/downloadFile";
import moment from 'moment';
const a = [
  {
    id: 1,
    depot: "Yên Nghĩa",
    code: 57686338,
    name: " Trịnh Hiền",
    money: 4756382
  },
  {
    id: 2,
    depot: "Giáp Bát",
    code: 4322343,
    name: "Mai Linh",
    money: 3423554
  }
]
const RevenueStaff = ({ className, exportExcel }) => {

  const [data, setData] = useState([]);
  const [loadding, setLoading] = useState(false);
  const [btnloadding, setBtnLoadding] = useState(false);
  const [total, setTotal] = useState(0);
  const [params, setParams] = useState({
    page: 1,
    per_page: 10000,
    day_from: moment().add(-1, 'weeks').endOf('week'),
    day_to: moment(),
    hub_id: null,
  });
  const getStaffList = useCallback(async () => {
    setLoading(true);
    const result = await ServiceBase.requestJson({
      method: "GET",
      url: "v1/report/staff-receiver",
      data: {
        ...params,
        day_from: moment(params.day_from).format("YYYY-MM-DD"),
        day_to: moment(params.day_to).format("YYYY-MM-DD")
      },
    });
    if (result.hasErrors) {
      Ui.showErrors(result.errors);
    } else {
      setData(result.value.data.dataCount);
    }
    await setLoading(false);
  }, [params]);

  const onRefreshList = useCallback(() => {
    getStaffList();
  });

  useEffect(() => {
    getStaffList();
  }, [getStaffList]);
  
  return (
    <>
      <Row className={className} gutter={[16, 16]} style={{ height: 40 }}>
        <Col xs={16}>
          <Filter params={params} setParams={setParams}/>
        </Col>
        {/* <Col style={{ marginLeft: "auto" }}>
          <Button
            type="default"
            icon={<DownloadOutlined style={{ color: "#1890ff" }} />}
            loading={btnloadding}
            onClick={enterLoading}
            style={{
              backgroundColor: "#e6f7ff",
              borderRadius: 6,
              height: 40,
              border: "1px solid #fff",
            }}
          >
            <span style={{ color: "#1890ff" }}>Xuất Excel</span>
          </Button>
        </Col> */}
      </Row>

      <div className="container">
        <div className="content">
          <Spin spinning={loadding}>
            <StaffList
              setParams={setParams}
              data={data}
              params={params}
              total={total}
              onRefreshList={onRefreshList}
            />
          </Spin>
        </div>
      </div>
      <Row />
    </>
  );
};
RevenueStaff.propTypes = {
  className: PropTypes.any,
};
export default styled(RevenueStaff)`
 
  .export-content {
    height: 40px;
    padding: 1rem 1rem;
    display: grid;
    grid-template-columns: calc(50% - 25px) 50px calc(50% - 25px);
    .middle {
      display: flex;
      align-items: center;
      justify-content: center;

      .ant-btn {
        width: 100%;
        display: flex;
        background-color: red
        align-items: center;
        justify-content: flex-end;

      }
    }
    .btn {
      background-color: #fd397a;
      border-color: #fd397a;
      color: #fff;
    }

  }
`;
