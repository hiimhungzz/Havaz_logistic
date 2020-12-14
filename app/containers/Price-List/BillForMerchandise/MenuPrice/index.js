import PropTypes from "prop-types";
import React, { memo } from "react";
import styled from "styled-components";
import ItemMenuPrice from './ItemMenuPrice';

const MenuPrice = memo(({ className, menuPrice, onSelectItem, itemSelected }) => {
    return (
        menuPrice && menuPrice.map((item, index) => (
            <ItemMenuPrice item={item} key={index} onSelectItem={onSelectItem} itemSelected={itemSelected} />
        ))
    );
});
MenuPrice.propTypes = {
    className: PropTypes.any,
};
export default styled(MenuPrice)``;
