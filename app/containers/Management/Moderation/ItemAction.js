import { EyeOutlined, CarOutlined } from '@ant-design/icons';
import { Button, Drawer } from "antd";
import PropTypes from "prop-types";
import React, { memo, useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import ServiceBase from "utils/ServiceBase";
import { Ui } from "utils/Ui";
import OrderList from "./OrderList";
const ItemAction = memo(({ className, nameColumn, value, row, data, params, onRefreshList, }) => {
    const [visible, setVisible] = useState(false);
    const [loadding, setLoadding] = useState(false);
    const [itemSelected, setItemSelected] = useState(null);
    const createNewTrip = useCallback(async (row) => {
        setLoadding(true);
        const result = await ServiceBase.requestJson({
            method: "POST",
            url: "v1/shipments",
            data: {
                trip_id: row.trip_id
            }
        });
        if (result.hasErrors) {
            Ui.showErrors(result.errors);
        } else {
            setLoadding(false);
            Ui.showSuccess({ message: "Tạo chuyến đi thành công" });
            onRefreshList();
        }
    }, []);
    useEffect(() => {
        createNewTrip();
    }, [createNewTrip]);

    return (
        <div>
            {row.shipment_id === null ?
                < Button
                    size="small"
                    type="link"
                    onClick={() => {
                        createNewTrip(row)
                    }}
                >
                    <CarOutlined title="Tạo chuyến" />
                </Button> :
                < Button
                    size="small"
                    type="link"
                    onClick={() => {
                        setVisible(true)
                        setItemSelected(row)
                    }}
                >
                    <EyeOutlined title="Xem đơn hàng" />
                </Button>
            }
            <Drawer
                title="Danh sách đơn hàng"
                width="90%"
                height="100%"
                closable={true}
                onClose={() => setVisible(false)}
                visible={visible}
                bodyStyle={{ height: "100%" }}
                footer={null}
            >
                <OrderList
                    params={params}
                    itemSelected={itemSelected}
                    onRefreshList={onRefreshList}
                />
            </Drawer>
        </div>
    );
});
ItemAction.propTypes = {
    className: PropTypes.any,
};
export default styled(ItemAction)``;
