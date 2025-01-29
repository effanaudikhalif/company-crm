import React, {useEffect, createContext, useContext, useState } from 'react';
import api from '../api/axios';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
    
  const [tag, setTag] = useState();
  const [stagesTrain, setStagesTrain] = useState();
  const [stagesProject, setStagesProject] = useState();
  const [consultants, setConsultants] = useState();
  const [dataLoading, setDataLoading] = useState(true);


  const getTag = async () => {
    await api.get('/tags/')
    .then(function (response) {
    // handle success
    setTag(response.data)
    })
    .catch(function (error) {
    // handle error
    console.log(error);
    })
  }

  const getStages = async () => {
    await api.get('/stages')
    .then(function (response) {
    // handle success
    setStagesTrain(response.data.filter(x => x.context == "train"))
    setStagesProject(response.data.filter(x => x.context == "project"))
    })
    .catch(function (error) {
    // handle error
    console.log(error);
    })
  }

  const getConsultants = async () => {
    await api.get('/consultants')
    .then(function (response) {
    // handle success
    setConsultants(response.data)
    })
    .catch(function (error) {
    // handle error
    console.log(error);
    })
  }

  useEffect(() => {

    const executeAsyncFunctions = async () => {

      try {
        // Use Promise.all to wait for all promises to settle
        await Promise.all([
          getTag(),
          getStages(),
          getConsultants(),
          //getClients()
        ]);

      } catch (error) {
        console.error('DataProvider, Error fetching data:', error);
      } finally {
        // Set loading to false once all async operations are done

        setDataLoading(false);
      }
    }

    executeAsyncFunctions() 
  }, []);

  return (
    <DataContext.Provider value={{ tag, stagesProject, stagesTrain, consultants, dataLoading }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  return useContext(DataContext);
};