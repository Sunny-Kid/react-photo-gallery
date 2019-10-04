import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import './index.less';

export default function ControllerUnit(props) {
  const { arrange, inverse, center } = props;

  const handleClick = () => {
    //如果点击的居中图片，则翻转；否则居中
    if (arrange.isCenter) {
      inverse();
    } else {
      center();
    }
  };

  return (
    <span
      styleName={classNames('controller-unit', {
        'is-center': arrange.isCenter,
        'is-inverse': arrange.isInverse,
      })}
      onClick={handleClick}
    />
  );
}

ControllerUnit.propTypes = {
  arrange: PropTypes.shape({
    isCenter: PropTypes.bool,
    isInverse: PropTypes.bool,
    pos: PropTypes.shape({
      left: PropTypes.number,
      top: PropTypes.number,
    }),
    rotate: PropTypes.number,
  }),
  inverse: PropTypes.func,
  center: PropTypes.func,
};
