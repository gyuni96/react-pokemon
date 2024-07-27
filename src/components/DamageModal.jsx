import React from 'react'
import DamageRelations from './DamageRelations'

const DamageModal = ({ damages, setIsModalOpen }) => {
  return (
    <div className="flex items-center justify-center z-40 fixed left-0 bottom-0 w-full h-full bg-gray-800">
      <div className="modal bg-white rounded-lg w-1/2">
        <div className="flex flex-col items-start p-4">
          <div className="flex items-center justify-between w-full">
            <div className="text-gray-900 font-medium text-lg ">데미지관계</div>
            <span
              onClick={() => setIsModalOpen(false)}
              className="text-gray-900 font-medium text-lg cursor-pointer"
            >
              X
            </span>
          </div>
          <DamageRelations damages={damages} />
        </div>
      </div>
    </div>
  )
}

export default DamageModal
