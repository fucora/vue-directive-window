/* 判断当前应该采用mouse相关事件还是touch相关事件 */
export const isTouchEvent = 'ontouchstart' in window;
export const startEvent = isTouchEvent ? 'touchstart' : 'mousedown';
export const moveEvent = isTouchEvent ? 'touchmove' : 'mousemove';
export const endEvent = isTouchEvent ? 'touchend' : 'mouseup';

function _refillPx(target) {
  if (typeof target === 'number') {
    return target + 'px';
  }

  return target;
}

/**
 * 从Event对象中获取当前鼠标/手指的位置
 *
 * @param {Event} event
 * @returns {Object}
 */
export function getClientPosition(event) {
  const clientX = isTouchEvent ? event.targetTouches[0].clientX : event.clientX;
  const clientY = isTouchEvent ? event.targetTouches[0].clientY : event.clientY;

  return {
    x: clientX,
    y: clientY,
  };
}

/**
 * 获取当前的位置偏移值(left、top)
 *
 * @export
 * @param {Node} node
 * @returns {Object}
 */
export function getPositionOffset(node) {
  const styleLeft = parseInt(node.style.left);
  const styleTop = parseInt(node.style.top);

  return {
    x: styleLeft ? styleLeft : 0,
    y: styleTop ? styleTop : 0,
  };
}

export function setPositionOffset(node, left, top, right, bottom) {
  if (!!left || left === 0) {
    node.style.left = _refillPx(left);
  }
  if (!!top || top === 0) {
    node.style.top = _refillPx(top);
  }
  if (!!right || right === 0) {
    node.style.right = _refillPx(right);
  }
  if (!!bottom || bottom === 0) {
    node.style.bottom = _refillPx(bottom);
  }
}

/**
 * 获取node的宽高
 *
 * @export
 * @param {Node} node
 */
export function getSize(node) {
  const computedStyle = window.getComputedStyle(node);
  return {
    width: computedStyle.getPropertyValue('width'),
    height: computedStyle.getPropertyValue('height'),
  };
}

export function setSize(node, width, height) {
  node.style.width = _refillPx(width);
  node.style.height = _refillPx(height);
}

/**
 * 判断鼠标是否已出浏览器窗口
 * @param {Event} event
 * @return {Boolean}
 */
export function isOutOfBrowser(event) {
  if (
    event.clientX > window.innerWidth ||
    event.clientX < 0 ||
    event.clientY < 0 ||
    event.clientY > window.innerHeight
  ) {
    return true;
  }

  return false;
}
/**
 * 判断目标Element是否在拖拽移动的handler上
 *
 * @export
 * @param {Node} targetEl
 * @param {String} customMoveHandler
 * @returns
 */
export function isInMoveHandler(targetEl, { customMoveHandler }) {
  if (!customMoveHandler) {
    return false;
  }
  const handler = document.querySelector(customMoveHandler);
  if (!handler) {
    return false;
  }

  return handler.contains(targetEl);
}
/**
 * 判断目标Element是否在最大化的handler上
 *
 * @export
 * @param {Node} targetEl
 * @param {String} customMoveHandler
 * @returns
 */
export function isInMaximizeHandler(targetEl, { customMaximizeHandler }) {
  if (!customMaximizeHandler) {
    return false;
  }
  const handler = document.querySelector(customMaximizeHandler);
  if (!handler) {
    return false;
  }

  return handler.contains(targetEl);
}
