import constant from '../config/constant';

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
 * 判断当前用户是否使用IE浏览器访问
 *
 * @returns {Boolean}
 */
function isIE() {
  if (!!window.ActiveXObject || 'ActiveXObject' in window) return true;
  else return false;
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
  const styleLeft = parseInt(getStyle(node, 'left'));
  const styleTop = parseInt(getStyle(node, 'top'));

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

export function getStyle(el, prop) {
  const computedStyle = window.getComputedStyle(el);
  const styleValue = computedStyle.getPropertyValue(prop);
  /* 
    需要对IE下的`getComputedStyle()`进行兼容，目前已知在css里设置`right: 0`的时候，
    再用`getComputedStyle()`取left属性的时候只取到`auto` 
  */
  if (isIE()) {
    if (prop === 'left' && styleValue === 'auto') {
      const elWidth = computedStyle.getPropertyValue('width');
      const elRight = computedStyle.getPropertyValue('right');
      console.log('left:', window.innerWidth - parseFloat(elWidth) + 'px');
      return (
        window.innerWidth - parseFloat(elWidth) - parseFloat(elRight) + 'px'
      );
    }

    if (prop === 'top' && styleValue === 'auto') {
      const elHeight = computedStyle.getPropertyValue('height');
      const elBottom = computedStyle.getPropertyValue('bottom');
      console.log('top:', window.innerHeight - parseFloat(elHeight) + 'px');
      return (
        window.innerHeight - parseFloat(elHeight) - parseFloat(elBottom) + 'px'
      );
    }
  }

  return styleValue;
}

export function judgeResizeType(cursorPoint, target) {
  const borderScope = constant.BORDER_SCOPE;
  const x = cursorPoint.x;
  const y = cursorPoint.y;
  const offsetTop = target.offsetTop;
  const offsetLeft = target.offsetLeft;
  const offsetWidth = target.offsetWidth;
  const offsetHeight = target.offsetHeight;
  // console.log(
  //   `x:${x};y:${y};offsetTop:${offsetTop}；offsetLeft:${offsetLeft}；offsetWidth:${offsetWidth}；offsetHeight:${offsetHeight}；`
  // );
  if (Math.abs(offsetLeft - x) <= borderScope) {
    if (Math.abs(offsetTop - y) <= borderScope) {
      return 'left-top';
    } else if (Math.abs(offsetTop + offsetHeight - y) <= borderScope) {
      return 'left-bottom';
    } else {
      return 'left';
    }
  }

  if (Math.abs(offsetLeft + offsetWidth - x) <= borderScope) {
    if (Math.abs(offsetTop - y) <= borderScope) {
      return 'right-top';
    } else if (Math.abs(offsetTop + offsetHeight - y) <= borderScope) {
      return 'right-bottom';
    } else {
      return 'right';
    }
  }

  if (Math.abs(offsetTop - y) <= borderScope) {
    return 'top';
  } else if (Math.abs(offsetTop + offsetHeight - y) <= borderScope) {
    return 'bottom';
  }

  return 'middle';
}

function _iframeWalk(window, func) {
  const iframeEls = window.querySelectorAll('iframe');
  if (!!iframeEls && iframeEls.length > 0) {
    Array.prototype.forEach.call(iframeEls, iframe => {
      func(iframe);
    });
  }
}

export function ignoreIframe(window) {
  _iframeWalk(window, iframe => {
    iframe.style['pointer-events'] = 'none';
  });
}

export function recoverIframe(window) {
  _iframeWalk(window, iframe => {
    iframe.style['pointer-events'] = 'auto';
  });
}
/* 计算两点间距离 */
export function calDistance({ x1, y1, x2, y2 }) {
  const result = Math.pow(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2), 0.5);
  // console.log({ x1, y1, x2, y2 }, result);
  return result;
}
