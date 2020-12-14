import PropTypes from "prop-types";
import React, { memo, useState, useEffect, useCallback } from "react";
import { Button, Col, Row, Divider, Spin } from "antd";
import styled from "styled-components";
import TripList from "./TripList";
import moment from "moment";
import { Ui } from "utils/Ui";
import { DownloadOutlined } from "@ant-design/icons";
import ServiceBase from "utils/ServiceBase";
import downloadFile from "components/Utility/downloadFile";
import Filter from './Filter';
import _ from "lodash";
const ReportTrip = ({ className }) => {
  const [data, setData] = useState([]);
  const [loadding, setLoading] = useState(false);
  const [btnloadding, setBtnLoadding] = useState(false);
  const [total, setTotal] = useState(0);
  const [params, setParams] = useState({
    page: 1,
    per_page: 10000, // so ban ghi tren 1 trang,
    day: moment(), //ngày hiện tại
  });
  const getTripList = useCallback(async () => {
    setLoading(true);
    const result = await ServiceBase.requestJson({
      method: "GET",
      url: "v1/report/trip-revenue",
      data: {
        ...params,
        day: moment(params.day).format("YYYY-MM-DD"),
      },
    });
    if (result.hasErrors) {
      Ui.showErrors(result.errors);
    } else {
      setData(result.value.data);
      setTotal(result.value.meta);
    }
    await setLoading(false);
  }, [params]);

  const onRefreshList = useCallback(() => {
    getTripList();
  });

  const exportExcel = useCallback(async () => {
    setBtnLoadding(false);
    setTimeout(() => {
      setBtnLoadding(false);
    }, 3000);
    const result = await ServiceBase.requestJson({
      method: "EXPORT",
      url: "v1/report/general",
      data: {
        ...params,
        day_from: moment(params.date).format("YYYY-MM-DD"),
        day_to: moment(params.day_to).format("YYYY-MM-DD"),
        scope: 'excel',
      }
    });
    if (result.hasErrors) {
      Ui.showErrors(result.errors);
    } else {
      const url = window.URL.createObjectURL(new Blob([result.value]));
      downloadFile(url, `Báo cáo theo chuyến.xlsx`)
    }
    await setLoading(false);
  }, [params]);


  useEffect(() => {
    getTripList();
  }, [getTripList]);
  return (
    <>
      <Row className={className} gutter={[8, 16]} style={{ height: 40 }}>
        <Col xs={16}>
          <Filter params={params} setParams={setParams} />
        </Col>
        <Col style={{ marginLeft: "auto", padding: 0 }}>
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

      <div className="container">
        <div className="content">
          <Spin spinning={loadding}>
            <TripList
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
ReportTrip.propTypes = {
  className: PropTypes.any,
};
export default styled(ReportTrip)`
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
