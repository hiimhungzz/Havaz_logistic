import { Checkbox, Input, Spin } from "antd";
import PropTypes from "prop-types";
import React, { memo, useState, useCallback, useEffect } from "react";
import styled from "styled-components";
import ServiceBase from "utils/ServiceBase";
import { Ui } from "utils/Ui";
import List from './List';
import FormStepIncrease from './FormStepIncrease';

const StepIncrease = memo(({ className, itemSelected, onHiddenModal, onRefreshList, onSelectItem }) => {
  const [loadding, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const onSave = async (values) => {
    const min = values.min
    const max = values.max
    const max_e = data.length === 0 ? -1 : data[data.length - 1].max /// phần tử cuối cùng của mảng danh sách lũy kế đã tạo
    const type_e = data.length === 0 ? 1 : data[data.length - 1].type // tích lũy kế 0 : 1
    if (min > max_e && min < max && type_e === 1) {
      setLoading(true)
      const result = await ServiceBase.requestJson({
        method: "POST",
        url: `v1/price-matrix/step_increase`,
        data: {
          ...itemSelected,
          min: min,
          max: max,
          type: values.type ? 1 : 0
        },
      });
      if (result.hasErrors) {
        Ui.showErrors(result.errors);
      } else {
        await getListStepIncrease()
        await onRefreshList()
      }
      setLoading(false)
    }
    else {
      Ui.showWarning({ message: type_e === 0 ? "Đã kết thúc lũy kế" : "Giá trị nhập vào không phù hợp" });
      // onRefreshList()
    }

  }

  const getListStepIncrease = useCallback(async () => {
    setLoading(true);
    const result = await ServiceBase.requestJson({
      method: "GET",
      url: "v1/price-matrix/step_increase",
      data: {
        ...itemSelected,
      },
    });
    if (result.hasErrors) {
      Ui.showErrors(result.errors);
    } else {
      setData(result.value.data)
    }
    await setLoading(false);
  }, [itemSelected]);

  const _handleReset = useCallback(async () => {
    const result = await ServiceBase.requestJson({
      method: "POST",
      url: "v1/price-matrix/reset-price",
      data: {
        ...itemSelected,
      },
    });
    if (result.hasErrors) {
      Ui.showErrors(result.errors);
    } else {
      await getListStepIncrease()
      await onRefreshList()
    }
  })

  useEffect(() => {
    getListStepIncrease();
  }, [getListStepIncrease]);
  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <Spin spinning={loadding}>
          <List data={data} onHiddenModal={onHiddenModal} onSelectItem={onSelectItem} />
        </Spin>
      </div><br />
      <h3>Tạo mới</h3><br />
      <FormStepIncrease
        onSave={onSave}
        _handleReset={_handleReset}
      />
    </div>
  );
});
StepIncrease.propTypes = {
  className: PropTypes.any,
};
export default styled(StepIncrease)``;
