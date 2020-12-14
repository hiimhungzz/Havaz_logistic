/**
 * Input (Styled Component)
 */
import React, {useCallback} from "react";
import { Row, Col, Divider, Timeline } from "antd";
import { ClockCircleOutlined, CheckCircleOutlined, CheckCircleFilled   } from '@ant-design/icons';
import moment from "moment";
import _ from "lodash"
const convertData = function(points) {
    // // console.log('points', points)
    let dataPoints = [],
        obj = {};
    _.forEach(points, (i) => {
        // i = {...i,date: moment(i['time']).format('DD-MM-YYYY')}
        i['date'] = moment(i['time']).format('DD-MM-YYYY')
    })
    // console.log('points sau convert', points)
    let groupDate = _.groupBy(points, 'date')
    // console.log(groupDate)
    
    _.forEach(groupDate, (v, k) => {
        
        _.forEach(v, (i) => {
            // console.log(i['time'])
            i['strTime'] = moment(i['time']).format('HH:mm')
            dataPoints.unshift(i)
            obj = i
        })
        dataPoints.unshift({
            event : "DATE",
            time: k,
            description: ""
        })
    })
    return {dataPoints, obj};
}
const Tracking = ({ 
    tabActive,
    tracking
}) => {
    // console.log('tracking',tracking)
    const { points } = tracking;
    let {dataPoints, obj} = convertData(points)
    console.log(obj)
    const timeline = (
        <Timeline mode="left">
        <Timeline.Item color="green" style={{"paddingBottom": "60px"}}></Timeline.Item>
        {
            _.map(dataPoints, (i)=> {
                let contentTimeline
                if(i['event'] === 'DATE'){
                    contentTimeline = (
                        <Timeline.Item key={i['index']} style={{"paddingBottom": "85px"}} key={i['time']} dot={
                            <div style={{background: "#5b5656", borderRadius: "5px", color: "white", width: "145px", height: "23px", paddingTop: "4px"}} >
                                <span>{i['time']}</span>
                            </div>
                        } >
                        </Timeline.Item>
                    )
                } else if (i.time != obj.time && i.event != obj.event) {
                    contentTimeline = (
                        <Timeline.Item 
                            key={i['time']} 
                            style={{"paddingBottom": "50px"}} 
                            color="green" 
                            dot={<CheckCircleFilled style={{ fontSize: '16px' }}/>} 
                            label={i['strTime'] }>
                                {i['description']}
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
                        <p style={{"maxHeight" : "8px", "fontSize": "20px", "color": "#11bb4c"}}>{obj['description']}</p>
                        <p style={{"maxHeight" : "8px"}}> {moment(obj['time']).format('DD-MM-YYYY HH:mm')} </p>
                        <p style={{"maxHeight" : "8px"}}>  </p>
                    </Col>
                    </Row>
                    <Divider dashed style={{borderWidth: "1.5px"}}/>
                    <Row justify="start" gutter={[8, 8]} style={{"margin" : "10px 21px 10px"}}>
                    <Col span={2}>
                        From:
                    </Col>
                    <Col span={10}>
                        <p style={{"maxHeight" : "5px"}}></p>
                        <p style={{"maxHeight" : "5px"}}></p>
                    </Col>
                    <Col span={2}>
                        To:
                    </Col>
                    <Col span={10}>
                        <p style={{"maxHeight" : "5px"}} >{obj?.hub?.name} </p>
                        <p style={{"maxHeight" : "5px"}}>  </p>
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