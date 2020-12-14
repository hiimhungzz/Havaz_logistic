import { DownloadOutlined } from "@ant-design/icons";
import { Button, Col, Row, Spin } from "antd";
import PropTypes from "prop-types";
import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import ServiceBase from "utils/ServiceBase";
import { Ui } from "utils/Ui";
import ExportList from "./ExportList";
import Filter from "./Filter";
const data1 = [
  {
    id: 1,
    code_office: "H_LSJDJDSA",
    name_office: "Hà Sơn- Hải Vân",
    num_of_packet: 10,
    num_export: 7,
    oder_fee: 1000000,
  },
];
const RevenueStaff = ({ className }) => {
  const [data, setData] = useState([]);
  const [loadding, setLoading] = useState(false);
  const [btnloadding, setBtnLoadding] = useState(false);
  const [total, setTotal] = useState(0);
  const [params, setParams] = useState({
    mavp: "",
    page: 1,
    per_page: 10, // so ban ghi tren 1 trang,
    ten: "",
    nhaptuyen: 0,
    daphat: 0,
    tonphat: 0,
  });

  const getExportList = useCallback(async () => {
    setLoading(true);
    const result = await ServiceBase.requestJson({
      method: "GET",
      url: "v1/bao-cao/list-dau-phat",
      data: params,
    });
    if (result.hasErrors) {
      Ui.showErrors(result.errors);
    } else {
      setTotal(result.value.pagination.total);
      setData(result.value.data);
    }
    await setLoading(false);
  }, [params]);

  const onRefreshList = useCallback(() => {
    getExportList();
  });

  useEffect(() => {
    getExportList();
  }, [getExportList]);
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
        <Col style={{ marginLeft: "auto" }}>
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
            <span style={{ color: "#1890ff" }}> Xuất Excel</span>
          </Button>
        </Col>
      </Row>
      <div className="container">
        <div className="content">
          <Spin spinning={loadding}>
            <ExportList
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
