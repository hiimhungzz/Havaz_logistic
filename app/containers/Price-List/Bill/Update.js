import PropTypes from "prop-types";
import React, { useCallback } from "react";
import styled from "styled-components";
import ServiceBase from "utils/ServiceBase";
import { Ui } from "utils/Ui";
import FormBill from './FormBill';
const UpdateBill = ({
    className,
    onHiddenModalEdit,
    onRefreshList,
    itemSelected,
}) => {
    const onSave = useCallback(async (values) => {
        const result = await ServiceBase.requestJson({
            method: "PUT",
            url: `v1/price-matrix/price-title/${itemSelected.id}`,
            data: {
                name: values.name
            },
        });
        if (result.hasErrors) {
            Ui.showErrors(result.errors);
        } else {
            Ui.showSuccess({ message: "Cập nhật bảng cước thành công." });
            onHiddenModalEdit();
            onRefreshList();
        }
    })
    return (
        <FormBill
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
