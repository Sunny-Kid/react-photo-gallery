import React, { PureComponent } from 'react';
import classNames from 'classnames';
import './index.less';

export default class ControllerUnit extends PureComponent {
  handleClick(e) {
    //如果点击的居中图片，则翻转；否则居中
    if (this.props.arrange.isCenter) {
      this.props.inverse();
    } else {
      this.props.center();
    }

    e.stopPropagation();
    e.preventDefault();
  }

  render() {
    const { arrange } = this.props;
    return (
      <span
        styleName={classNames('controller-unit', {
          'is-center': arrange.isCenter,
          'is-inverse': arrange.isInverse,
        })}
        onClick={this.handleClick.bind(this)}
      />
    );
  }
}
