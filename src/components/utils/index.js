//获取图片数据，将图片名信息转成url路径
imageDatas = require('../../data/imgdata.json');

imageDatas = transformToImgUrl(imageDatas);

export let imageDatas;

export function transformToImgUrl(imgDatasArr) {
  if (!Array.isArray(imgDatasArr)) return [];
  const serializedImgDatas = imgDatasArr.slice();
  for (let i = 0; i < serializedImgDatas.length; i++) {
    let imgData = serializedImgDatas[i];
    imgData.imageURL = require('../../assets/images/' + imgData.fileName);
  }
  return serializedImgDatas;
}

export const noop = () => {};

/*
 * 获取区间内随机值
 */
export function getRangeRandom(low, high) {
  return Math.ceil(Math.random() * (high - low) + low);
}

/*
 * 获取旋转角度的范围
 */
export function getDegRandom(baseDeg = 30) {
  const randomValue = Number((Math.random() > 0.5 ? '' : '-') + Math.ceil(Math.random() * baseDeg));
  return isNaN(randomValue) ? 0 : randomValue;
}

/**
 * 中间图片的布局
 */
export function arrangeCenterImg(imgArrangeArr, { centerIndex, centerPos }) {
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

/**
 * 顶部图片的布局
 */
export function arrangeTopImgs(imgArrangeArr, { vPosRangeTopY, vPosRangeX }) {
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

/**
 * 左右两侧的图片布局
 */
export function arrangeLeftAndRightImgs(imgArrangeArr, { hPosRangeLeftSecX, hPosRangeRightSecX, hPosRangeY }) {
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

export function getImgArrangeArr() {
  let imgArranges = [];
  imageDatas.forEach((_value, index) => {
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
