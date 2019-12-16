import React, { useRef, useState, useEffect, useCallback } from 'react';
import ImgFigure from './ImgFigure';
import ControllerUnit from './ControllerUnit';
import { imageDatas, arrangeCenterImg, arrangeTopImgs, arrangeLeftAndRightImgs, getImgArrangeArr } from './utils';
import '../styles/index.less';

export default function AppComponent() {
  const [imgArrangeArr, setImgArrangeArr] = useState(getImgArrangeArr());

  const stageRef = useRef(null);
  const initImgFigureRefs = [];

  imageDatas.forEach(() => initImgFigureRefs.push(React.createRef()));
  const imgFigureRefs = useRef(initImgFigureRefs);

  const inverse = useCallback(
    index => {
      let imgArranges = imgArrangeArr.slice();
      imgArranges[index].isInverse = !imgArranges[index].isInverse;
      setImgArrangeArr(imgArranges);
    },
    [imgArrangeArr],
  );

  useEffect(() => {
    rearrange(0);
  }, [rearrange]);

  /**
   * 利用rearrange函数，居中对应index的图片
   * @param index ，需要居中的图片index
   */
  const center = useCallback(
    index => {
      rearrange(index);
    },
    [rearrange],
  );

  /**
   * 重新布局图片，传入居中的index
   */
  const rearrange = useCallback(
    centerIndex => {
      let imgArranges = imgArrangeArr.slice();
      const imgPositionRange = getImgPositionRange();
      const { centerPos, hPosRange, vPosRange } = imgPositionRange;
      const { leftSecX: hPosRangeLeftSecX, rightSecX: hPosRangeRightSecX, y: hPosRangeY } = hPosRange;
      const { x: vPosRangeX, topY: vPosRangeTopY } = vPosRange;

      const { imgsArrangeCenterArr } = arrangeCenterImg(imgArranges, {
        centerIndex,
        centerPos,
      });

      const { imgsArrangeTopArr, topImgSpliceIndex } = arrangeTopImgs(imgArranges, {
        vPosRangeTopY,
        vPosRangeX,
      });

      arrangeLeftAndRightImgs(imgArranges, {
        hPosRangeLeftSecX,
        hPosRangeRightSecX,
        hPosRangeY,
      });

      //把取出来的图片放回去
      if (imgsArrangeTopArr && imgsArrangeTopArr[0]) {
        imgArranges.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
      }
      imgArranges.splice(centerIndex, 0, imgsArrangeCenterArr[0]);
      setImgArrangeArr(imgArranges);
    },
    [imgArrangeArr],
  );

  const getImgPositionRange = () => {
    //得到舞台的大小
    const stageDOM = stageRef.current;
    const stageW = stageDOM.scrollWidth;
    const stageH = stageDOM.scrollHeight;
    const halfStageW = Math.ceil(stageW / 2);
    const halfStageH = Math.ceil(stageH / 2);

    //得到imgFigure的大小
    const imgFigureDom = imgFigureRefs.current[0].current;
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
  };

  const renderImgFigures = () => {
    return imageDatas.map((value, index) => (
      <ImgFigure
        data={value}
        ref={imgFigureRefs.current[index]}
        key={value.index}
        arrange={imgArrangeArr[index]}
        inverse={inverse.bind(this, index)}
        center={center.bind(this, index)}
      />
    ));
  };

  const renderControllerUnits = () => {
    return imageDatas.map((value, index) => (
      <ControllerUnit
        key={value.index}
        arrange={imgArrangeArr[index]}
        inverse={inverse.bind(this, index)}
        center={center.bind(this, index)}
      />
    ));
  };

  return (
    <section styleName="stage" ref={stageRef}>
      <section styleName="img-sec"> {renderImgFigures()} </section>
      <nav styleName="controller-nav"> {renderControllerUnits()} </nav>
    </section>
  );
}
