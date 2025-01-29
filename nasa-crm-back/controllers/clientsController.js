import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const getClients = async (req, res) => {
    const allClients = await prisma.client.findMany({orderBy: {
        name: 'asc',
    }})
    res.send(allClients);
}

export const createClient= async (req, res) => {   
    const resClient = await prisma.client.create({
        data: req.body
      })
    res.send(resClient);
};

export const getClientsByName = async (req, res) => {
    const resClient = await prisma.client.findMany({
        where: {
            name : {
                contains: req.params.name.toUpperCase()
            }
        }
      })
    res.send(resClient)
};

export const getClient = async (req, res) => {
    const resClient = await prisma.client.findUnique({
        where: {
            client_id : parseInt(req.params.id)
        }
      })
    res.send(resClient)
};

export const deleteClient= async (req, res) => { 
    const delClient = await prisma.client.delete({
        where: {
            client_id : parseInt(req.params.id)
        }
      })
    res.send(delClient)
};

export const updateClient= async (req,res) => {
    const updateClient = await prisma.client.update({
        where: {
            client_id: parseInt(req.params.id),
        },
        data: req.body.data,
      })
    
    res.send(updateClient)
};