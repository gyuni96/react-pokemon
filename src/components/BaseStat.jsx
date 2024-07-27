import React, { useEffect, useRef } from 'react'

const BaseStat = ({ statName, statValue, type }) => {
  const ref = useRef(null)
  const bg = `bg-${type}`

  useEffect(() => {
    const setValueStat = ref.current
    const calc = (statValue / 255) * 100

    setValueStat.style.width = `${calc}%`
  }, [])

  return (
    <tr className="w-full text-white text-left">
      <td className="sm:px-5 ">{statName}</td>
      <td className="px-2 sm:px-3">{statValue}</td>
      <td>
        <div className="flex items-start h-2 min-w-[10rem] bg-gray-600 rounded overflow-hidden">
          <div ref={ref} className={`h-3 ${bg}`}></div>
        </div>
      </td>
      <td className="px-2 sm:px-5">255</td>
    </tr>
  )
}

export default BaseStat
