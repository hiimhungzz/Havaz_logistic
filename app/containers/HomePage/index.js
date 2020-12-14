/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 *
 */

import React from 'react';
import { Carousel } from 'antd';
import Img from 'components/Img/Loadable';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const HomePage = ({ className }) => (
  <Carousel autoplay autoplaySpeed={5000} className={className}>
    <div>
      <Img
        alt="HAI VAN"
        className="image"
        src="https://haivan.com/images/20200323/Desktop.jpg"
      />
    </div>
    <div>
      <Img
        alt="HAI VAN"
        className="image"
        src="https://haivan.com/images/20200323/Desktop.jpg"
      />
    </div>
    <div>
      <Img
        alt="HAI VAN"
        className="image"
        src="https://haivan.com/images/20200323/Desktop.jpg"
      />
    </div>
  </Carousel>
);
HomePage.propTypes = {
  className: PropTypes.any,
};
export default styled(HomePage)`
  .ant-carousel .slick-slide {
    text-align: center;
    height: 160px;
    line-height: 160px;
    background: #364d79;
    overflow: hidden;
    .image {
      width: 100%;
    }
  }
`;
