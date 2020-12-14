import { Checkbox, Spin } from "antd";
import PropTypes from "prop-types";
import React, { memo, useState } from "react";
import styled from "styled-components";
import ServiceBase from "utils/ServiceBase";
import { Ui } from "utils/Ui";
import RegionSelect from "components/Select/RegionSelect";


const ItemRegionSelect = memo(({ className, nameColumn, value, row, data }) => {
    const [valueRegion, setValueRegion] = useState({
        key: value && value.id,
        label: value && value.name
    });
    const [loadding, setLoadding] = useState(false);
    const onChange = async (value) => {
        const params = {
            id: row.id,
            area_id: value.key
        };
        setLoadding(true);
        const result = await ServiceBase.requestJson({
            method: "POST",
            url: "v1/van-phong/update-area",
            data: params,
        });
        if (result.hasErrors) {
            Ui.showErrors(result.errors);
        } else {
            setLoadding(false);
            setValueRegion(value)
        }
    };

    if (nameColumn === "area") {
        return (
            <Spin spinning={loadding}>
                <RegionSelect
                    data={data}
                    value={valueRegion}
                    allowClear
                    loadOnMount
                    onChange={(data) => {
                        onChange(data)
                    }}
                />
            </Spin>
        );
    }
});
ItemRegionSelect.propTypes = {
    className: PropTypes.any,
};
export default styled(ItemRegionSelect)``;
