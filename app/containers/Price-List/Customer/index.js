import PropTypes from "prop-types";
import React, { memo, useState, useEffect, useCallback } from "react";
import { Button, Col, Row, Spin } from "antd";
import styled from "styled-components";
import Filter from "./Filter";
import AddCustomer from './Add';
import UpdateCustomer from './Update';
import CustomerList from "./CustomerList";
import ServiceBase from "utils/ServiceBase";
import { DrawerBase } from "components";
import { Ui } from "utils/Ui";
const Bill = ({ className }) => {
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
    use_logis: 1,
  });


  const getListRegion = useCallback(async () => {
    setLoading(true);
    const result = await ServiceBase.requestJson({
      method: "GET",
      url: "v1/common/users",
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
      url: `v1/common/users/${ids}`,
      data: {},
    });
    if (result.hasErrors) {
      Ui.showErrors(result.errors);
    } else {
      setItemSelected(result.value.data)
    }
  }, [])

  useEffect(() => {
    getListRegion();
  }, [getListRegion]);

  const onRefreshList = () => {
    getListRegion();
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
            <CustomerList
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
        title={"THÊM MỚI KHÁCH HÀNG"}
        width="60%"
      >
        <AddCustomer
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
        title={"SỬA THÔNG TIN KHÁCH HÀNG"}
        width="60%"
      >
        {
          itemSelected ? (
            <UpdateCustomer
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
Bill.propTypes = {
  className: PropTypes.any,
};
export default styled(Bill)`
`;
