/** CONST **/
const AXIS_LINEWIDTH = 1.0
const AXIS_COLOR = '#1991eb'
const TICKS_LINEWIDTH = 0.5
const TICKS_COLOR = 'navy'
/** CONST **/

/****** 坐标轴 ******/
function drawAxisTicks(context, config, type) {
  const { width, itemHeight } = config
  const space = 10
  const ticksWidth = width
  const TICKS_NUMBER = Math.ceil(ticksWidth / space)
  for (let i = 0; i <= TICKS_NUMBER; i++) {
    context.beginPath()
    if (i % 5 === 0) {
      const startValue = space * i
      context.moveTo(startValue, 0)
      context.lineTo(startValue, itemHeight)
      context.textAlign = 'left'
      context.fillText(`${i * space}`, startValue + 2, 8)
    } else {
      const endY = Math.floor(itemHeight / 2)
      context.moveTo(i * space, itemHeight)
      context.lineTo(i * space, endY)
    }
    context.stroke()
  }
}

function drawAxis(context, config, type) {
  const { width, itemHeight } = config
  context.beginPath()
  context.moveTo(0, itemHeight)
  context.lineTo(width, itemHeight)
  context.closePath()
  context.stroke()
}
/****** 坐标轴 ["vertical","horizontal"]******/

export const drawRules = (id, config) => {
  const canvas = document.getElementById(id)
  if (!canvas) return
  const context = canvas.getContext('2d')
  context.save()
  context.lineWidth = AXIS_LINEWIDTH
  context.strokeStyle = AXIS_COLOR
  drawAxis(context, config)
  context.lineWidth = TICKS_LINEWIDTH
  context.strokeStyle = TICKS_COLOR
  drawAxisTicks(context, config)
  context.restore()
}
