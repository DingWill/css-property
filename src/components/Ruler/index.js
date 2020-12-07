import { useEffect, useCallback, useState, useRef } from 'react'
import PropTypes from 'prop-types'
import { v4 } from 'uuid'
import { Icon } from 'antd'

import { drawRules, getElementToPageTop, getElementToPageLeft, createLineDom } from './utils'
import styles from './index.less'

function Ruler(props) {
  const { width, height, itemHeight = 16, scale, config } = props
  const { lineColor } = config
  const [moveType, setType] = useState(null)
  const [moveId, setId] = useState(null)
  const [isLineShow, setLineShow] = useState(true)
  const scaleRef = useRef(scale)
  const wrapperRef = useRef(null)

  useEffect(() => {
    drawRules('canvasTop', { ruleWidth: width, itemHeight, scale })
    drawRules('canvasLeft', { ruleWidth: height, itemHeight, scale })
  }, [width, height, itemHeight, scale])

  /** 更新参考线颜色 **/
  useEffect(() => {
    if (!wrapperRef.current) return
    const wrapperNode = wrapperRef.current
    const lines = wrapperNode.getElementsByClassName('rule-line')
    if (!lines || !lines.length) {
      return
    }
    for (let i of lines) {
      i.style.backgroundColor = lineColor
      const children = i.getElementsByClassName('position_content')[0]
      if (children) {
        children.style.color = lineColor
        children.style.borderColor = lineColor
      }
    }
  }, [lineColor])

  /** 更新参考线位置 **/
  useEffect(() => {
    if (!wrapperRef.current) return
    const wrapperNode = wrapperRef.current
    const lines = wrapperNode.getElementsByClassName('rule-line')
    if (!lines || !lines.length) {
      return
    }
    const currentScale = scaleRef.current
    for (let i of lines) {
      const lineClassnames = i.className
      const isHorLin = lineClassnames.includes('rule_hor')
      if (isHorLin) {
        const currentTop = parseFloat(i.style.top) - itemHeight
        const newTop = (currentTop / currentScale) * scale
        const finalTop = newTop + itemHeight
        i.style.top = finalTop + 'px'
        continue
      }
      const currentLeft = parseFloat(i.style.left) - itemHeight
      const newLeft = (currentLeft / currentScale) * scale
      const finalLeft = newLeft + itemHeight
      // i.setAttribute('data-scale', scaleIntValue)
      i.style.left = finalLeft + 'px'
    }

    scaleRef.current = scale
  }, [scale, itemHeight])

  /** 辅助线移动 **/
  const onCanvasMouseMove = useCallback(
    (e, type) => {
      if (!moveId) return
      const moveNode = document.getElementById(moveId)
      if (!moveNode) return
      const moveChildren = moveNode.getElementsByClassName('position_content')[0]
      if (moveChildren) {
        moveChildren.style.display = 'block'
      }
      const wrapperNode = wrapperRef.current
      if (moveType === 'horizontal') {
        let canvasTopValue = 0
        if (!!wrapperNode) {
          canvasTopValue = getElementToPageTop(wrapperNode)
        }
        const finalTop = e.clientY - canvasTopValue
        const moveTopValue = (finalTop - itemHeight) / scale
        moveNode.style.top = finalTop + 'px'
        moveChildren.innerHTML = `Y: ${Math.round(moveTopValue)}px`
        return
      }
      let left = 0
      if (wrapperNode) {
        left = getElementToPageLeft(wrapperNode)
      }

      const finalLeft = e.clientX - left
      const moveLeftValue = (finalLeft - itemHeight) / scale
      moveNode.style.left = finalLeft + 'px'
      moveChildren.innerHTML = `X: ${Math.round(moveLeftValue)}px`
    },
    [moveId, moveType, scale, itemHeight]
  )

  /** 辅助线移动结束 **/
  const onCanvasMouseUp = useCallback(() => {
    if (!moveId && !moveType) return
    const moveNode = document.getElementById(moveId)
    if (!moveNode) return
    const moveChildren = moveNode.getElementsByClassName('position_content')[0]
    if (moveChildren) {
      moveChildren.style.display = 'none'
    }
    let distance = 0
    if (moveType === 'horizontal') {
      distance = parseFloat(moveNode.style.top)
    } else {
      distance = parseFloat(moveNode.style.left)
    }
    if (distance < itemHeight) {
      const wrapperNode = wrapperRef.current
      wrapperNode.removeChild(moveNode)
    }
    setId(null)
    setType(null)
  }, [moveId, moveType, itemHeight])

  useEffect(() => {
    document.addEventListener('mousemove', onCanvasMouseMove)
    document.addEventListener('mouseup', onCanvasMouseUp)
    return () => {
      document.removeEventListener('mousemove', onCanvasMouseMove)
      document.removeEventListener('mouseup', onCanvasMouseUp)
    }
  }, [onCanvasMouseMove, onCanvasMouseUp])

  /** 辅助线点击 **/
  const onLineMouseDown = useCallback((currentId, currentType) => {
    setId(currentId)
    setType(currentType)
  }, [])

  const onLineDeleted = useCallback((currentId, currentType) => {
    if (!currentId) return
    const currentNode = document.getElementById(currentId)
    if (!currentNode) return
    if (!wrapperRef.current) return
    const wrapperNode = wrapperRef.current
    wrapperNode.removeChild(currentNode)
  }, [])

  /** Canvas点击拖拽辅助线 **/
  const onCanvasMouseDown = useCallback(
    type => {
      if (!wrapperRef.current) return
      const wrapperNode = wrapperRef.current
      let guideLine = createLineDom(type, itemHeight, config)
      const lineId = v4()
      guideLine.setAttribute('id', lineId)
      // guideLine.setAttribute('data-scale', scale * 100)
      guideLine.onmousedown = () => {
        onLineMouseDown(lineId, type)
      }
      guideLine.onmouseup = () => {
        onCanvasMouseUp()
      }
      guideLine.ondblclick = () => {
        onLineDeleted(lineId)
      }
      wrapperNode.appendChild(guideLine)
      setId(lineId)
      setType(type)
    },
    [config, itemHeight, onLineMouseDown, onCanvasMouseUp, onLineDeleted]
  )

  /** 清除所有辅助线 **/
  const onClearLines = useCallback(() => {
    if (!wrapperRef.current) return
    const wrapperNode = wrapperRef.current
    const lines = wrapperNode.getElementsByClassName('rule-line')
    if (!lines || !lines.length) {
      return
    }
    for (let i = lines.length - 1; i > -1; i--) {
      // wrapperNode.removeChild(lines[i]);
      lines[i].style.display = isLineShow ? 'none' : 'block'
      setLineShow(!isLineShow)
    }
  }, [isLineShow])

  const canvasWidth = width * scale
  const canvasHeight = height * scale

  return (
    <div
      className={styles.wrapper}
      ref={wrapperRef}
      style={{
        width: canvasWidth + itemHeight,
        height: canvasHeight + itemHeight
      }}
    >
      <canvas
        id="canvasTop"
        width={canvasWidth}
        height={itemHeight}
        style={{
          left: itemHeight,
          top: 0,
          cursor: 'ns-resize'
        }}
        onMouseDown={e => {
          onCanvasMouseDown('horizontal')
        }}
        onMouseUp={() => {
          onCanvasMouseUp('horizontal')
        }}
      />
      <canvas
        id="canvasLeft"
        width={canvasHeight}
        height={itemHeight}
        style={{
          top: 0,
          left: 0,
          cursor: 'ew-resize',
          transform: 'rotate(90deg)',
          transformOrigin: '0% 100%'
        }}
        onMouseDown={e => {
          onCanvasMouseDown('vertical')
        }}
        onMouseUp={() => {
          onCanvasMouseUp('vertical')
        }}
      />
      <div
        className={styles.clearIcon}
        onClick={onClearLines}
        style={{
          width: itemHeight,
          height: itemHeight,
          lineHeight: `${itemHeight}px`,
          textAlign: 'center'
        }}
      >
        <Icon
          type="pushpin"
          style={{
            color: isLineShow ? '#1991eb' : '#9B9B9B'
          }}
        />
      </div>
    </div>
  )
}

Ruler.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  itemHeight: PropTypes.number,
  scale: PropTypes.number,
  config: PropTypes.object
}

export default Ruler
