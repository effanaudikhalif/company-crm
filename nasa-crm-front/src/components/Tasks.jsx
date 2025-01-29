import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import ModalProject from './ModalProject';

export default function Task(props) {

    return(
        <Draggable draggableId={props.task.project_id.toString()} index={props.index}>
            {(provided, snapshot) => (
                
            <div className='border m-1 p-2 border-solid border-[lightgrey] hover:shadow-md bg-white rounded-lg shadow-sm'
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                >
                <ModalProject task={props.task} id={props.task.project_id} getData={props.getData}></ModalProject>
            </div>
            )}
        </Draggable>
    ) 
}
