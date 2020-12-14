import { css } from 'styled-components';
import * as style from 'components/Variables';

const ScrollBarStyle = css`
  ::-webkit-scrollbar {
    width: 10px;
    height:10px;
    background: ${style.color.haiVan.scrollBar.bg};
  }
  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: ${style.color.haiVan.scrollBar.thumb.bg};
  }
`;

export default ScrollBarStyle;
