import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const getTrains = async (req, res) => {
  const allTrains = await prisma.train.findMany({
    include: {
      pivot_tag: {
        include: {
          tag: true
        }
      }
    }
  })
  res.send(allTrains);
}

export const createTrain = async (req, res) => {
  const train = req.body;
  const resTrain = await prisma.train.create({
    data: req.body
  })
  res.send(resTrain);
};


export const getProjectTrain = async (req, res) => {
  const resTrain = await prisma.train.findMany({
    where: {
      project_id: parseInt(req.params.id)
    }
  })

  res.send(resTrain)
};

export const getTrain = async (req, res) => {
  const resTrain = await prisma.train.findUnique({
    include: {
      pivot_tag: {
        include: {
          tag: true
        }
      }
    },
    where: {
      train_id: parseInt(req.params.id)
    }
  })
  res.send(resTrain)
};

export const deleteTrain = async (req, res) => {
  const delTrain = await prisma.train.delete({
    where: {
      train_id: parseInt(req.params.id)
    }
  })
  res.send(delTrain)
};

export const updateTrain = async (req, res) => {

  const updateTrain = await prisma.train.update({
    where: {
      train_id: parseInt(req.params.id),
    },
    data: req.body.data,
  })

  res.send(updateTrain)
};

export const configurePortfolio = async (req, res) => {
  const resConfiguration = await prisma.train.create({
    data: {
      application_name: req.body.data.client_name + ' - Portfolio',
      project_id: req.body.data.project_id,
      consultant_id: req.body.data.consultant_id,
      portfolio: true
    }
  })

  res.send(resConfiguration);
};