import React from 'react'
import { Draggable } from 'react-beautiful-dnd';
import ModalTrain from './ModalTrain';

export default function TaskTrain(props) {

    return(
        <Draggable draggableId={props.task.train_id.toString()} index={props.index}>
            {(provided) => (
                
            <div className='border m-1 p-2 border-solid border-[lightgrey] hover:shadow-md bg-white rounded-lg shadow-sm'
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                >
                <ModalTrain task={props.task} id={props.task.train_id} getData={props.getData} projectList={props.projectList}></ModalTrain>
            </div>
            )}
        </Draggable>
    ) 
}
