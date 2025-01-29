import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const getConfigurations = async (req, res) => {
    const allConfigurations = await prisma.infraconfig.findMany()
    res.send(allConfigurations);
}

export const createConfiguration= async (req, res) => {   
    const resConfiguration = await prisma.infraconfig.create({
        data: req.body
      })
    res.send(resConfiguration);
};

export const getConfiguration = async (req, res) => {
    const resConfiguration = await prisma.infraconfig.findFirst({
        where: {
            project_id : parseInt(req.params.id)
        }
      })
    res.send(resConfiguration)
};

export const deleteConfiguration= async (req, res) => { 
    const delConfiguration = await prisma.infraconfig.delete({
        where: {
            infraconfig_id : parseInt(req.params.id)
        }
      })
    res.send(delConfiguration)
};

export const updateConfiguration= async (req,res) => {
    const updateConfiguration = await prisma.infraconfig.update({
        where: {
            infraconfig_id: parseInt(req.params.id),
        },
        data: req.body.data,
      })
    
    res.send(updateConfiguration)
};