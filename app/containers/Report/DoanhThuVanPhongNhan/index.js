import PropTypes from "prop-types";
import React, { memo, useState, useEffect, useCallback } from "react";
import { Button, Col, Row, Divider, Spin } from "antd";
import styled from "styled-components";
import DoanhThuVanPhongNhanList from "./DoanhThuVanPhongNhanList";
import Filter from "./Filter";
import { DownloadOutlined } from "@ant-design/icons";
import ServiceBase from "utils/ServiceBase";
import { Ui } from "utils/Ui";
import downloadFile from "components/Utility/downloadFile";
import moment from 'moment';
const DoanhThuVanPhongNhan = ({ className }) => {

  const [data, setData] = useState([]);
  const [aggregate, setAggregate] = useState(null);
  const [btnloadding, setBtnLoadding] = useState(false);
  const [loadding, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [params, setParams] = useState({
    page: 1,
    per_page: 20,
    from_date: moment().add(-1, 'weeks').endOf('week'),
    to_date: moment(),
    hub_id: null,
  });
  const getStaffList = useCallback(async () => {
    setLoading(true);
    const result = await ServiceBase.requestJson({
      method: "GET",
      url: "v1/report/receiving-report-by-date-and-hub",
      data: {
        ...params,
        from_date: moment(params.from_date).format("YYYY-MM-DD"),
        to_date: moment(params.to_date).format("YYYY-MM-DD")
      },
    });
    if (result.hasErrors) {
      Ui.showErrors(result.errors);
    } else {
      setData(result.value.data);
      setTotal(result.value.total);
      setAggregate(result.value.aggregate)
    }
    await setLoading(false);
  }, [params]);

  const onRefreshList = useCallback(() => {
    getStaffList();
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
        day_from: moment(params.from_date).format("YYYY-MM-DD") || moment(params.day_to).format("YYYY-MM-DD"),
        day_to: moment(params.to_date).format("YYYY-MM-DD"),
        scope: 'excel',
      }
    });
    if (result.hasErrors) {
      Ui.showErrors(result.errors);
    } else {
      const url = window.URL.createObjectURL(new Blob([result.value]));
      downloadFile(url, `Báo cáo doanh thu kết nối cho xe tuyến.xlsx`)
    }
    await setLoading(false);
  }, [params]);

  useEffect(() => {
    getStaffList();
  }, [getStaffList]);

  return (
    <div className="container">
      <div className="content">
        <Row className={className} gutter={[8, 16]} style={{ height: 40 }}>
          <Col xs={16}>
            <Filter params={params} setParams={setParams} />
          </Col>
          {/* <Col style={{ marginLeft: "auto" }}>
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
          </Col> */}
        </Row>
        <Spin spinning={loadding}>
          <DoanhThuVanPhongNhanList
            aggregate={aggregate}
            setParams={setParams}
            data={data}
            params={params}
            total={total}
            onRefreshList={onRefreshList}
          />
        </Spin>
      </div>
    </div>
  );
};
DoanhThuVanPhongNhan.propTypes = {
  className: PropTypes.any,
};
export default styled(DoanhThuVanPhongNhan)`
 
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
