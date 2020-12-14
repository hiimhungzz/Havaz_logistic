import { Checkbox, Input } from "antd";
import PropTypes from "prop-types";
import React, { memo, useState, useCallback } from "react";
import styled from "styled-components";
import ServiceBase from "utils/ServiceBase";
import { Ui } from "utils/Ui";
import { DownOutlined, LeftOutlined, PlusCircleOutlined } from '@ant-design/icons';


const ItemMenuPrice = memo(({ className, item, onSelectItem, itemSelected }) => {
    const [isShowItem, setShowItem] = useState(false);
    const button_badge = {
        backgroundColor: "#fa3e3e",
        borderRadius: 3,
        color: "white",
        padding: "1px 3px",
        fontSize: 9,
        position: "absolute",
        top: 0,
        right: 0,
    };
    const button_icon = {
        display: "inline-block",
        position: "relative",
        padding: "2px 5px"
    }
    return (
        <div className={className}>
            <div className="item_pa"
                style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row' }}
                onClick={() => {
                    setShowItem(!isShowItem)
                }}
            >
                <span style={{ fontSize: '16px', color: 'rgba(0, 0, 0, 0.85)', fontWeight: 500 }}>{`${item.name}`}</span>

                {
                    !isShowItem ? <DownOutlined style={{ fontSize: '14px', color: 'rgba(0, 0, 0, 0.85)' }} /> : <LeftOutlined style={{ fontSize: '14px', color: 'rgba(0, 0, 0, 0.85)' }} />
                }
            </div>
            {
                isShowItem ? (
                    <div style={{ paddingLeft: 20, maxHeight: 400, overflow: "scroll" }}>
                        {
                            item.service_type_product.map((item_service, index_service) => (
                                <div className="item_class_ch" style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row' }}>
                                    <div onClick={() => {
                                        onSelectItem(
                                            {
                                                price_title_id: item.id,
                                                service_type_id: item_service.id
                                            }
                                        )
                                    }} key={index_service}>
                                        <span className="item_ch"
                                            style={itemSelected && itemSelected.price_title_id === item.id && itemSelected && itemSelected.service_type_id === item_service.id ? { color: 'blue', cursor: 'pointer', fontSize: 16 } : { cursor: 'pointer', fontSize: 16 }}
                                        >
                                            {`${item_service.name}`}
                                        </span>
                                    </div>
                                    <div style={button_icon}>
                                        <PlusCircleOutlined
                                            title="Thêm mới bước tăng"
                                            style={{ fontSize: 22 }}
                                            onClick={() => {
                                                onSelectItem(
                                                    {
                                                        price_title_id: item.id,
                                                        service_type_id: item_service.id
                                                    },
                                                    true
                                                )
                                            }}
                                        />
                                        <span style={button_badge}>{`${item_service.count_step_increase}`}</span>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                ) : null
            }

        </div>
    );
});
ItemMenuPrice.propTypes = {
    className: PropTypes.any,
};
export default styled(ItemMenuPrice)`
 .diepbap {
     color: red;
 }
 .item_pa{
    background: #fbf6cf;
    padding: 2px 10px;
    border-bottom: 1px solid #ccb4b4;
    cursor: pointer;
 }
 .item_pa span.anticon{
    margin-top: 3px;
 }
 .item_pa:hover{
    background: #fbf2a9;
    -webkit-transition: all .4s ease;
    -moz-transition: all .4s ease;
    -o-transition: all .4s ease;
    -ms-transition: all .4s ease;
    transition: all .4s ease;
 }
 .item_class_ch{
    border-bottom: 1px solid #e8c2c2;
    padding: 5px 3px 5px 0px;
 }
 .item_class_ch img{
     font-size:16px;
 }
 .ant-col{
    text-align: center;
 }
`;
