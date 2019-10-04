import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import './index.less';

const ImgFigure = React.forwardRef((props, ref) => {
  const { arrange, inverse, center, data } = props;

  const handleClick = () => {
    if (arrange.isCenter) {
      inverse();
    } else {
      center();
    }
  };

  const getStyle = () => {
    let style = {};
    //如果props有指定值则使用
    if (arrange.pos) {
      style = Object.assign({}, arrange.pos);
    }
    //如果图片旋转角度有值，且不是0
    if (arrange.rotate) {
      style.transform = `rotate(${arrange.rotate}deg)`;
    }
    //添加z-index 避免遮盖
    if (arrange.isCenter) {
      style.zIndex = 11;
    } else {
      style.zIndex = 0;
    }
    return style;
  };

  return (
    <figure
      styleName={classNames('img-figure', {
        'is-inverse': arrange.isInverse,
      })}
      style={getStyle()}
      ref={ref}
      onClick={handleClick}
    >
      <img styleName="img-back" src={data.imageURL} alt={data.title} />
      <figcaption>
        <h2 styleName="img-title">{data.title}</h2>
        <div styleName="img-back">
          <p>{data.desc}</p>
        </div>
      </figcaption>
    </figure>
  );
});

ImgFigure.propTypes = {
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
  data: PropTypes.shape({
    imageURL: PropTypes.string,
    title: PropTypes.string,
    desc: PropTypes.string,
  }),
};

export default ImgFigure;
