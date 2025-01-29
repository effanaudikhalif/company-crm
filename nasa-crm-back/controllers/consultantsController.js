import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const getConsultants = async (req, res) => {
    const allConsultants = await prisma.consultant.findMany({
        orderBy: {
            consultant_id: 'asc',
        }
    })
    res.send(allConsultants);
}

export const createConsultant= async (req, res) => {   
    const resConsultant = await prisma.consultant.create({
        data: req.body
      })
    res.send(resConsultant);
};

export const getConsultant = async (req, res) => {
    const resConsultant = await prisma.consultant.findUnique({
        where: {
            consultant_id : parseInt(req.params.id)
        }
      })
    res.send(resConsultant)
};

export const deleteConsultant= async (req, res) => { 
    const delConsultant = await prisma.consultant.delete({
        where: {
            consultant_id : parseInt(req.params.id)
        }
      })
    res.send(delConsultant)
};

export const updateConsultant= async (req,res) => {
    const updateConsultant = await prisma.consultant.update({
        where: {
            consultant_id: parseInt(req.params.id),
        },
        data: req.body.data,
      })
    
    res.send(updateConsultant)
};


export const updateProjectConsultant = async (req,res) => {
    const consultantList = req.body;
  
    await prisma.pivot_project_consultant.deleteMany({
        where: {
          project_id: parseInt(req.params.id),
        }
      })
  
    let newConsultantList = []
    consultantList.consultant_id.map(cons => {
      newConsultantList.push({project_id : parseInt(req.params.id), consultant_id: parseInt(cons)})
    })
  
    const resCons = await prisma.pivot_project_consultant.createMany({
        data: newConsultantList
    })
    
    res.send(resCons)
  };