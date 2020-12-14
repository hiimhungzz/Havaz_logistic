import PropTypes from "prop-types";
import React, { memo, useState, useEffect, useCallback } from "react";
import { Button, Col, Row, Spin } from "antd";
import styled from "styled-components";
import Filter from "./Filter";
import AddGroupCustomer from './Add';
import UpdateBill from './Update';
import GroupCustomerList from "./GroupCustomerList";
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
    price_title_id: undefined

  });

  const getListGroupCustomer = useCallback(async () => {
    setLoading(true);
    const result = await ServiceBase.requestJson({
      method: "GET",
      url: "v1/common/customer-group",
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
      url: `v1/common/customer-group/${ids}`,
      data: {},
    });
    if (result.hasErrors) {
      Ui.showErrors(result.errors);
    } else {
      setItemSelected(result.value.data)
    }
  }, [])

  useEffect(() => {
    getListGroupCustomer();
  }, [getListGroupCustomer]);

  const onRefreshList = () => {
    getListGroupCustomer();
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
            <GroupCustomerList
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
        title={"THÊM MỚI NHÓM KHÁCH HÀNG"}
        width="30%"
      >
        <AddGroupCustomer
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
        title={"SỬA NHÓM KHÁCH HÀNG"}
        width="30%"
      >
        {
          itemSelected ? (
            <UpdateBill
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
