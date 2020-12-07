import { useCallback, useState } from 'react'
import { Input, InputNumber } from 'antd'
import { debounce } from 'lodash'

import Ruler from '../../components/Ruler'

import styles from './index.less'

function RulerPage(props) {
  const [pageConfig, setPageConfig] = useState({ width: 1200, height: 800, scale: 1 })
  const [lineColor, setColor] = useState(null)
  const { width, height, scale } = pageConfig

  const onPageConfigChange = useCallback(
    debounce(params => {
      setPageConfig(p => {
        return { ...p, ...params }
      })
    }, 500),
    []
  )

  const onColorChange = useCallback(ev => {
    if (!ev.target) {
      return
    }
    const val = ev.target.value
    setColor(val)
  }, [])

  console.group('Ruler -')
  console.log('%c辅助线双击可以删除。', 'color: #EB5648')
  console.log('%c辅助线拖拽到比例尺处，可以删除。', 'color: #EB5648')
  console.log('%c点击右上角Pin可以显示隐藏辅助线。', 'color: #EB5648')
  console.groupEnd('Ruler -')
  return (
    <div className={styles.container}>
      <div className={styles.topContent}>
        <InputNumber
          placeholder="输入宽度"
          className={styles.input}
          value={width}
          onChange={val => onPageConfigChange({ width: val })}
        />
        <InputNumber
          placeholder="输入高度"
          className={styles.input}
          value={height}
          onChange={val => onPageConfigChange({ height: val })}
        />
        <InputNumber
          placeholder="比例"
          className={styles.input}
          value={scale}
          min={0.1}
          max={2}
          step={0.1}
          onChange={val => onPageConfigChange({ scale: val })}
        />
        <Input placeholder="输入辅助线颜色" className={styles.input} value={lineColor} onChange={onColorChange} />
      </div>
      <div className={styles.mainContent} style={{ height: 'calc(100% - 60px)' }}>
        <div>
          <Ruler
            width={width}
            height={height}
            scale={scale}
            itemHeight={24}
            config={{
              lineColor: lineColor
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default RulerPage
