/* eslint-disable no-underscore-dangle */
import PropTypes from 'prop-types';
import React, { memo } from 'react';
import styled from 'styled-components';
import { Breadcrumb, Tooltip } from 'antd';
import { Link } from 'react-router-dom';
import { defineMessages, FormattedMessage } from 'react-intl';
import { EyeOutlined, } from '@ant-design/icons'
import {
  QuestionCircleOutlined,
} from '@ant-design/icons';

import * as style from 'components/Variables';
const prefix = 'app.routing.';
function Footer({ className, pathName }) {
  const _messages = defineMessages({
    moduleName: {
      id: `${prefix}${pathName}`,
      defaultMessage: 'Không tìm thấy trang',
    },
  });

  // const renderTooltip = () => {
  //   if (pathName === '/bao-cao/doanh-thu-van-phong-nhan') {
  //     return (
  //       <span>
  //         <Tooltip placement="bottom" title="Logic báo cáo doanh thu theo VP nhận: Tạo đơn thì tính doanh thu cho VP theo ngày nhận đơn; Hủy đơn, trừ doanh thu vào ngày nhận đơn hàng ">
  //           <QuestionCircleOutlined />
  //         </Tooltip>
  //       </span>
  //     )
  //   } else null
  // }


  const renderTooltip = (pathName) => {
    switch (pathName) {

      case '/bao-cao/doanh-thu-van-phong-nhan':
        return (
          <span style={{ display: "inline-flex" }}>
            <Tooltip placement="bottom"
              title={<div>Logic báo cáo doanh thu theo VP nhận:
                <div>   - Tạo đơn thì tính doanh thu cho VP theo ngày nhận đơn</div>
                <div>- Hủy đơn, trừ doanh thu vào ngày nhận đơn hàng</div>
              </div>}
            >
              <QuestionCircleOutlined />
            </Tooltip>
          </span>
        )
      case '/bao-cao/danh-sach-hang-nhan':
        return (
          <span style={{ display: "inline-flex" }}>
            <Tooltip placement="bottom" title={<div>Danh sách hàng nhận:
              <div>- Danh sách đơn hàng nhận của toàn bộ các VP</div>
              <div>- Cứ tạo đơn là vào danh sách</div>
              <div>- Bao gồm cả các đơn hủy hàng</div>
            </div>}>
              <QuestionCircleOutlined />
            </Tooltip>
          </span>
        )
      case '/bao-cao/danh-sach-hang-phat':
        return (
          <span style={{ display: "inline-flex" }}>
            <Tooltip placement="bottom"
              title={<div>Danh sách hàng phát:
              <div>- Danh sách đơn hàng phát của toàn bộ các VP</div>
                <div>-  Cứ phát thành công là vào danh sách</div>
                <div>- Filter theo ngày phát hàng</div>
                <div>- Filter theo văn phòng phát hàng thực tế</div>
              </div>}>
              <QuestionCircleOutlined />
            </Tooltip>
          </span>
        )
      case '/orders/all':
        return (
          <span style={{ display: "inline-flex" }}>
            <Tooltip placement="bottom"
              title={<div>Logic kho tổng:
              <div>- Hiển thị toàn bộ đơn hàng hiện có trong văn phòng( bao gồm toàn bộ đơn tồn xuất + tồn phát)</div>
                <div>- Là tổ hợp của 2 tab KHO KẾT NỐI + HÀNG PHÁT</div>
                <div>- Gồm các tính năng:
                  <ul style={{ listStyleType: "disc" }}>
                    <li>Gửi sms</li>
                    <li>Phát hàng</li>
                    <li>Cập nhật mất hỏng</li>
                  </ul>
                </div>
              </div>}>
              <QuestionCircleOutlined />
            </Tooltip>
          </span>
        )

      case '/bao-cao/hang-nhan':
        return (
          <span style={{ display: "inline-flex" }}>
            <Tooltip placement="bottom"
              title={<div>Báo cáo hàng nhận  :
              <div>- Số đơn: Tính cả đơn hủy</div>
                <div>- Các cột tiền: Không tính tiền đơn hủy</div>
              </div>}>
              <QuestionCircleOutlined />
            </Tooltip>
          </span>
        )
      default: null
    }
  }


  return <Breadcrumb className={className} separator="/">
    <Breadcrumb.Item>
      <Link to="/">
        <span>Trang chủ</span>
      </Link>
    </Breadcrumb.Item>
    <Breadcrumb.Item>
      <Link to={pathName}>
        <FormattedMessage {..._messages.moduleName} />
      </Link> &nbsp;
      {renderTooltip(pathName)}
    </Breadcrumb.Item>
  </Breadcrumb>
}

Footer.propTypes = {
  className: PropTypes.any,
  pathName: PropTypes.any,
};

export default memo(styled(Footer)`
  padding: 0 0 8px 0 !important;
  a {
    color: ${style.color.haiVan.primary};
    font-weight: bold;
    font-size: ${style.fontsize.reg};
  }
  a:hover {
    color: ${style.color.haiVan.bg} !important;
  }
`);
