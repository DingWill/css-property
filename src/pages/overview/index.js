import React, { useEffect, useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import styles from './index.less'

const menus = [
  {
    key: '/',
    name: 'Overview'
  },
  {
    key: '/ruler',
    name: 'ruler'
  },
  {
    key: '/other',
    name: 'other'
  }
]

function Overview(props) {
  const [isShowNav, setNavShow] = useState(false)

  const addClass = useCallback(() => {
    const cursorNode = document.getElementById('cursor')
    if (!cursorNode) return
    cursorNode.classList.add('hover')
  }, [])

  const removeClass = useCallback(() => {
    const cursorNode = document.getElementById('cursor')
    if (!cursorNode) return
    cursorNode.classList.remove('hover')
  }, [])

  useEffect(() => {
    const targetList = document.getElementsByClassName('hover-target')
    for (let i = 0; i < targetList.length; i++) {
      const nodeDom = targetList[i]
      nodeDom.addEventListener('mouseover', addClass)
      nodeDom.addEventListener('mouseout', removeClass)
    }
    return () => {
      for (let i = 0; i < targetList.length; i++) {
        const nodeDom = targetList[i]
        nodeDom.removeEventListener('mouseover', addClass)
        nodeDom.removeEventListener('mouseout', removeClass)
      }
    }
  }, [addClass, removeClass])

  const onMousemove = useCallback(e => {
    const cursorNode = document.getElementById('cursor')
    if (!cursorNode) return
    cursorNode.style.left = e.clientX + 'px'
    cursorNode.style.top = e.clientY + 'px'
  }, [])

  useEffect(() => {
    document.addEventListener('mousemove', onMousemove)
    return () => {
      document.removeEventListener('mousemove', onMousemove)
    }
  }, [onMousemove])

  return (
    <div className={styles.mainContainer}>
      <section className={styles.headerContainer}>
        <div className={classnames(styles.logoWrapper, 'hover-target')}>
          <span>chay</span>
          <span>logo</span>
        </div>
        <div
          className={classnames(styles.navIcon, 'hover-target', { [styles.iconActive]: isShowNav })}
          onClick={() => {
            setNavShow(!isShowNav)
          }}
        >
          <span className={styles.lineLeft}></span>
          <span className={styles.lineMiddle}></span>
          <span className={styles.lineRight}></span>
        </div>
      </section>
      <section className={styles.content}>
        <h1>overview menu</h1>
      </section>
      <section className={classnames(styles.nav, { [styles.navActive]: isShowNav })}>
        <div>
          <ul>
            {menus.map((m, index) => {
              let delayStyle = {}
              if (isShowNav) {
                delayStyle = {
                  transitionDelay: `${index * 0.1 + 0.7}s`
                }
              }
              return (
                <li
                  key={m.key}
                  className={classnames(styles.navItem, { [styles.itemActive]: index === 0 })}
                  style={{
                    ...delayStyle
                  }}
                >
                  <span className="hover-target">{m.name}</span>
                </li>
              )
            })}
          </ul>
        </div>
      </section>
      <div className={styles.cursor} id="cursor"></div>
      <div className={classnames(styles.footerLogo, 'hover-target')}>c.y</div>
    </div>
  )
}

Overview.propTypes = {
  pathname: PropTypes.string
}

export default Overview
