import PropTypes from "prop-types";
import React, { useCallback } from "react";
import styled from "styled-components";
import ServiceBase from "utils/ServiceBase";
import { Ui } from "utils/Ui";
import FormGroupCustomer from './FormGroupCustomer';
const UpdateGroupCustomer = ({
    className,
    onHiddenModalEdit,
    onRefreshList,
    itemSelected,
}) => {
    const onSave = useCallback(async (values) => {
        const result = await ServiceBase.requestJson({
            method: "PUT",
            url: `v1/common/customer-group/${itemSelected.id}`,
            data: {
                name: values.name,
                price_title_id: values.price_title.key
            },
        });
        if (result.hasErrors) {
            Ui.showErrors(result.errors);
        } else {
            Ui.showSuccess({ message: "Cập nhật nhóm khách hàng thành công." });
            onHiddenModalEdit();
            onRefreshList();
        }
    })
    return (
        <FormGroupCustomer
            itemSelected={itemSelected}
            onSave={onSave}
            onHiddenModal={onHiddenModalEdit}
        />
    );
};
UpdateGroupCustomer.propTypes = {
    className: PropTypes.any,
};
export default styled(UpdateGroupCustomer)`
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
