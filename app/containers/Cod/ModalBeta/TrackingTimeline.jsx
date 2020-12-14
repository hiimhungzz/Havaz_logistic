/**
 * Input (Styled Component)
 */
import React, {useCallback} from "react";
import { Row, Col, Divider, Timeline } from "antd";
import { ClockCircleOutlined, CheckCircleOutlined, CheckCircleFilled   } from '@ant-design/icons';
import _ from "lodash"

const Tracking = ({ 
    tabActive
}) => {
    const timelineList = [
        {
            index: 2,
            type: 'TEXT',
            time: "06:30 PM",
            text: "Nhận hàng tại Quận cầu giấy"
        },
        {
            index: 2,
            type: 'DATE',
            time: "06:30 PM",
            text: "21 July 2020"
        },
        {
            index: 1,
            type: 'TEXT',
            time: "05:14 AM",
            text: "Hàng đến Sơn la"
        },
        {
            index: 0,
            type: 'TEXT',
            time: "01:14 AM",
            text: "Nhận hàng"
        }
      ]
    const timeline = (
        <Timeline mode="left">
        <Timeline.Item color="green" style={{"paddingBottom": "60px"}}></Timeline.Item>
        {
            _.map(timelineList, (i)=> {
                let contentTimeline
                if(i['type'] === 'DATE'){
                    contentTimeline = (
                        <Timeline.Item key={i['index']} style={{"paddingBottom": "85px"}} key={i['time']} dot={
                            <div style={{background: "#5b5656", borderRadius: "5px", color: "white", width: "145px", height: "23px", paddingTop: "4px"}} >
                                <span>{i['text']}</span>
                            </div>
                        } >
                        </Timeline.Item>
                    )
                } else {
                    contentTimeline = (
                        <Timeline.Item key={i['index']} style={{"paddingBottom": "50px"}} key={i['time']} color="green" dot={<CheckCircleFilled style={{ fontSize: '16px' }} />} label={i['time']}>
                            {i['text']}
                        </Timeline.Item>
                    )
                }
                return (
                    contentTimeline
                )
            })
        }
        <Timeline.Item key="root" style={{"paddingBottom": "50px"}} color="green" label={""}></Timeline.Item>
        </Timeline>
    )
    return (
        <Row justify="start">
            <Col span={21} offset={1} style={{"marginTop": "4px"}}>
                <div style={{"borderColor": '#b1b7bc #b1b7bc #85ba76', "borderStyle": "solid", "borderWidth": "1.5px 1.5px 4px", "borderRadius": "5px"}}>
                    <Row justify="start" gutter={[8, 8]} style={{"margin" : "10px 21px 10px"}}>
                    <Col span={20} offset={2}>
                        <p style={{"maxHeight" : "8px", "fontSize": "20px", "color": "#11bb4c"}}>Departed from facility</p>
                        <p style={{"maxHeight" : "8px"}}>Web, 22 July at 06:30 PM</p>
                        <p style={{"maxHeight" : "8px"}}>Quận cầu giấy</p>
                    </Col>
                    </Row>
                    <Divider dashed style={{borderWidth: "1.5px"}}/>
                    <Row justify="start" gutter={[8, 8]} style={{"margin" : "10px 21px 10px"}}>
                    <Col span={2}>
                        From:
                    </Col>
                    <Col span={10}>
                        <p style={{"maxHeight" : "5px"}}>BINH DUONG</p>
                        <p style={{"maxHeight" : "5px"}}>VIET NAM</p>
                    </Col>
                    <Col span={2}>
                        To:
                    </Col>
                    <Col span={10}>
                        <p style={{"maxHeight" : "5px"}} >QUẬN CẦU GIẤY</p>
                        <p style={{"maxHeight" : "5px"}}>VIET NAM</p>
                    </Col>
                    </Row>
                </div>
            </Col>
            <Col span={10}>
                <div style={{'marginTop': '-6px', marginLeft: "-12em"}}>
                    {timeline}
                </div>
            </Col>
        </Row>
    )
};
  
  export default Tracking;