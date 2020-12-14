import { Button, Col, Form, Input, Row, Select, Icon, Spin } from "antd";
import ServiceBase from "utils/ServiceBase";
import PropTypes from "prop-types";
import React, { useCallback } from "react";
import styled from "styled-components";
import FormRegion from './FormRegion';
import { Ui } from "utils/Ui";
const UpdateRegion = ({
    className,
    onHiddenModalEdit,
    onRefreshList,
    itemSelected,
}) => {
    const onSave = useCallback(async (values) => {
        const result = await ServiceBase.requestJson({
            method: "PUT",
            url: `v1/common/area/${itemSelected.id}`,
            data: {
                name: values.name
            },
        });
        if (result.hasErrors) {
            Ui.showErrors(result.errors);
        } else {
            Ui.showSuccess({ message: "Cập nhật bảng kê thành công." });
            onHiddenModalEdit();
            onRefreshList();
        }
    })
    return (
        <FormRegion
            itemSelected={itemSelected}
            onSave={onSave}
            onHiddenModal={onHiddenModalEdit}
        />
    );
};
UpdateRegion.propTypes = {
    className: PropTypes.any,
};
export default styled(UpdateRegion)`
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
