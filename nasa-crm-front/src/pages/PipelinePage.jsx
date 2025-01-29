import React, { useState, useEffect } from 'react';
import { initialDataPipeline } from '../utils/intial-data';
import { DragDropContext } from 'react-beautiful-dnd';
import api from '../api/axios';
import ColumnTrain from '../components/ColumnTrain';
import { useData } from '../provider/DataProvider';
import Loading from '../components/Loading';
import { toast } from 'react-toastify';
import { io } from "socket.io-client";
import Navbar from '../components/Navbar';

const socket = io(import.meta.env.VITE_BACKEND_URL);

function Pipeline() {
  const [projects, setProjects] = useState(initialDataPipeline);
  const [dataProject, setDataProject] = useState([]);
  const [projectList, setProjectList] = useState([]);
  const { stagesTrain: stages, dataLoading } = useData();

  const renderColumn = (data) => {
    console.log('Attempting to render columns...');
    if (!stages || stages.length === 0) {
      console.error('Render failed: No stages available.');
      return;
    }

    let tasks = {};
    let columns = {};
    let columnOrder = [];

    stages.forEach(x => {
      columns = { ...columns, ['column-' + x.stage_id]: { id: 'column-' + x.stage_id, title: x.name, description: x.description, taskIds: [] } };
      columnOrder.push('column-' + x.stage_id);
    });

    data.filter(value => stages.some(obj => obj.stage_id === value.stage_id)).forEach((task) => {
      if (!task.train_id) {
        console.error('Missing train_id for task:', task);
      }
      tasks = { ...tasks, [task.train_id]: { task } };
      columns['column-' + task.stage_id].taskIds.push(task.train_id);
    });

    const newProjects = {
      tasks,
      columns,
      columnOrder
    };

    console.log("New project structure set successfully:", newProjects);
    setProjects(newProjects);
  }

  const getData = async () => {
    console.log('Fetching data from API...');
    try {
      const trainsResponse = await api.get('/trains');
      setDataProject(trainsResponse.data);
      console.log('Trains data received:', trainsResponse.data);
  
      const projectsResponse = await api.get('/projects');
      const projectTemp = projectsResponse.data.map(project => ({
        project_id: project.project_id, 
        client_name: project.client_name 
      }));
      setProjectList(projectTemp);
      console.log('Projects data received:', projectsResponse.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      toast.error("Failed to fetch data: " + error.message);
    }
  }  

  const onDragEnd = async (result) => {
    console.log('Handling drag and drop event...');
    const { destination, source, draggableId } = result;
    if (!destination) {
      console.warn('Drag and drop aborted: No destination found.');
      return;
    }
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      console.warn('Drag and drop aborted: Item dropped in the same position.');
      return;
    }

    if (destination.droppableId === source.droppableId) {
      console.warn('Movement within the same column is disabled.');
      return;  // Early return to ignore intra-column moves
    }

    const start = projects.columns[source.droppableId];
    const finish = projects.columns[destination.droppableId];
    // Proceeding with reordering
    const startTaskIds = Array.from(start.taskIds);
    startTaskIds.splice(source.index, 1);
    const finishTaskIds = Array.from(finish.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newStart = {
      ...start,
      taskIds: startTaskIds,
    };
    const newFinish = {
      ...finish,
      taskIds: finishTaskIds,
    };
    const newProjects = {
      ...projects,
      columns: {
        ...projects.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      },
    };
    try {
      const response = await api.post('/trains/' + draggableId, {
        data: {
          stage_id: parseInt(newFinish.id.split("-")[1])
        }
      });
      console.log('API update success:', response.data);
    } catch (error) {
      console.error('Failed to update train status:', error);
      toast.error("Failed to update train: " + error.message);
    }
    setProjects(newProjects);
  };

  useEffect(() => {
    if (dataProject.length > 0) {
      renderColumn(dataProject);
    }
  }, [dataProject]);

  useEffect(() => {
    getData();
  
    const handleStageChange = (data) => {
      console.log("Stage change event received:", data);
      setDataProject(data);
    };
  
    socket.on('stageChange', handleStageChange);
  
    return () => {
      socket.disconnect();
      console.log('Socket disconnected.');
    };
  }, []);

  if (dataLoading) {
    return <Loading />;
  }

  return (
    <div>
      <div className='pipeline'>
        <DragDropContext onDragEnd={onDragEnd}>
          <div className='flex overflow-y-auto min-h-[calc(100vh-8rem)] items-start'>
            {projects.columnOrder.map(columnId => {
              const column = projects.columns[columnId];
              const tasks = column.taskIds.map(taskId => projects.tasks[taskId].task);
              return <ColumnTrain key={column.id} column={column} tasks={tasks} getData={getData} projectList={projectList} />;
            })}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
};


export default Pipeline;
