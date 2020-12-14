import PropTypes from "prop-types";
import React, { useCallback } from "react";
import styled from "styled-components";
import ServiceBase from "utils/ServiceBase";
import { Ui } from "utils/Ui";
import FormBillCod from './FormBillCod';
const UpdateBill = ({
    className,
    onHiddenModalEdit,
    onRefreshList,
    itemSelected,
    data
}) => {
    const onSave = useCallback(async (values) => {
        const result = await ServiceBase.requestJson({
            method: "PUT",
            url: `v1/cod/cods/${itemSelected.id}`,
            data: {
                ...values
            },
        });
        if (result.hasErrors) {
            Ui.showErrors(result.errors);
        } else {
            Ui.showSuccess({ message: "Cập nhật bảng cước COD thành công." });
            onHiddenModalEdit();
            onRefreshList();
        }
    })
    return (
        <FormBillCod
            data={data}
            itemSelected={itemSelected}
            onSave={onSave}
            onHiddenModal={onHiddenModalEdit}
        />
    );
};
UpdateBill.propTypes = {
    className: PropTypes.any,
};
export default styled(UpdateBill)`
  .action {
    position: absolute,
    left: 0,
    width: "100%",
    bottom: 0,
    borderTop: 1px solid #e9e9e9,
    padding: 10px 38px,
    background: #fff,
    textAlign: left,
  }
}`;
