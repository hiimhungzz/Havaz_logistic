import PropTypes from "prop-types";
import React, { memo, useState, useEffect, useCallback } from "react";
import { Button, Col, Row, Spin, Input } from "antd";
import styled from "styled-components";
import ServiceBase from "utils/ServiceBase";
import { Ui } from "utils/Ui";
import ItemEdit from './ItemEdit';
import MenuPrice from './MenuPrice';
import { DrawerBase } from "components";
import StepIncrease from './StepIncrease';

const BillForMerchandise = ({ className }) => {
  const [itemSelected, setItemSelected] = useState(null);
  const [isShowModal, setShowModal] = useState(false);
  const [menuPrice, setPriceMenu] = useState([]);
  const [step_increase, setStepIncrease] = useState([]);
  const [priceList, setPriceList] = useState([]);
  const [regionList, setRegionList] = useState([]);
  const [loadding, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [color, setColor] = useState([
    'red', 'yellow', 'blue', 'pink'
  ]);
  const [params, setParams] = useState({
    page: 1,
    per_page: 10, // so ban ghi tren 1 trang,
  });


  const getListRegion = useCallback(async () => {
    setLoading(true);
    const result = await ServiceBase.requestJson({
      method: "GET",
      url: "v1/common/area",
      data: {
        page: 1,
        per_page: 10, // so ban ghi tren 1 trang,
        active: 1,
      },
    });
    if (result.hasErrors) {
      Ui.showErrors(result.errors);
    } else {
      setRegionList(result.value.data);
    }
    await setLoading(false);
  }, [params]);

  const getStepInscrease = useCallback(async () => {
    setLoading(true);
    const result = await ServiceBase.requestJson({
      method: "GET",
      url: "v1/price-matrix/step_increase",
      data: itemSelected,
    });
    if (result.hasErrors) {
      Ui.showErrors(result.errors);
    } else {
      setStepIncrease(result.value.data)
    }
    await setLoading(false);
  }, [itemSelected]);

  const getListPrice = useCallback(async () => {
    setLoading(true);
    if (itemSelected) {
      const result = await ServiceBase.requestJson({
        method: "GET",
        url: "v1/price-matrix/price",
        data: itemSelected,
      });
      if (result.hasErrors) {
        Ui.showErrors(result.errors);
      } else {
        setPriceList(result.value.data)
      }
    }
    await setLoading(false);
  }, [itemSelected]);

  const getListMenuPrice = useCallback(async () => {
    setLoading(true);
    const result = await ServiceBase.requestJson({
      method: "GET",
      url: "v1/price-matrix/price-menu",
      data: {},
    });
    if (result.hasErrors) {
      Ui.showErrors(result.errors);
    } else {
      setPriceMenu(result.value)
    }
    await setLoading(false);
  }, []);

  const onHiddenModal = useCallback(() => {
    setShowModal(false)
  });

  const onRefreshList = () => {
    getStepInscrease();
    getListPrice();
    getListMenuPrice();
  }

  useEffect(() => {
    getListRegion();
    getListMenuPrice();
  }, []);

  useEffect(() => {
    getStepInscrease();
    getListPrice()
  }, [getListPrice, getStepInscrease]);

  let totalRow = 0
  return (
    <div className={className}>
      <Row gutter={[16, 16]}>
        <Col span={4} >
          <MenuPrice menuPrice={menuPrice} itemSelected={itemSelected} onSelectItem={async (item, modal) => {
            await setLoading(true)
            await setItemSelected(item)
            await setLoading(false)
            if (modal) {
              setShowModal(true)
            }
          }} />
        </Col>
        <Col span={20} className="pricing">
          <Spin spinning={loadding}>
            {
              itemSelected && priceList.length > 0 ? (

                <div className="container">
                  <table
                    className="table"
                  >
                    <thead className="table_head">
                      <tr style={{ height: 36 }}>
                        <th style={{ width: 90 }}></th>
                        <th style={{ width: 150, display: "flex" }}>
                          <span style={{ width: "33%", marginTop: 6 }}>Từ </span>
                          <span style={{ width: "33%", marginTop: 6 }}>Đến</span>
                          <span style={{ width: "33%", marginTop: 6 }}>Lũy kế</span>
                          {/* /
                          / */}
                        </th>
                        {
                          regionList.map((item, index) => (
                            <th key={index}>{item.name}</th>
                          ))
                        }
                      </tr>
                    </thead>
                    <tbody >
                      {
                        regionList.map((item_a, index_a) => {
                          totalRow++;
                          let count = 0;
                          return (
                            <tr key={index_a} style={{ borderBottom: '1.5px solid rgba(224, 224, 224, 1)' }}>
                              <td style={{ fontWeight: 'bold' }}>{item_a.name}</td>
                              {
                                step_increase.map((item, index) => {
                                  return (
                                    <tr key={index}>
                                      <td style={{ paddingBottom: 10, paddingTop: 10 }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{item.min}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
                                      <td style={{ paddingBottom: 10, paddingTop: 10 }}>{item.max}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
                                      <td style={{ paddingBottom: 10, paddingTop: 10 }}>{item.type === 0 ? "" : "X"}</td>
                                    </tr>
                                  )
                                })
                              }

                              {
                                regionList.map((item_b, index_b) => {
                                  count++;

                                  if (count > 0) {
                                    if (totalRow <= count) {
                                      return (
                                        <td key={index_b}>
                                          {
                                            step_increase.map((item, index) => {
                                              const itemActive = priceList.filter(item_value =>
                                                item_value.area_from && item_value.area_from.id === item_a.id
                                                && item_value.area_to && item_value.area_to.id === item_b.id
                                                && item_value.step_increase && item_value.step_increase.id === item.id
                                              )
                                              if (itemActive.length > 0) {
                                                return <div key={index}>
                                                  <ItemEdit value={itemActive[0] && itemActive[0].price} item={itemActive[0]} />
                                                </div>
                                              } else {
                                                // return <div key={index}> <Input value={`${item_a.id} - ${item_b.id} -${item.id}`} type="text"/></div>
                                                return null;
                                              }
                                            })
                                          }
                                        </td>
                                      )
                                    } else {
                                      return <td key={index_b}></td>
                                    }
                                  }
                                })
                              }
                            </tr>
                          )
                        })
                      }

                    </tbody>
                  </table>
                </div>

              ) : (
                  "Xin vui lòng chọn tên bảng cước và loại dịch vụ hàng để khai giá."
                  // !loadding && itemSelected && priceList && priceList.length === 0 ? <div>Không có dữ liệu, vui lòng tạo bản ghi mới</div> : null
                )
            }
          </Spin>
        </Col>
      </Row>
      <DrawerBase
        destroyOnClose
        onClose={onHiddenModal}
        closable={true}
        placement="right"
        visible={isShowModal}
        title={"THAO TÁC"}
        width="30%"
      >
        {
          itemSelected ? (
            <StepIncrease itemSelected={itemSelected} onHiddenModal={onHiddenModal} onRefreshList={onRefreshList} />
          ) : <div style={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center' }}><Spin spinning /></div>
        }
      </DrawerBase>
    </div>
  );
};
BillForMerchandise.propTypes = {
  className: PropTypes.any,
};
export default styled(BillForMerchandise)`
	.container {
		width: 100%;
		overflow: hidden;
	}
	.table {
		overflow-x: auto;
		display: block;
  }
  .CSue main .main-content .ant-row{
    min-height:400px!important;
  }
  .pricing{
    text-align: center!important;
    border: 1px solid #e8dddd;
    // background: #fdfcf4;
    // background: #ffff;
  }
  .table_head {
    background:#dedede;
    // background: #fbf6cf;
    width: 100%;
  }
`;
