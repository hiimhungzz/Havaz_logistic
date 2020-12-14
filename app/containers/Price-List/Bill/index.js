import PropTypes from "prop-types";
import React, { memo, useState, useEffect, useCallback } from "react";
import { Button, Col, Row, Spin } from "antd";
import styled from "styled-components";
import Filter from "./Filter";
import AddBill from './Add';
import UpdateBill from './Update';
import BillList from "./BillList";
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
  });

  const getListBill = useCallback(async () => {
    setLoading(true);
    const result = await ServiceBase.requestJson({
      method: "GET",
      url: "v1/price-matrix/price-title",
      data: params,
    });
    if (result.hasErrors) {
      Ui.showErrors(result.errors);
    } else {
      setTotal(result.value.meta.total);
      setData(result.value.data);
    }

    // Sử dụng try catch

    // try {
    //   setTotal(result.value.meta.total);
    //   setData(result.value.data);
    // } catch (error) {
    //   Ui.showErrors(result.errors);
    // }
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
      url: `v1/price-matrix/price-title/${ids}`,
      data: {},
    });
    if (result.hasErrors) {
      Ui.showErrors(result.errors);
    } else {
      setItemSelected(result.value.data)
    }
  }, [])

  useEffect(() => {
    getListBill();
  }, [getListBill]);

  const onRefreshList = () => {
    getListBill();
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
            <BillList
              setParams={setParams}
              data={data}
              params={params}
              total={total}
              onEdit={onEdit}
              onRefreshList={onRefreshList}
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
        title={"THÊM MỚI BẢNG CƯỚC"}
        width="30%"
      >
        <AddBill
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
        title={"SỬA BẢNG CƯỚC"}
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
