import { useEffect, useCallback, useState } from 'react'
import { v4 } from 'uuid'

import { drawRules } from './utils'

import styles from './index.less'

function Rule(props) {
  const [moveType, setType] = useState(null)
  const [moveId, setId] = useState(null)

  useEffect(() => {
    drawRules('canvas', { width: 800, itemHeight: 16 })
    drawRules('canvasVer', { width: 800, itemHeight: 16 })
  }, [])

  const onCanvasMouseMove = useCallback(
    (e, type) => {
      if (!moveId) return
      const moveNode = document.getElementById(moveId)
      if (!moveNode) return
      if (moveType === 'horizontal') {
        moveNode.style.top = e.clientY + 'px'
        return
      }
      moveNode.style.left = e.clientX + 'px'
    },
    [moveId, moveType]
  )
  const onCanvasMouseUp = useCallback(() => {
    if (!moveId && !moveType) return
    setId(null)
    setType(null)
  }, [moveId, moveType])

  useEffect(() => {
    document.addEventListener('mousemove', onCanvasMouseMove)
    document.addEventListener('mouseup', onCanvasMouseUp)
    return () => {
      document.removeEventListener('mousemove', onCanvasMouseMove)
      document.removeEventListener('mouseup', onCanvasMouseUp)
    }
  }, [onCanvasMouseMove, onCanvasMouseUp])

  /** Line-Dom 事件 **/
  const onLineMouseDown = useCallback((currentId, currentType) => {
    console.log('======fhjskdhfkjh====')
    setId(currentId)
    setType(currentType)
  }, [])

  const onCanvasMouseDown = useCallback(
    type => {
      const wrapperNode = document.getElementById('canvasWrapper')
      if (!wrapperNode) return
      let guideLine = document.createElement('div')
      const lineId = v4()
      const classNameVal = type === 'horizontal' ? 'rule_hor' : 'rule_ver'
      guideLine.setAttribute('class', `rule-line ${classNameVal}`)
      guideLine.setAttribute('id', lineId)
      if (type === 'horizontal') {
        guideLine.style.top = 16 + 'px'
      } else {
        guideLine.style.left = 16 + 'px'
      }

      guideLine.onmousedown = () => {
        onLineMouseDown(lineId, type)
      }
      guideLine.onmouseup = () => {
        onCanvasMouseUp()
      }
      wrapperNode.appendChild(guideLine)
      setId(lineId)
      setType(type)
    },
    [onLineMouseDown, onCanvasMouseUp]
  )

  const onClearLines = useCallback(() => {
    const wrapperNode = document.getElementById('canvasWrapper')
    if (!wrapperNode) return
    const lines = document.getElementsByClassName('rule-line')
    if (!lines || !lines.length) {
      return
    }
    for (let i = lines.length - 1; i > -1; i--) {
      wrapperNode.removeChild(lines[i])
    }
  }, [])

  return (
    <div className={styles.wrapper} id="canvasWrapper">
      <canvas
        id="canvas"
        width="800"
        height="16"
        style={{
          left: 16,
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
        id="canvasVer"
        width="800"
        height="16"
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
      <div className={styles.clearIcon} onClick={onClearLines}></div>
    </div>
  )
}

export default Rule
