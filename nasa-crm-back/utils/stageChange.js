import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

let previousState = null;

// Function to query the database for changes
export const checkForStageChanges = async (io) => {
  const currentState = await prisma.train.findMany({
    select: {
      train_id: true,
      stage_id: true,
      runningflag: true
    },
  })

  // Check if previousState is null or currentState is different from previousState
  if (!previousState || !compareStates(previousState, currentState)) {
    // Compare currentState with previousState to detect changes
    //console.log('Changes detected');
    //console.log('Current state:', currentState);
    //console.log('Previous state:', previousState);

    // Update previousState
    previousState = currentState;

    // socket.io == See getTrains() in trainsController
    const train = await prisma.train.findMany({
      include: {
        pivot_tag: {
          include: {
            tag: true
          }
        }
      }
    })

    io.emit('stageChange', train);
  }

};

// Function to compare two states and determine if they are equal
const compareStates = (state1, state2) => {
  // Convert objects to JSON strings and compare them
  const state1String = JSON.stringify(state1);
  const state2String = JSON.stringify(state2);
  return state1String === state2String;
};