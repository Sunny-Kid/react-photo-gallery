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
  }

  initRefs() {
    this.stageRef = React.createRef();
    imageDatas.forEach((item, index) => {
      this[`imgFigureRef${index}`] = React.createRef();
    });
  }

  getImgPositionRange() {
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

    const ImgPositionRange = {
      // 中间图片的位置
      centerPos: {
        left: halfStageW - halfImgW,
        top: halfStageH - halfImgH,
      },
      // 水平方向上左右两侧图片范围
      hPosRange: {
        leftSecX: [-halfImgW, halfStageW - halfImgW * 3],
        rightSecX: [halfStageW + halfImgW, stageW - halfImgW],
        y: [-halfImgH, stageH - halfImgH],
      },
      // 垂直方向上顶部图片范围
      vPosRange: {
        x: [halfStageW - imgW, halfStageW],
        topY: [-halfImgH, halfStageH - halfImgH * 3],
      },
    };
    return ImgPositionRange;
  }

  componentDidMount() {
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
      imgArrangeArr,
    });
  };

  /**
   * 利用rearrange函数，居中对应index的图片
   * @param index ，需要居中的图片index
   */
  center = index => {
    this.rearrange(index);
  };

  arrangeTopImgs(imgArrangeArr, { vPosRangeTopY, vPosRangeX }) {
    let imgsArrangeTopArr = [];
    //上侧图片的数值，可有可无。0或者1
    const topImgNum = Math.floor(Math.random() * 2);
    //上侧图片是从哪个位置拿出来的
    let topImgSpliceIndex = 0;
    //取出要布局上侧图片的状态信息
    topImgSpliceIndex = Math.ceil(Math.random() * (imgArrangeArr.length - topImgNum));
    imgsArrangeTopArr = imgArrangeArr.splice(topImgSpliceIndex, topImgNum);
    //布局上侧图片
    imgsArrangeTopArr = imgsArrangeTopArr.map(value => {
      value = {
        pos: {
          top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
          left: getRangeRandom(vPosRangeX[0], vPosRangeX[1]),
        },
        rotate: getDegRandom(),
        isCenter: false,
      };
      return value;
    });
    return { imgsArrangeTopArr, topImgSpliceIndex };
  }

  arrangeCenterImg(imgArrangeArr, { centerIndex, centerPos }) {
    //中心图片的状态信息
    const imgsArrangeCenterArr = imgArrangeArr.splice(centerIndex, 1);
    //居中 centerIndex
    imgsArrangeCenterArr[0] = {
      pos: centerPos,
      rotate: 0,
      isCenter: true,
    };
    return { imgsArrangeCenterArr };
  }

  arrangeLeftAndRightImgs(imgArrangeArr, { hPosRangeLeftSecX, hPosRangeRightSecX, hPosRangeY }) {
    //布局左右两侧的图片
    for (let i = 0, j = imgArrangeArr.length, k = j / 2; i < j; i++) {
      let hPosRangeX; //左区域或者右区域的取值范围

      //前半部分布局左边，右半部分布局右边
      if (i < k) {
        hPosRangeX = hPosRangeLeftSecX;
      } else {
        hPosRangeX = hPosRangeRightSecX;
      }
      imgArrangeArr[i] = {
        pos: {
          top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
          left: getRangeRandom(hPosRangeX[0], hPosRangeX[1]),
        },
        rotate: getDegRandom(),
        isCenter: false,
      };
    }
  }

  /**
   * 重新布局图片，传入居中的index
   */
  rearrange(centerIndex) {
    let imgArrangeArr = this.state.imgArrangeArr.slice();
    const imgPositionRange = this.getImgPositionRange();
    const { centerPos, hPosRange, vPosRange } = imgPositionRange;
    const { leftSecX: hPosRangeLeftSecX, rightSecX: hPosRangeRightSecX, y: hPosRangeY } = hPosRange;
    const { x: vPosRangeX, topY: vPosRangeTopY } = vPosRange;

    const { imgsArrangeCenterArr } = this.arrangeCenterImg(imgArrangeArr, {
      centerIndex,
      centerPos,
    });

    const { imgsArrangeTopArr, topImgSpliceIndex } = this.arrangeTopImgs(imgArrangeArr, {
      vPosRangeTopY,
      vPosRangeX,
    });

    this.arrangeLeftAndRightImgs(imgArrangeArr, {
      hPosRangeLeftSecX,
      hPosRangeRightSecX,
      hPosRangeY,
    });

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
