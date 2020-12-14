import PropTypes from "prop-types";
import React, { memo, useState, useEffect, useCallback } from "react";
import { Button, Col, Row, Divider, Spin } from "antd";
import styled from "styled-components";
import HangNhanList from "./HangNhanList";
import Filter from "./Filter";
import { DownloadOutlined } from "@ant-design/icons";
import ServiceBase from "utils/ServiceBase";
import { Ui } from "utils/Ui";
import downloadFile from "components/Utility/downloadFile";
import { URI } from "utils/constants";

import moment from 'moment';

const HangNhan = ({ className, exportExcel }) => {

  const [data, setData] = useState([]);
  const [loadding, setLoading] = useState(false);
  const [aggregate, setAggregate] = useState(null);
  const [btnloadding, setBtnLoadding] = useState(false);
  const [total, setTotal] = useState(0);
  const [SourceOption, SetObjOption] = useState([]);
  const [params, setParams] = useState({
    page: 1,
    per_page: 20,
    day_from: moment().add(-1, 'weeks').endOf('week'),
    day_to: moment(),
    hub_id: null,
    staff_id: null,
  });
  const getData = useCallback(async () => {
    setLoading(true);
    const result = await ServiceBase.requestJson({
      method: "GET",
      url: "v1/report/order-receiving",
      data: {
        ...params,
        day_from: moment(params.day_from).format("YYYY-MM-DD"),
        day_to: moment(params.day_to).format("YYYY-MM-DD")
      },
    });
    console.log("result", result)
    if (result.hasErrors) {
      Ui.showErrors(result.errors);
    } else {
      setData(result.value.data);
      setTotal(result.value.total)
      setAggregate(result.value.aggregate)
    }
    await setLoading(false);
  }, [params]);

  const onRefreshList = useCallback(() => {
    getData();
  });

  const getListStaff = useCallback(async (data) => {
    const result = await ServiceBase.requestJson({
        method: 'GET',
        url: URI['URI_STAFF_LIST'],
        data: {
            page: 1,
            per_page: 10000,
            active: 1,
        },
    });
    if (result.hasErrors) {
        Ui.showErrors(result.errors);
    } else {
        SetObjOption(result.value.data)
    }
  })

  useEffect(() => {
    getListStaff()
  }, [])

  useEffect(() => {
    getData();
  }, [getData]);
  
  return (
    <>
      <Row className={className} gutter={[16, 16]} style={{ height: 40 }}>
        <Col xs={16}>
          <Filter params={params} setParams={setParams} SourceOption={SourceOption}/>
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
            <HangNhanList
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
      <Row />
    </>
  );
};
HangNhan.propTypes = {
  className: PropTypes.any,
};
export default styled(HangNhan)`
 
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
