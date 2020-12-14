/**
 * Copyright 2020-present, TIENDUC.
 * All rights reserved.
 * @author ductt.it.hust@gmail.com on 27/06/2020.
 */

import React, { memo } from "react";
import styled from "styled-components";
import { formatNumber } from "utils/helper";

export const Order = styled(
  memo(({ className, style, order }) => {
    return (
      <div className={className} style={style}>
        <div className="order" style={{ borderLeft: order.get("isNew") ? "2px solid #108ee9" : '' }}>
          <div className="item orderId">
            {order.get("code")}
          </div>
          <div className="item number justify-content-center">
            {order.get("num_of_package")}
          </div>
          <div className="item vp">
            {order.getIn(["destination", "name"])}
          </div>
          <div className="item cod justify-content-center">
            {formatNumber( order.getIn(["order_fee", "amount"], 0) - order.get("discount", 0) + order.getIn(["cod_fee", "amount"], 0) + order.getIn(["r_shipping_fee", "amount"], 0) + order.getIn(["d_shipping_fee", "amount"], 0) )}
          </div>
        </div>
      </div>
    );
  })
)`
  padding: 5px 5px;
  .order {
    height:40px;
    box-shadow: 0 0 30px 0 rgba(82, 63, 105, 0.05);
    border-radius: 0.42rem;
    display: grid;
    grid-template-columns: 32% 10% 1fr 18%;
    border: 1px solid #e7e7e7;

    .item {
      padding: 0px 2px;
      display: flex;
      align-items: center;
      border-right: 0.5px solid #e7e7e7;
    }
    .orderId {
      flex: 4;
    }
    .number {
      flex: 2;
    }
    .vp {
      flex: 3;
    }
    .cod {
      flex: 3;
    }
  }
`;

export default Order;
