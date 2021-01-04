import React, { useState } from 'react'
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd'
import { v4 as uuidv4 } from 'uuid'
import _ from 'lodash'
import { DraggableItem, Item, TagType } from './components/DraggableItem'

type ColumnData = {
  title: string
  items: Item[]
}

type Columns = Record<string, ColumnData>

const App: React.FC = () => {
  const item1: Item = {
    id: uuidv4(),
    name: 'Check for deploy',
    createdAt: Date.now(),
    tags: [
      {
        id: uuidv4(),
        name: '1.2',
        type: TagType.VERSION,
      },
    ],
  }

  const item2: Item = {
    id: uuidv4(),
    name: 'Unable to render Item',
    createdAt: Date.now(),
    tags: [
      {
        id: uuidv4(),
        name: 'bug',
        type: TagType.BUG,
      },
      {
        id: uuidv4(),
        name: '1.2.1',
        type: TagType.VERSION,
      },
    ],
  }

  const initialColumns: Columns = {
    todo: {
      title: 'ToDo',
      items: [item2],
    },
    'in-progress': {
      title: 'In Progress',
      items: [item1],
    },
    done: {
      title: 'Completed',
      items: [],
    },
  }
  const [columns, setColumns] = useState(initialColumns)
  const [newTodo, setNewTodo] = useState<string>('')

  const handelDragEnd = ({ source, destination }: DropResult) => {
    if (!destination) return
    if (destination.index === source.index && destination.droppableId === source.droppableId) return

    const itemCopy: Item = {
      ...columns[source.droppableId].items[source.index],
    }
    setColumns((prev: any) => {
      prev = { ...prev }
      prev[source.droppableId].items.splice(source.index, 1)
      prev[destination.droppableId].items.splice(destination.index, 0, itemCopy)

      return prev
    })
  }

  const addItem = () => {
    if (newTodo.trim() === '') return
    const newColumnsData: Columns = {
      ...columns,
      todo: {
        title: 'Todo',
        items: [
          {
            id: uuidv4(),
            name: newTodo || '',
            createdAt: Date.now(),
            tags: [
              {
                id: uuidv4(),
                name: '1.3-alpha',
                type: TagType.VERSION,
              },
            ],
          },
          ...columns.todo.items,
        ],
      },
    }
    setColumns(newColumnsData)

    setNewTodo('')
  }

  return (
    <div className="App">
      <div className="flex justify-center items-center mt-10 ">
        <input
          className="bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-1 px-4 block appearance-none leading-normal mr-2"
          type="text"
          placeholder="Enter title"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
        />
        <button
          onClick={addItem}
          className="px-2 inline-flex items-center justify-center h-8 text-gray-200 transition-colors duration-150 bg-gray-600 rounded-lg focus:shadow-outline hover:bg-teal-500 hover:text-teal-100 focus:outline-none"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
            <path
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clipRule="evenodd"
              fillRule="evenodd"
            ></path>
          </svg>
          <span className="pb-0.5 mr-1 text-sm font-medium ml-1">New Task</span>
        </button>
      </div>
      <div className="flex m-5 justify-center">
        <DragDropContext onDragEnd={handelDragEnd}>
          {_.map(columns, (data, key: string) => {
            return (
              <div key={key} className="flex p-3">
                <div className="">
                  <Droppable droppableId={key}>
                    {(provided, snapshot) => {
                      return (
                        <div
                          className={`p-3 w-80 bg-gray-100 rounded-md ${
                            snapshot.isDraggingOver ? 'bg-gray-300' : ''
                          } min-h-full`}
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                        >
                          <div className="flex justify-between items-center">
                            <h3 className="text-sm font-medium text-gray-500">{data.title}</h3>
                            <span className="bg-gray-200 text-gray-500  rounded-md text-xs px-2">
                              {data.items.length}
                            </span>
                          </div>

                          {_.map(data.items, (el: Item, index: number) => {
                            return (
                              <Draggable key={el.id} index={index} draggableId={el.id}>
                                {(provided, snapshot) => (
                                  <DraggableItem
                                    el={el}
                                    provided={provided}
                                    isDragging={snapshot.isDragging}
                                  />
                                )}
                              </Draggable>
                            )
                          })}
                          {provided.placeholder}
                        </div>
                      )
                    }}
                  </Droppable>
                </div>
              </div>
            )
          })}
        </DragDropContext>
      </div>
    </div>
  )
}

export default App
