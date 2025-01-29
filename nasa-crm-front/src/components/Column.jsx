import React, { useState, useEffect } from 'react';
import { initialDataPipeline } from '../utils/intial-data';
import { DragDropContext } from 'react-beautiful-dnd';
import api from '../api/axios';
import ColumnTrain from '../components/ColumnTrain';
import { useData } from '../provider/DataProvider';
import Loading from '../components/Loading';
import { toast } from 'react-toastify';
import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_BACKEND_URL);

function Pipeline() {
  const [projects, setProjects] = useState(initialDataPipeline);
  const [dataProject, setDataProject] = useState([]);
  const [projectList, setProjectList] = useState([]);
  const { stagesTrain: stages, dataLoading } = useData();

  const renderColumn = (data) => {
    let tasks = {};
    let columns = {};
    let columnOrder = [];

    stages.forEach(stage => {
      columns['column-' + stage.stage_id] = {
        id: 'column-' + stage.stage_id,
        title: stage.name,
        description: stage.description,
        taskIds: []
      };
      columnOrder.push('column-' + stage.stage_id);
    });

    data.forEach(task => {
      if (stages.some(s => s.stage_id === task.stage_id)) {
        tasks[task.train_id] = { task };
        columns['column-' + task.stage_id].taskIds.push(task.train_id);
      }
    });

    setProjects({
      tasks,
      columns,
      columnOrder
    });
  };

  useEffect(() => {
    api.get('/trains')
      .then(response => {
        setDataProject(response.data);
        renderColumn(response.data);
      })
      .catch(error => {
        console.error(error);
        toast.error(error.message);
      });

    api.get('/projects')
      .then(response => {
        let projectTemp = response.data.map(project => ({
          project_id: project.project_id,
          client_name: project.client_name
        }));
        setProjectList(projectTemp);
      })
      .catch(error => {
        console.error(error);
        toast.error(error.message);
      });
  }, []);

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (destination.droppableId === source.droppableId &&
        destination.index === source.index) {
      return;
    }

    const start = projects.columns[source.droppableId];
    const finish = projects.columns[destination.droppableId];

    const newStartTaskIds = Array.from(start.taskIds);
    newStartTaskIds.splice(source.index, 1);
    const newFinishTaskIds = Array.from(finish.taskIds);
    newFinishTaskIds.splice(destination.index, 0, draggableId);

    const newProjects = {
      ...projects,
      columns: {
        ...projects.columns,
        [start.id]: { ...start, taskIds: newStartTaskIds },
        [finish.id]: { ...finish, taskIds: newFinishTaskIds }
      }
    };

    setProjects(newProjects);
    api.post('/trains/' + draggableId, { data: { stage_id: parseInt(finish.id.split("-")[1]) } })
      .catch(error => {
        console.error(error);
        toast.error("Could not update train position");
      });
  };

  if (dataLoading) {
    return <Loading />;
  }

  return (
    <div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className='flex overflow-y-auto min-h-[calc(100vh-8rem)] items-start'>
          {projects.columnOrder.map(columnId => {
            const column = projects.columns[columnId];
            const tasks = column.taskIds.map(taskId => projects.tasks[taskId].task);
            return <ColumnTrain key={column.id} column={column} tasks={tasks} />;
          })}
        </div>
      </DragDropContext>
    </div>
  );
}

export default Pipeline;
