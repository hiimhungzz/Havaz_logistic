import React, {
    useState,
    useCallback,
    useEffect,
} from "react";
import { Row, Col, Select, DatePicker } from "antd";
import { Input, OfficeStaffSelect } from "components";
import styled from "styled-components";
import PropTypes from "prop-types";
import _ from "lodash";
import { Map } from "immutable";
import { API_BASE_URL, DATE_TIME_FORMAT } from "utils/constants";
import ServiceBase from "utils/ServiceBase";
import { Ui } from "utils/Ui";
import moment from 'moment';
import {
    makeSelectTrip,
    makeSelectRoute,
    makeSelectProfile,
} from "containers/App/selectors";
import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";
import List from './List';
const { Option } = Select;
const XeTuyen = ({ className, route }) => {

    const [data, setData] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [dataFilter, setDataFilter] = useState([]);
    const [filters, setFilters] = useState([]);
    const [loadding, setLoadding] = useState(false);
    const [valueScanner, setScanner] = useState("");
    const [routeSelect, setRouter] = useState(undefined);
    const [day, setDay] = useState(moment());
    const [tripA, setTripASelect] = useState(undefined);
    const [tripB, setTripBSelect] = useState(undefined);
    const [tripAOptions, settripAOptions] = useState([])
    const [tripBOptions, settripBOptions] = useState([])

    const getList = useCallback(
        async (trip_id) => {
            await setLoadding(true)
            let result = await ServiceBase.requestJson({
                baseUrl: API_BASE_URL,
                url: `/v1/shipments/${trip_id}/delivering-requested-orders`,
                method: "GET",
                data: {
                    page: 1,
                    per_page: 1000,
                },
            });
            if (result.hasErrors) {
                Ui.showWarning({ message: "Trip chưa được tạo" });
            } else {
                setData(result.value.data)
                setDataFilter(result.value.data)
                let officeFilter = _.map(
                    _.keysIn(_.groupBy(result.value.data, (x) => x.destination.name)),
                    (item) => {
                        return {
                            text: item,
                            value: item,
                        };
                    }
                );
                setFilters(officeFilter)
            }
            await setLoadding(false)
        },
    );

    const getTrip = useCallback(async () => {
        const result = await ServiceBase.requestJson({
            method: "GET",
            url: "v1/common/trips",
            data: {
                day: moment(day).format("YYYY-MM-DD"),
            },
        });
        if (result.hasErrors) {
            Ui.showErrors(result.errors);
        } else {
            let A = [];
            let B = [];
            _.forEach(result.value.data, (trip) => {
                const drivers = trip.drivers.map((item, index) => `${index === 0 ? '' : ', '}${item.name}`)
                let itemPush = {
                    trip_id: trip.trip_id,
                    route_id: trip.route_id,
                    day: trip.day,
                    not_code: trip.not_code,
                    seats: `${trip.occupy_seats}/${trip.seats}`,
                    time_run: `${trip.day} - ${trip.time_run}`,
                    background: trip.trip_service.color,
                    license_plate: trip.trip_bus?.license_plate,
                    drivers: drivers,
                };
                if (trip.direction === 1) {
                    A.push(itemPush);
                } else {
                    B.push(itemPush);
                }
            });
            settripAOptions(A.filter(trip => (routeSelect ? trip.route_id === routeSelect : trip)))
            settripBOptions(B.filter(trip => (routeSelect ? trip.route_id === routeSelect : trip)))
        }
    }, [day, routeSelect]);

    useEffect(() => {
        getTrip()
    }, [getTrip]);

    return (
        <div className={className}>
            <Row gutter={[16, 0]} >
                <Col xs={24}>
                    <Row gutter={[16, 16]} style={{ marginTop: 12 }}>

                        <Col span={4}>
                            <DatePicker
                                allowClear
                                onChange={(date) => {
                                    setDay(date)
                                    setSelectedRowKeys([])
                                }}
                                style={{ width: '100%' }}
                                value={day}
                                format={'DD-MM-YYYY'}
                            />
                        </Col>
                        <Col span={4}>
                            <Select
                                style={{ width: '100%' }}
                                allowClear showSearch showArrow
                                placeholder="Chọn tuyến"
                                onChange={(route) => {
                                    setRouter(route)
                                    setTripASelect(undefined)
                                    setTripBSelect(undefined)
                                    setData([])
                                    setDataFilter([])
                                    setSelectedRowKeys([])
                                }}
                                filterOption={(input, option) => {
                                    return (
                                        option.label
                                            .toLowerCase()
                                            .indexOf(input.toLowerCase()) >= 0
                                    );
                                }}
                                options={route.size > 0 ? route.toList().toJS() : []}
                            />
                        </Col>
                        <Col span={8}>
                            <Select
                                style={{ width: '100%' }}
                                dropdownMatchSelectWidth={false}
                                dropdownStyle={{ width: 500 }}
                                value={tripA}
                                // disabled={!routeSelect}
                                onChange={(item) => {
                                    setTripASelect(item)
                                    setTripBSelect(undefined)
                                    getList(item)
                                    setSelectedRowKeys([])
                                }}
                                allowClear showSearch showArrow
                                placeholder="Chọn chuyến chiều A"
                                filterOption={(input, option) => {
                                    try {
                                        return (
                                            option.label
                                                .toLowerCase()
                                                .indexOf(input.toLowerCase()) >= 0
                                        );
                                    } catch (error) { }
                                }}
                            >
                                {_.map(tripAOptions, (trip, tripId) => {
                                    return (
                                        <Select.Option
                                            style={{ background: trip.background, width: '100%' }}
                                            key={tripId}
                                            value={trip.trip_id}
                                            label={`${trip.time_run} - ${trip.license_plate}`}
                                        >
                                            <div
                                                style={{
                                                    width: "100%",
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    flexDirection: "row",
                                                }}
                                            >
                                                <div style={{ width: "30%" }}>{trip.time_run}</div>
                                                <div style={{ width: "30%" }}>{trip.day}</div>
                                                <div style={{ width: "30%" }}>{trip.not_code}</div>
                                                <div style={{ width: "20%" }}>{trip.license_plate}</div>
                                                <div style={{ width: "10%" }}>{trip.seats}</div>
                                                {/* <div style={{ width: "30%" }}>{trip.drivers}</div> */}
                                            </div>
                                        </Select.Option>
                                    );
                                })}
                            </Select>
                        </Col>
                        <Col span={8}>
                            <Select
                                style={{ width: '100%' }}
                                // dropdownMatchSelectWidth={false}
                                // dropdownStyle={{ width: 500, marginLeft: 100 }}
                                value={tripB}
                                // disabled={!routeSelect}
                                onChange={(item) => {
                                    setTripASelect(undefined)
                                    setTripBSelect(item)
                                    getList(item)
                                    setSelectedRowKeys([])
                                }}
                                allowClear showSearch showArrow
                                placeholder="Chọn chuyến chiều B"
                                filterOption={(input, option) => {
                                    try {
                                        return (
                                            option.label
                                                .toLowerCase()
                                                .indexOf(input.toLowerCase()) >= 0
                                        );
                                    } catch (error) { }
                                }}
                            >
                                {_.map(tripBOptions, (trip, tripId) => {
                                    return (
                                        <Select.Option
                                            style={{ background: trip.background }}
                                            key={tripId}
                                            value={trip.trip_id}
                                            label={`${trip.time_run} - ${trip.license_plate}`}
                                        >
                                            <div
                                                style={{
                                                    width: "100%",
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    flexDirection: "row",
                                                }}
                                            >
                                                <div style={{ width: "30%" }}>{trip.time_run}</div>
                                                <div style={{ width: "30%" }}>{trip.day}</div>
                                                <div style={{ width: "30%" }}>{trip.not_code}</div>
                                                <div style={{ width: "20%" }}>{trip.license_plate}</div>
                                                <div style={{ width: "10%" }}>{trip.seats}</div>
                                                {/* <div style={{ width: "30%" }}>{trip.drivers}</div> */}
                                            </div>
                                        </Select.Option>
                                    );
                                })}
                            </Select>
                        </Col>
                    </Row>
                </Col>

            </Row>
            <Row gutter={[16, 16]}>
                <Col span={12}>
                    <div className="title">Danh sách đơn hàng trong chuyến đi</div>
                </Col>
                <Col span={12}>
                    <div className="search d-flex flex-row">
                        <Input
                            onChange={(e) => {
                                let value = e.target.value;
                                if (value === '') {
                                    setData(dataFilter)
                                } else {
                                    const dataNew = dataFilter.filter((x) => x.id.slice(x.id.length - 4) === value)
                                    setData(dataNew)
                                }
                            }}
                            allowClear style={{ marginRight: 10 }}
                            placeholder="Tìm mã đơn hàng (search 4 số cuối)"
                        />
                        <Input
                            value={valueScanner}
                            placeholder="Bắn mã vạch |||||||||||"
                            title="Scan mã đơn hàng ở cột bên trái để chuyển"
                            onChange={async (e) => {
                                let value = e.target.value
                                await setScanner(value)
                                await data.map((item) => {
                                    if (item.id === value && item.shipment_order_status === 2) {
                                        const selectKeyNew = [...selectedRowKeys]
                                        selectKeyNew.push(value)
                                        setSelectedRowKeys(selectKeyNew)
                                    }
                                })
                                await setScanner("")

                            }}
                        />
                    </div>
                </Col>
            </Row>
            {
                selectedRowKeys.length > 1 ? (
                    <div className="d-flex flex-row" style={{ marginBottom: 10 }}>
                        <div style={{ paddingRight: 10, fontWeight: 'bold' }}>Thao tác với tất cả đơn hàng được chọn: </div>
                        <Select
                            style={{ width: 200 }}
                            onChange={async (value) => {
                                selectedRowKeys.map(async (item) => {
                                    let result = await ServiceBase.requestJson({
                                        baseUrl: API_BASE_URL,
                                        url: `/v1/shipments/${tripA ? tripA : tripB}/orders/${item}/delivering_reply`,
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
                                })

                            }}
                            placeholder="Thao tác">
                            <Option value={1}>Nhận hàng</Option>
                            {/* <Option value={2}>Từ chối</Option> */}
                        </Select>
                    </div>
                ) : null
            }
            <List
                getList={getList}
                tripA={tripA}
                tripB={tripB}
                loadding={loadding}
                dataSource={data}
                // dataSource={(tripA || tripB) ? data : []} 
                filters={filters}
                setSelectedRowKeys={setSelectedRowKeys}
                selectedRowKeys={selectedRowKeys} />
        </div>
    );
};
XeTuyen.propTypes = {
    className: PropTypes.any,
};

const mapStateToProps = createStructuredSelector({
    trip: makeSelectTrip(),
    route: makeSelectRoute(),
});
const withConnect = connect(
    mapStateToProps,
    null
);
export default withConnect(styled(XeTuyen)`
    .title {
        padding: 8px;
        font-weight: bold;
        font-size: 18px;
    }
    .search {

    }
  .top {
    margin: 9px 0;
  }
`);

