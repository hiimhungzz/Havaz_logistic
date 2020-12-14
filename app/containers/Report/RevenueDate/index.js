import PropTypes from "prop-types";
import React, { memo, useState, useEffect, useCallback } from "react";
import { Button, Col, Row, Divider, Spin } from "antd";
import styled from "styled-components";
import DateList from "./DateList";
import { Ui } from "utils/Ui";
import moment from "moment";
import Filter from "./Filter";
import { DownloadOutlined } from "@ant-design/icons";
import ServiceBase from "utils/ServiceBase";
import downloadFile from "components/Utility/downloadFile";

const ReportDate = ({ className }) => {
  const [data, setData] = useState([]);
  const [loadding, setLoading] = useState(false);
  const [btnloadding, setBtnLoadding] = useState(false);
  const [total, setTotal] = useState(0);
  const [params, setParams] = useState({
    page: 1,
    per_page: 10, // so ban ghi tren 1 trang,
    day_from: moment().subtract(2, 'day').format("YYYY-MM-DD"), // Filter lấy ngày hiện tại trừ đi 2 ngày 
    day_to: moment().format("YYYY-MM-DD"), //ngày hiện tại
  });
  const getTripList = useCallback(async () => {
    setLoading(true);
    const result = await ServiceBase.requestJson({
      method: "GET",
      url: "/v1/report/revenue-day",
      data: {
        ...params,
        day_from: moment(params.day_from).format("YYYY-MM-DD"),
        day_to: moment(params.day_to).format("YYYY-MM-DD"),
      },
    });
    if (result.hasErrors) {
      Ui.showErrors(result.errors);
    } else {
      console.log("result", result);
      // setTotal(result.value.pagination.total);
      setData(result.value.data);
    }
    await setLoading(false);
  }, [params]);

  const onRefreshList = useCallback(() => {
    getTripList();
  });

  useEffect(() => {
    getTripList();
  }, [getTripList]);
  const enterLoading = () => {
    setBtnLoadding(true);
    setTimeout(() => {
      setBtnLoadding(false);
    }, 3000);
  };
  return (
    <>
      <Row className={className} gutter={[16, 16]} style={{ height: 40 }}>
        <Col xs={16}>
          <Filter />
        </Col>
        <Col style={{ marginLeft: "auto", padding: 0 }}>
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
        </Col>
      </Row>

      <div className="container">
        <div className="content">
          <Spin spinning={loadding}>
            <DateList
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
ReportDate.propTypes = {
  className: PropTypes.any,
};
export default styled(ReportDate)`
  .ant-divider-horizontal {
    display: flex;
    clear: both;
    width: 100%;
    min-width: 100%;
    margin: 0px 0 !important;
  }
  .export-content {
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
