import PropTypes from "prop-types";
import React, { useCallback } from "react";
import styled from "styled-components";
import ServiceBase from "utils/ServiceBase";
import { Ui } from "utils/Ui";
import FormCustomer from './FormCustomer';
const UpdateCustomer = ({
    className,
    onHiddenModalEdit,
    onRefreshList,
    itemSelected,
}) => {
    const onSave = useCallback(async (values) => {
        const result = await ServiceBase.requestJson({
            method: "PUT",
            url: `v1/common/users/${itemSelected.id}`,
            data: {
                name: values.name,
                customer_id: values.customer_group && values.customer_group.key,
                phone: values.phone,
                city_id: values.city,
                address: values.address
            },
        });
        if (result.hasErrors) {
            Ui.showErrors(result.errors);
        } else {
            Ui.showSuccess({ message: "Cập nhật khách hàng thành công." });
            onHiddenModalEdit();
            onRefreshList();
        }
    })
    return (
        <FormCustomer
            itemSelected={itemSelected}
            onSave={onSave}
            onHiddenModal={onHiddenModalEdit}
        />
    );
};
UpdateCustomer.propTypes = {
    className: PropTypes.any,
};
export default styled(UpdateCustomer)`
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
