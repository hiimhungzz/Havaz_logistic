/**
 * Copyright 2020-present, TIENDUC.
 * All rights reserved.
 * @author ductt.it.hust@gmail.com on 27/06/2020.
 */

import React, { useState, useCallback, useLayoutEffect } from "react";
import { Row, Col, Spin, Button } from "antd";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Map } from "immutable";
import { useLoadBangKeNhapHangVp } from "utils/hooks";
import Modal from "./Modal";
import Filter from "./Filter";
import List from "./List";
import moment from "moment";
import _ from "lodash";
import { API_BASE_URL, DATE_TIME_FORMAT } from "utils/constants";
import ServiceBase from "utils/ServiceBase";
import { Ui } from "utils/Ui";
import { createStructuredSelector } from "reselect";
import { makeSelectDefinitions } from "containers/App/selectors";
import { connect } from "react-redux";
import { useLocation } from "react-router-dom";
import * as qs from "query-string";
/**
 *
 * Hiển thị bảng kê nhập hàng vn, at the '/bang-ke/nhap-hang/vp' route
 *
 */
const Page = ({ className, definitions }) => {
    const [filter, setFilter] = useState(
        Map({
            MTableId: "",
            begin: moment().startOf("day"),
            finish: moment().endOf("day"),
        })

    );
    const { search } = useLocation();

    const [
        MTablesLoading,
        MTables,
        ,
        setReLoadMTables,
    ] = useLoadBangKeNhapHangVp();
    const [modal, setModal] = useState(Map({ visible: false, isEdit: false }));

    const _handleCancelMTableRecord = useCallback(
        async (mTableId) => {
            let result = await ServiceBase.requestJson({
                baseUrl: API_BASE_URL,
                url: `/v1/importings/${mTableId}/cancel`,
                method: "POST",
                data: {
                    note: "Huỷ chuyến",
                },
            });
            if (result.hasErrors) {
                Ui.showError({ message: "Có lỗi khi hủy bản kê." });
            } else {
                Ui.showSuccess({ message: "Hủy bản kê thành công." });
                setReLoadMTables(true);
            }
        },
        [setReLoadMTables]
    );
    const _handleEditMTableRecord = useCallback(async (mTable) => {
        setModal((prev) =>
            prev.update((x) => {
                x = x.set("visible", true);
                x = x.set("isEdit", true);
                x = x.set("mTableId", mTable.mTableId);
                x = x.set("mTableStatus", mTable.status);
                x = x.set("create_time", mTable.create_time);
                return x;
            })
        );
    }, []);

    const _handleShowModal = useCallback(
        (visible, isEdit = false) => {
            setModal((prev) => {
                let next = prev;
                next = next.set("visible", visible);
                next = next.set("isEdit", isEdit);
                next = next.set("mTableId", null);

                return next;
            });
            if (visible) {
                setReLoadMTables(Boolean(false));
            } else {
                setReLoadMTables(Boolean(true));
            }
        },
        [setReLoadMTables]
    );
    let _handleFiltered = useCallback(() => {
        return MTables.filter((MTable) => {
            return (
                (filter.get("MTableId")
                    ? MTable.get("code").includes(filter.get("MTableId"))
                    : true) &&
                (filter.get("begin") && MTable.get("create_time")
                    ? moment(MTable.get("create_time")).isBetween(
                        moment(filter.get("begin").startOf("day")),
                        moment(filter.get("finish").endOf("day"))
                    )
                    : true)
            );
        })
            .toJS()
            .map((dt) => {
                return {
                    mTableId: dt.id,
                    created_at: dt.created_at,
                    creator: dt.creator,
                    create_time: moment(dt.create_time).format(
                        DATE_TIME_FORMAT.DD_MM_YYYY
                    ),
                    status: dt.status,
                    amount: _.sumBy(dt.orders, (x) => x.order_fee.amount),
                    numberPackage: _.sumBy(dt.orders, (x) => x.num_of_package),
                    children: _.map(dt.orders, (order, orderId) => {
                        return {
                            stt: orderId + 1,
                            order_id: order.code,
                            payment_type: order.payment_type,
                            note: order.note,
                            description: order.description,
                            depot_destination_name: order.destination?.name,
                            destination: order.destination?.name,
                            receiver_address: order.receiver?.address,
                            creator_name: order.creator?.name,
                            receiver_name: order.receiver?.name,
                            receiver_phone: order.receiver?.phone,
                            sender_name: order.sender?.name,
                            source_name: order.source?.name,
                            sender_address: order.sender?.address,
                            sender_phone: order.sender?.phone,
                            num_of_package: order.num_of_package,
                            order_fee: order.order_fee,
                            order_cod: order.order_cod,
                            create_time: moment(order.created_at).format(
                                DATE_TIME_FORMAT.DD_MM_YYYY
                            ),
                            status: order.status,
                        };
                    }),
                };
            });
    }, [filter, MTables]);
    let filtered = _handleFiltered();

    // Load bảng kê theo id trên url
    useLayoutEffect(() => {
        if (search) {
            let parsed = qs.parse(search);
            setTimeout(() => {
                setModal((prev) => {
                    let next = prev;
                    next = next.set("visible", true);
                    next = next.set("isEdit", true);
                    next = next.set("mTableId", parsed.id);
                    return next;
                });
            }, 500);
        }
    }, [search]);

    return (
        <Row className={className} gutter={[16, 0]}>
            <Col xs={24}>
                <Filter filter={filter} setFilter={setFilter} />
            </Col>
            <Col xs={24}>
                <div className="page-content">
                    <div className="page-content__title">
                        DANH SÁCH BẢNG KÊ NHẬP HÀNG TRUNG CHUYỂN
          </div>
                    <div className="page-content__action">
                        <Button
                            type="ghost"
                            onClick={() => setReLoadMTables(Boolean(true))}
                        >
                            Tải lại
            </Button>
                        <Button type="primary" onClick={() => _handleShowModal(true)}>
                            Thêm mới
            </Button>
                    </div>
                </div>

                <Spin spinning={MTablesLoading}>
                    <List
                        dataSource={filtered}
                        onCancelMTableRecord={_handleCancelMTableRecord}
                        onEditMTableRecord={_handleEditMTableRecord}
                    />
                </Spin>
            </Col>
            <Modal
                definitions={definitions}
                modal={modal}
                handleShowModal={_handleShowModal}
            />
        </Row>
    );
};

const mapStateToProps = createStructuredSelector({
    definitions: makeSelectDefinitions(),
});
const withConnect = connect(
    mapStateToProps,
    null
);
Page.propTypes = {
    className: PropTypes.any,
};
export default styled(withConnect(Page))`
  margin-bottom: 0px !important;
  .page-content {
    padding: 5px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .page-content__action {
      display: flex;
      flex-wrap: wrap;
      .ant-btn {
        margin-left: 5px;
      }
    }
  }
`;
