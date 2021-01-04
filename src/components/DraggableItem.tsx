import React, { useMemo } from 'react'
import { DraggableProvided } from 'react-beautiful-dnd'
import { formatDistance } from 'date-fns'

export enum TagType {
  'WARNING',
  'VERSION',
  'BUG',
}

export type Tag = {
  id: string
  name: string
  type: TagType
}

export type Item = {
  id: string
  name: string
  createdAt: number
  tags: Tag[]
}

interface DraggableItemProps {
  provided: DraggableProvided
  el: Item
  isDragging: boolean
}

export const DraggableItem: React.FC<DraggableItemProps> = ({ el, provided, isDragging }) => {
  const memoizedValue = useMemo(() => {
    return (
      <>
        <div className=" flex justify-between">
          <div className="text-sm font-medium text-gray-900 leading-snug">{el.name}</div>
          <img className="w-6 h-6 rounded-full" src="/images/me.jpeg" alt="avatar" />
        </div>
        <div className="mt-3 flex justify-between items-center">
          <div className="text-xs text-gray-600">{formatDistance(el.createdAt, Date.now())}</div>
          <div className="flex justify-between">
            {el.tags.map((tag: Tag) => {
              let tagColor = 'teal'
              switch (tag.type) {
                case TagType.BUG:
                  tagColor = 'red'
                  break
                case TagType.WARNING:
                  tagColor = 'yellow'
                  break
                default:
                  break
              }
              return (
                <div
                  key={tag.id}
                  className={`bg-${tagColor}-50 h-4 flex justify-between items-center px-2 rounded mx-1`}
                >
                  <svg
                    className={`text-${tagColor}-500 w-2 h-2 mr-1`}
                    viewBox="0 0 8 8"
                    fill="currentColor"
                  >
                    <circle cx="4" cy="5" r="2" />
                  </svg>
                  <span className={`text-${tagColor}-400 text-xxs font-medium`}>{tag.name}</span>
                </div>
              )
            })}
          </div>
        </div>
      </>
    )
  }, [el])

  return (
    <div
      className={`mt-2 block p-5 bg-white rounded-md shadow ${isDragging && '  bg-blue-400'}`}
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
    >
      {memoizedValue}
    </div>
  )
}
