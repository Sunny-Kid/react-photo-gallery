import React from 'react';
import './index.less';

const ImgFigure = React.forwardRef((props, ref) => {
  /*
   * ImgFigure 的点击处理函数
   */
  const handleClick = e => {
    if (props.arrange.isCenter) {
      props.inverse();
    } else {
      props.center();
    }

    e.stopPropagation();
    e.preventDefault();
  };

  let styleObj = {};

  //如果props有指定值则使用
  if (props.arrange.pos) {
    styleObj = Object.assign({}, props.arrange.pos);
  }

  //如果图片旋转角度有值，且不是0
  if (props.arrange.rotate) {
    ['MozTransform', 'msTransform', 'WebkitTransform', 'transform'].forEach(
      function(value) {
        styleObj[value] = 'rotate(' + props.arrange.rotate + 'deg)';
      }.bind(this)
    );
  }

  //添加z-index 避免遮盖
  if (props.arrange.isCenter) {
    styleObj.zIndex = 11;
  } else {
    styleObj.zIndex = 0;
  }

  let igmFigureClassName = 'img-figure';
  igmFigureClassName += props.arrange.isInverse ? ' is-inverse' : '';

  return (
    <figure
      styleName={igmFigureClassName}
      // style={styleObj}
      ref={ref}
      onClick={handleClick}
    >
      <img styleName="img-back" src={props.data.imageURL} alt={props.data.title} />
      <figcaption>
        <h2 styleName="img-title">{props.data.title}</h2>
        <div styleName="img-back" onClick={handleClick}>
          <p>{props.data.desc}</p>
        </div>
      </figcaption>
    </figure>
  );
});

export default ImgFigure;
