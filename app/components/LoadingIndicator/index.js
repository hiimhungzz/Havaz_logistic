/**
 * LoadingINdicator (Component)
 */

import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Dot from './Dot';
import Wrapper from './Wrapper';

function Loading() {
  return (
    <Wrapper>
      <Dot className="one">
        <FontAwesomeIcon icon="circle" />
      </Dot>
      <Dot className="two">
        <FontAwesomeIcon icon="circle" />
      </Dot>
      <Dot className="three">
        <FontAwesomeIcon icon="circle" />
      </Dot>
    </Wrapper>
  );
}

export default Loading;
