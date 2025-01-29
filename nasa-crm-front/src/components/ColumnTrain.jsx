import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import TaskTrain from './TasksTrain';


export default function ColumnTrain(props) {

  return (
      <div className='border min-w-[280px] max-w-[280px] flex flex-col m-2 border-solid border-[lightgrey] rounded-lg bg-gray-200'>
        <div className='flex justify-between'>
          <h3 className='p-2 text-base font-medium'>{props.column.title}</h3>
          {props.column.description ? 
          <div className='m-2 tooltip tooltip-bottom' data-tip={props.column.description}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
            </svg>
          </div> : <div></div>}
        </div>
        
        <Droppable droppableId={props.column.id}>
          {(provided) => (
            <div className='grow row min-h-[100px] items-stretch max-h-[calc(100vh-13rem)] overflow-y-auto'
                ref={provided.innerRef}
                {...provided.droppableProps}
                >
                {props.tasks.map((task, index) => (
                 <TaskTrain key={task.train_id} task={task} index={index} getData={props.getData} projectList={props.projectList}/>
                ))}
                {provided.placeholder}
            </div>
            )}
        </Droppable>
      </div>
    )
}