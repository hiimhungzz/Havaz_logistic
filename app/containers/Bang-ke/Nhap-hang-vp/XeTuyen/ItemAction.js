/**
 * Copyright 2020-present, TIENDUC.
 * All rights reserved.
 * @author ductt.it.hust@gmail.com on 27/06/2020.
 */

import React, { useState, memo, useCallback } from "react";
import { Table, Select, Modal } from "antd";
import styled from "styled-components";
import PropTypes from "prop-types";
import { formatNumber } from "utils/helper";
import { useSelector } from "react-redux";
import ServiceBase from "utils/ServiceBase";
import { API_BASE_URL } from "utils/constants";
import { Ui } from "utils/Ui";
const { Option } = Select;
/*
 * Left Table
 *
 */
const ItemAction = memo(
    ({ className, value, record, tripA, tripB, getList }) => {
        return (
            <Select
                disabled={value !== 2}
                style={{ width: '100%' }}
                onChange={async (value) => {
                    let result = await ServiceBase.requestJson({
                        baseUrl: API_BASE_URL,
                        url: `/v1/shipments/${tripA ? tripA : tripB}/orders/${record.id}/delivering_reply`,
                        method: "POST",
                        data: {
                            accept: value === 1 ? true : false
                        },
                    });
                    if (result.hasErrors) {
                        Ui.showError({ message: "Lỗi vui lòng thử lại sau" });
                    } else {
                        getList(tripA ? tripA : tripB)
                    }
                }}
                placeholder="Thao tác">
                <Option value={1}>Nhận hàng</Option>
                {/* <Option value={2}>Từ chối</Option> */}
            </Select>
        );
    }
);
ItemAction.propTypes = {
    className: PropTypes.any,
};
export default styled(ItemAction)`
`;
