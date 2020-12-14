import PropTypes from "prop-types";
import React, { memo, useState, useEffect, useCallback } from "react";
import { Button, Col, Row, Spin, Modal } from "antd";
import styled from "styled-components";
import Filter from "./Filter";
import AddBill from './Add';
import UpdateBill from './Update';
import BillCodList from "./BillCodList";
import ServiceBase from "utils/ServiceBase";
import { DrawerBase } from "components";
import { Ui } from "utils/Ui";
const Bill_COD = ({ className }) => {
  const hoaganh = [
    {
      id: 1,
      min: '238',
      max: '3294',
      value_bill: '3483274',
      type: 1,
      value_first: '89324',
      increase: 93784,
      bill_increase: 98347,
    }
  ]
  const [data, setData] = useState(hoaganh);
  const [itemSelected, setItemSelected] = useState(null);
  const [isShowModal, setShowModal] = useState(false)
  const [isShowModalDelete, setShowModalDelete] = useState(false)
  const [isShowModalEdit, setShowModalEdit] = useState(false)
  const [loadding, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [params, setParams] = useState({
    page: 1,
    per_page: 10, // so ban ghi tren 1 trang,
  });

  const getListBill = useCallback(async () => {
    setLoading(true);
    const result = await ServiceBase.requestJson({
      method: "GET",
      url: "v1/cod/cods",
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
  const _handleDelAll = useCallback(async () => {
    const result = await ServiceBase.requestJson({
      method: "POST",
      url: "v1/cod/reset-cod",
      data: {
        ...itemSelected,
      },
    });
    if (result.hasErrors) {
      Ui.showErrors(result.errors);
    } else {
      await getListBill()
      await setShowModalDelete(false)
      await onRefreshList()
    }
  });

  const onHiddenModalEdit = useCallback(() => {
    setItemSelected(null);
    setShowModalEdit(false);
  });

  const onEdit = useCallback(async (ids) => {
    setShowModalEdit(true)
    const result = await ServiceBase.requestJson({
      method: "GET",
      url: `v1/cod/cods/${ids}`,
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
        {/* <Filter setParams={setParams} /> */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', flex: 1, alignItems: 'center', paddingBottom: 10 }}>
          <Button style={{ marginRight: 30 }} type="primary" danger onClick={() => {

            setShowModalDelete(true)
          }}
          >
            Xóa tất cả
          </Button>
          <Button type="primary" onClick={() => setShowModal(true)}>
            Thêm mới
          </Button>
        </div>
      </Col>

      <div className="container">
        <div className="content">
          <Spin spinning={loadding}>
            <BillCodList
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
        title={"Thêm mới bảng cước COD"}
        width="30%"
      >
        <AddBill
          data={data}
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
        title={"Sửa bảng cước COD"}
        width="30%"
      >
        {
          itemSelected ? (
            <UpdateBill
              data={data}
              onRefreshList={onRefreshList}
              onHiddenModalEdit={onHiddenModalEdit}
              itemSelected={itemSelected}
            />
          ) : <div style={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center' }}><Spin spinning /></div>
        }
      </DrawerBase>
      <Modal
        title="Xóa dữ liệu"
        visible={isShowModalDelete}
        onOk={() => { _handleDelAll() }}
        onCancel={() => { setShowModalDelete(false) }}
      >
        <p>Bạn có chắc sẽ xóa tất cả không ?</p>
      </Modal>
    </>
  );
};
Bill_COD.propTypes = {
  className: PropTypes.any,
};
export default styled(Bill_COD)`
`;
