// import React, { useCallback, useEffect, useState } from "react";
// import Filter from "./Filter";
// import TableContent from "./TableContent";
// import { Col, Row, Table, Tag } from "antd";
// import styled from "styled-components";
// import PropTypes from "prop-types";
// import ServiceBase from "utils/ServiceBase";
// import { URI } from "utils/constants";
// import { Ui } from "utils/Ui";
// import { set } from "lodash";
// import moment from "moment";


// /**
//  * Báo cáo công nợ theo xe 
//  *  
//  * 
//  * 
//  */

// const congNoTheoXe = ({ className }) => {
//     const [data, setData] = useState([]);
//     const [isShowModal, setShowModal] = useState(false);
//     const [loadding, setLoading] = useState(false);
//     const [params, setParams] = useState({
//         startAt: moment(),
//         endAt: moment(),
//         vehicleId: null
//     });

//     return (
//         <Row className={className} gutter={[16, 16]}>
//             <Col xs={24}>
//                 <Filter setParams={setParams} params={params} definitions={definitions} />
//             </Col>
//             <div className="container" style={{ padding: 8 }}>
//                 <div className="content">
//                     <Spin spinning={loadding}>
//                         <TableContent
//                             setParams={setParams}
//                             data={data}
//                             params={params}
//                         />
//                     </Spin>
//                 </div>
//             </div>
//         </Row>
//     )
// }

// congNoTheoXe.propTypes = {
//     className: PropTypes.any,
// };
// export default styled(congNoTheoXe)``;

// import { Button, Col, Drawer, Row, Space, Spin } from "antd";
// import { makeSelectDefinitions } from "containers/App/selectors";
// import moment from "moment";
// import PropTypes from "prop-types";
// import React, { useCallback, useEffect, useState } from "react";
// import { connect } from "react-redux";
// import { createStructuredSelector } from "reselect";
// import styled from "styled-components";
// import { URI } from "utils/constants";
// import ServiceBase from "utils/ServiceBase";
// import { Ui } from "utils/Ui";
// import CollectModal from './CollectModal';
// import Filter from "./Filter";
// import TableContent from "./TableContent";

// const congNoTheoXe = ({ className, definitions }) => {
//     const [data, setData] = useState([]);
//     const [isShowModal, setShowModal] = useState(false);
//     const [loadding, setLoading] = useState(false);
//     const [itemSelected, setItemSelected] = useState([]);
//     const [SourceOption, SetObjOption] = useState([]);
//     const getListStaff = useCallback(async (data) => {
//         const result = await ServiceBase.requestJson({
//             method: 'GET',
//             url: URI['URI_STAFF_LIST'],
//             data: {
//                 page: 1,
//                 per_page: 40,
//                 active: 1,
//             },
//         });
//         if (result.hasErrors) {
//             Ui.showErrors(result.errors);
//         } else {
//             SetObjOption(result.value.data)
//         }
//     })

//     const [params, setParams] = useState({
//         type: undefined,
//         status: undefined,
//         staff_id: "",
//         day_from: moment().add(-1, 'weeks').endOf('week'),
//         day_to: moment(),
//     });

//     const getListBill = useCallback(async () => {
//         setLoading(true);
//         const result = await ServiceBase.requestJson({
//             method: "GET",
//             url: "v1/bills",
//             data: {
//                 ...params,
//                 day_from: moment(params.day_from).format("YYYY-MM-DD"),
//                 day_to: moment(params.day_to).format("YYYY-MM-DD")
//             },
//         });
//         if (result.hasErrors) {
//             Ui.showErrors(result.errors);
//         } else {
//             setData(result.value.data);
//         }
//         await setLoading(false);
//     }, [params]);

//     const onCheckBill = useCallback(async () => {
//         if (itemSelected.length > 0) {
//             for (const item of itemSelected) {
//                 let result = await ServiceBase.requestJson({
//                     url: `v1/bills/${item}/check`,
//                     data: {
//                         note: ' fsd'
//                     },
//                     method: "POST",
//                 });
//                 if (result.value) {

//                 } else {
//                     Ui.showError({ message: `Mã đơn ${item} không kiểm tra được` });
//                 }
//             }
//             await getListBill();
//             Ui.showSuccess({
//                 message: "Hoàn tất quá trình kiểm tra",
//             });
//         } else {
//             Ui.showWarning({ message: "Vui lòng chọn 1 đơn hàng" })
//         }

//     }, [itemSelected]);


//     useEffect(() => {
//         getListBill();
//     }, [getListBill]);

//     useEffect(() => {
//         getListStaff()
//     }, [])
//     return (
//         <>
//             <Col xs={24}>
//                 <Filter setParams={setParams} params={params} SourceOption={SourceOption} definitions={definitions} setItemSelected={setItemSelected} />
//             </Col>
//             <div className="container" style={{ padding: 8 }}>
//                 <div className="content">
//                     <Spin spinning={loadding}>
//                         <TableContent
//                             setParams={setParams}
//                             data={data}
//                             params={params}
//                             definitions={definitions}
//                         />
//                     </Spin>
//                 </div>
//             </div>

//         </>
//     );
// };
// congNoTheoXe.propTypes = {
//     className: PropTypes.any,
// };
// const mapStateToProps = createStructuredSelector({
//     definitions: makeSelectDefinitions(),
// });
// const withConnect = connect(
//     mapStateToProps,
//     null
// );
// export default styled(withConnect(congNoTheoXe))`

// `;
