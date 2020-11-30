/** CONST **/
const AXIS_LINEWIDTH = 1.0
const AXIS_COLOR = '#042549'
const TICKS_LINEWIDTH = 0.5
const TICKS_COLOR = '#042549'
const TICKS_SPACE = 5
const FONT_SIZE = '8px'
const FONT_FAMILY = 'arial'
/** CONST **/

/****** 坐标轴 ******/
function drawAxisTicks(context, config, type) {
  const { ruleWidth, itemHeight } = config
  const space = TICKS_SPACE
  const ticksWidth = ruleWidth
  const TICKS_NUMBER = Math.ceil(ticksWidth / space)
  for (let i = 0; i <= TICKS_NUMBER; i++) {
    context.beginPath()
    if (i % 10 === 0) {
      const startValue = space * i
      context.moveTo(startValue, 0)
      context.lineTo(startValue, itemHeight)
      context.textAlign = 'left'
      context.font = `${FONT_SIZE} ${FONT_FAMILY}`
      context.fillText(`${i * space}`, startValue + 2, 8)
    } else {
      const endY = Math.ceil(itemHeight / 2)
      context.moveTo(i * space, itemHeight)
      context.lineTo(i * space, endY)
    }
    context.stroke()
  }
}

function drawAxis(context, config, type) {
  const { ruleWidth, itemHeight } = config
  const lineWidth = Math.ceil(ruleWidth / TICKS_SPACE) * TICKS_SPACE
  context.beginPath()
  context.moveTo(0, itemHeight)
  context.lineTo(lineWidth, itemHeight)
  context.closePath()
  context.stroke()
}
/****** 坐标轴 ["vertical","horizontal"]******/

// 绘制标尺
export const drawRules = (id, config) => {
  const { scale } = config
  const canvas = document.getElementById(id)
  if (!canvas) return
  const context = canvas.getContext('2d')
  context.clearRect(0, 0, canvas.width, canvas.height)
  context.save()
  context.scale(scale, 1)
  context.lineWidth = AXIS_LINEWIDTH
  context.strokeStyle = AXIS_COLOR
  drawAxis(context, config)
  context.lineWidth = TICKS_LINEWIDTH
  context.strokeStyle = TICKS_COLOR
  drawAxisTicks(context, config)
  context.restore()
}

// 获取元素距离文档顶部的距离
export const getElementToPageTop = el => {
  if (el.parentElement) {
    return getElementToPageTop(el.parentElement) + el.offsetTop
  }
  return el.offsetTop
}

// 获取元素距离文档左侧的距离
export const getElementToPageLeft = el => {
  if (el.parentElement) {
    return getElementToPageLeft(el.parentElement) + el.offsetLeft
  }
  return el.offsetLeft
}

// 创建辅助线DOM元素
export const createLineDom = (type, itemHeight, config) => {
  const { lineColor } = config
  let guideLineDom = document.createElement('div')
  const classNameVal = type === 'horizontal' ? 'rule_hor' : 'rule_ver'
  guideLineDom.setAttribute('class', `rule-line ${classNameVal}`)
  let positionValue = document.createElement('div')
  positionValue.setAttribute('class', `position_content`)
  if (type === 'horizontal') {
    guideLineDom.style.top = itemHeight / 2 + 'px'
    positionValue.innerHTML = `Y: 0px`
  } else {
    guideLineDom.style.left = itemHeight / 2 + 'px'
    positionValue.innerHTML = `X: 0px`
  }
  if (lineColor) {
    guideLineDom.style.backgroundColor = lineColor
    positionValue.style.color = lineColor
    positionValue.style.borderColor = lineColor
  }

  guideLineDom.appendChild(positionValue)
  return guideLineDom
}
