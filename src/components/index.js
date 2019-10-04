import React, { PureComponent } from 'react';
import ImgFigure from './ImgFigure';
import ControllerUnit from './ControllerUnit';
import { transformToImgUrl, getRangeRandom, getDegRandom } from '../utils/data';
import '../styles/index.less';

//获取图片数据，将图片名信息转成url路径
let imageDatas = require('../data/imgdata.json');

imageDatas = transformToImgUrl(imageDatas);

export default class AppComponent extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      imgArrangeArr: this.getImgArrangeArr(),
    };

    this.initRefs();

    this.Constant = {
      //常量的key ？
      centerPos: {
        left: 0,
        right: 0,
      },
      hPosRange: {
        //水平方向取值范围
        leftSecX: [0, 0],
        rightSecX: [0, 0],
        y: [0, 0],
      },
      vPosRange: {
        //垂直方向取值范围
        x: [0, 0],
        topY: [0, 0],
      },
    };
  }

  initRefs() {
    this.stageRef = React.createRef();
    imageDatas.forEach((item, index) => {
      this[`imgFigureRef${index}`] = React.createRef();
    });
  }

  componentDidMount() {
    /*组件加载后，计算图片范围*/
    //得到舞台的大小
    const stageDOM = this.stageRef.current;
    const stageW = stageDOM.scrollWidth;
    const stageH = stageDOM.scrollHeight;
    const halfStageW = Math.ceil(stageW / 2);
    const halfStageH = Math.ceil(stageH / 2);
    //得到imgFigure的大小
    const imgFigureDom = this.imgFigureRef0.current;
    const imgW = imgFigureDom.scrollWidth;
    const imgH = imgFigureDom.scrollHeight;
    const halfImgW = Math.ceil(imgW / 2);
    const halfImgH = Math.ceil(imgH / 2);
    this.Constant.centerPos = {
      left: halfStageW - halfImgW,
      top: halfStageH - halfImgH,
    };

    //计算左右侧，图片位置取值范围
    this.Constant.hPosRange.leftSecX[0] = -halfImgW;
    this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
    this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
    this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
    this.Constant.hPosRange.y[0] = -halfImgH;
    this.Constant.hPosRange.y[1] = stageH - halfImgH;

    //计算上侧，图片位置的取值范围
    this.Constant.vPosRange.topY[0] = -halfImgH;
    this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
    this.Constant.vPosRange.x[0] = halfStageW - imgW;
    this.Constant.vPosRange.x[1] = halfStageW;
    this.rearrange(0);
  }

  /**
   * 翻转图片
   * @params index 输入当前被执行inverse操作的图片对应的index
   */
  inverse = index => {
    let imgArrangeArr = this.state.imgArrangeArr.slice();
    imgArrangeArr[index].isInverse = !imgArrangeArr[index].isInverse;
    this.setState({
      imgArrangeArr: imgArrangeArr,
    });
  };

  /**
   * 利用rearrange函数，居中对应index的图片
   * @param index ，需要居中的图片index
   */
  center = index => {
    this.rearrange(index);
  };

  /**
   * 重新布局图片，传入居中的index
   */
  rearrange(centerIndex) {
    let imgArrangeArr = this.state.imgArrangeArr.slice(),
      Constant = this.Constant,
      centerPos = Constant.centerPos,
      hPosRange = Constant.hPosRange,
      vPosRange = Constant.vPosRange,
      hPosRangeLeftSecX = hPosRange.leftSecX,
      hPosRangeRightSecX = hPosRange.rightSecX,
      vPosRangeTopY = vPosRange.topY,
      vPosRangeX = vPosRange.x,
      imgsArrangeTopArr = [],
      //上侧图片的数值，可有可无。0或者1
      topImgNum = Math.floor(Math.random() * 2),
      //上侧图片是从哪个位置拿出来的
      topImgSpliceIndex = 0,
      //中心图片的状态信息
      imgsArrangeCenterArr = imgArrangeArr.splice(centerIndex, 1);
    //居中 centerIndex
    imgsArrangeCenterArr[0] = {
      pos: centerPos,
      rotate: 0,
      isCenter: true,
    };

    //取出要布局上侧图片的状态信息
    topImgSpliceIndex = Math.ceil(Math.random() * (imgArrangeArr.length - topImgNum));
    imgsArrangeTopArr = imgArrangeArr.splice(topImgSpliceIndex, topImgNum);

    //布局上侧图片
    imgsArrangeTopArr.forEach(function(value, index) {
      imgsArrangeTopArr[index] = {
        pos: {
          top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
          left: getRangeRandom(vPosRangeX[0], vPosRangeX[1]),
        },
        rotate: getDegRandom(),
        isCenter: false,
      };
    });

    //布局左右两侧的图片
    for (let i = 0, j = imgArrangeArr.length, k = j / 2; i < j; i++) {
      let hPosRangeLORX = null; //左区域或者右区域的取值范围

      //前半部分布局左边，右半部分布局右边
      if (i < k) {
        hPosRangeLORX = hPosRangeLeftSecX;
      } else {
        hPosRangeLORX = hPosRangeRightSecX;
      }
      imgArrangeArr[i] = {
        pos: {
          top: getRangeRandom(hPosRange.y[0], hPosRange.y[1]),
          left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1]),
        },
        rotate: getDegRandom(),
        isCenter: false,
      };
    }

    //把取出来的图片放回去
    if (imgsArrangeTopArr && imgsArrangeTopArr[0]) {
      imgArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
    }
    imgArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);
    this.setState({
      imgArrangeArr,
    });
  }

  getImgArrangeArr() {
    let imgArranges = [];
    imageDatas.forEach((value, index) => {
      imgArranges[index] = {
        pos: {
          left: 0,
          top: 0,
        },
        rotate: 0,
        isInverse: false,
        isCenter: false,
      };
    });
    return imgArranges;
  }

  renderImgFigures() {
    const { imgArrangeArr } = this.state;
    return imageDatas.map((value, index) => (
      <ImgFigure
        data={value}
        ref={this[`imgFigureRef${index}`]}
        key={index}
        arrange={imgArrangeArr[index]}
        inverse={() => {
          this.inverse(index);
        }}
        center={() => {
          this.center(index);
        }}
      />
    ));
  }

  renderControllerUnits() {
    const { imgArrangeArr } = this.state;
    return imageDatas.map((value, index) => (
      <ControllerUnit
        key={index}
        arrange={imgArrangeArr[index]}
        inverse={() => {
          this.inverse(index);
        }}
        center={() => {
          this.center(index);
        }}
      />
    ));
  }

  render() {
    return (
      <section styleName="stage" ref={this.stageRef}>
        <section styleName="img-sec"> {this.renderImgFigures()} </section>
        <nav styleName="controller-nav"> {this.renderControllerUnits()} </nav>
      </section>
    );
  }
}
