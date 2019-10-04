export function transformToImgUrl(imgDatasArr) {
  if (!Array.isArray(imgDatasArr)) return [];
  const serializedImgDatas = imgDatasArr.slice();
  for (let i = 0; i < serializedImgDatas.length; i++) {
    let imgData = serializedImgDatas[i];
    imgData.imageURL = require('../assets/images/' + imgData.fileName);
  }
  return serializedImgDatas;
}

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
