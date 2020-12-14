import { Button, Col, Row, Spin } from "antd";
import { DrawerBase } from "components";
import PropTypes from "prop-types";
import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import ServiceBase from "utils/ServiceBase";
import { Ui } from "utils/Ui";
import AddService from './Add';
import Filter from "./Filter";
import ServiceList from "./ServiceList";
import UpdateService from './Update';
// const a = [
//   {
//     id: 1,
//     code: 'FAST_TL',
//     name: 'Chuyển phát nhanh Tài liệu'
//   },
//   {
//     id: 2,
//     code: 'VIP_TL',
//     name: 'Chuyển phát nhanh Xe máy'
//   }
// ]
const Service = ({ className }) => {
  const [data, setData] = useState([]);
  const [itemSelected, setItemSelected] = useState(null);
  const [isShowModal, setShowModal] = useState(false)
  const [isShowModalEdit, setShowModalEdit] = useState(false)
  const [loadding, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [params, setParams] = useState({
    page: 1,
    per_page: 10, // so ban ghi tren 1 trang,
    name: "",
    code: "",
  });

  const getListService = useCallback(async () => {
    setLoading(true);
    const result = await ServiceBase.requestJson({
      method: "GET",
      url: "v1/common/service-type-product",
      data: params,
    });
    if (result.hasErrors) {
      Ui.showErrors(result.errors);
    } else {
      setTotal(result.value.meta.total);
      setData(result.value.data);
    }
    await setLoading(false);
  }, [params]);

  const onHiddenModal = useCallback(() => {
    setShowModal(false);
  });

  const onHiddenModalEdit = useCallback(() => {
    setItemSelected(null);
    setShowModalEdit(false);
  });

  const onEdit = useCallback(async (ids) => {
    setShowModalEdit(true)
    const result = await ServiceBase.requestJson({
      method: "GET",
      url: `v1/common/service-type-product/${ids}`,
      data: {},
    });
    if (result.hasErrors) {
      Ui.showErrors(result.errors);
    } else {
      setItemSelected(result.value.data)
    }
  }, [])

  useEffect(() => {
    getListService();
  }, [getListService]);

  const onRefreshList = () => {
    getListService();
  }
  return (
    <>
      <Col xs={24}>
        <Filter setParams={setParams} />
        <div style={{ display: 'flex', justifyContent: 'flex-end', flex: 1, alignItems: 'center', paddingBottom: 10 }}>
          <Button type="primary" onClick={() => setShowModal(true)}>
            Thêm mới
          </Button>
        </div>
      </Col>

      <div className="container">
        <div className="content">
          <Spin spinning={loadding}>
            <ServiceList
              setParams={setParams}
              data={data}
              params={params}
              total={total}
              onEdit={onEdit}
            />
          </Spin>
        </div>
      </div>
      <Row />
      <DrawerBase
        destroyOnClose
        onClose={onHiddenModal}
        closable={false}
        placement="right"
        visible={isShowModal}
        title={"THÊM MỚI DỊCH VỤ"}
        width="30%"
      >
        <AddService
          onRefreshList={onRefreshList}
          onHiddenModal={onHiddenModal}
        />
      </DrawerBase>
      <DrawerBase
        destroyOnClose
        onClose={onHiddenModalEdit}
        closable={false}
        placement="right"
        visible={isShowModalEdit}
        title={"SỬA DỊCH VỤ"}
        width="30%"
      >
        {
          itemSelected ? (
            <UpdateService
              onRefreshList={onRefreshList}
              onHiddenModalEdit={onHiddenModalEdit}
              itemSelected={itemSelected}
            />
          ) : <div style={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center' }}><Spin spinning /></div>
        }
      </DrawerBase>
    </>
  );
};
Service.propTypes = {
  className: PropTypes.any,
};
export default styled(Service)`

`;
