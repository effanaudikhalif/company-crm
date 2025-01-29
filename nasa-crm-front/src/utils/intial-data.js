export const initialDataProject = {
    tasks: {
    },
    columns: {
      'column-1': {
        id: 'column-1',
        title: 'Pipeline',
        taskIds: [],
      },
      'column-2': {
        id: 'column-2',
        title: 'Qualification',
        taskIds: [],
      },
      'column-3': {
        id: 'column-3',
        title: 'Execution',
        taskIds: [],
      },
      'column-4': {
        id: 'column-4',
        title: 'Analysis',
        taskIds: [],
      },
      'column-5': {
        id: 'column-5',
        title: 'Done',
        taskIds: [],
      },
      'column-6': {
        id: 'column-6',
        title: 'Dead',
        taskIds: [],
      }
    },
    // Facilitate reordering of the columns
    columnOrder: ['column-1', 'column-2', 'column-3','column-4', 'column-5', 'column-6'],
  };
  
export const initialDataPipeline = {
    tasks: {
    },
    columns: {
      'column-1': {
        id: 'column-1',
        title: '',
        description:'',
        taskIds: [],
      },
      'column-2': {
        id: 'column-2',
        title: '',
        description:'',
        taskIds: [],
      },'column-3': {
        id: 'column-3',
        title: '',
        description:'',
        taskIds: [],
      },
      'column-4': {
        id: 'column-4',
        title: '',
        description:'',
        taskIds: [],
      }
    },
    // Facilitate reordering of the columns
    columnOrder: ['column-1', 'column-2','column-3', 'column-4'],
  };