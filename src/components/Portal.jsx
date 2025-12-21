/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

const Portal = ({ children, id = 'portal-root' }) => {
  const elRef = useRef(null)
  const [, setMounted] = useState(false)

  useEffect(() => {
    const el = document.createElement('div')
    el.setAttribute('data-portal', id)
    elRef.current = el
    document.body.appendChild(el)
    setMounted(true)

    return () => {
      if (elRef.current && document.body.contains(elRef.current)) {
        document.body.removeChild(elRef.current)
      }
    }
  }, [id])

  if (!elRef.current) return null
  return createPortal(children, elRef.current)
}

export default Portal
