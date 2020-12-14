import { DownloadOutlined } from "@ant-design/icons";
import { Button, Col, Row, Spin } from "antd";
import downloadFile from "components/Utility/downloadFile";
import moment from "moment";
import PropTypes from "prop-types";
import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import ServiceBase from "utils/ServiceBase";
import { Ui } from "utils/Ui";
import TotalReport from "./TotalReport";

const RevenueStaff = ({ className }) => {
  const [data, setData] = useState([]);
  const [loadding, setLoading] = useState(false);
  const [btnloadding, setBtnLoadding] = useState(false);
  const [total, setTotal] = useState(0);
  const [params, setParams] = useState({
    page: 1,
    per_page: 10,
    source_id: null,
    destination_id: null,
    export_code: null,
    // order_code: null,
    day_from: moment().subtract(2, 'day').format("YYYY-MM-DD"), // Filter lấy ngày hiện tại trừ đi 2 ngày 
    day_to: moment().format("YYYY-MM-DD"), //ngày hiện tại

  });


  const getTotalList = useCallback(async () => {
    setLoading(true);
    const result = await ServiceBase.requestJson({
      method: "GET",
      url: "v1/report/general",
      data: {
        ...params,
        day_from: moment(params.day_from).format("YYYY-MM-DD"),
        day_to: moment(params.day_to).format("YYYY-MM-DD"),
        //scope: excel,
      }
    });
    if (result.hasErrors) {
      Ui.showErrors(result.errors);
    } else {
      setTotal(result.value.meta.total);
      setData(result.value.data);
    }
    await setLoading(false);
  }, [params]);
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
        day_from: moment(params.day_from).format("YYYY-MM-DD"),
        day_to: moment(params.day_to).format("YYYY-MM-DD"),
        scope: 'excel',
      }
    });
    if (result.hasErrors) {
      Ui.showErrors(result.errors);
    } else {
      const url = window.URL.createObjectURL(new Blob([result.value]));
      downloadFile(url, `Báo cáo tổng hợp.xlsx`)
      // const link = document.createElement('a');
      // link.href = url;
      // console.log("link", link);
      // link.setAttribute('download', `HOANGANH.xlsx`);
      // document.body.appendChild(link);
      // link.click();
    }
    await setLoading(false);
  }, [params]);

  useEffect(() => {
    getTotalList();
  }, [getTotalList]);



  const onRefreshList = useCallback(() => {
    getTotalList();
  });
  return (
    <>
      <Row className={className} justify="end" gutter={[16, 16]}>

        <Col>
          <Button
            type="default"
            icon={<DownloadOutlined style={{ color: "#1890ff" }} />}
            loading={btnloadding}
            onClick={e => {
              exportExcel()
            }}
            style={{
              backgroundColor: "#e6f7ff",
              borderRadius: 6,
              border: "1px solid #fff",
              height: 40,
            }}
          >
            <span style={{ color: "#1890ff" }}>Xuất Excel</span>
          </Button>
        </Col>
      </Row>

      <div className="container">
        <div className="content">
          <Spin spinning={loadding}>
            <TotalReport
              setParams={setParams}
              data={data}
              params={params}
              total={total}
              onRefreshList={onRefreshList} />
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
