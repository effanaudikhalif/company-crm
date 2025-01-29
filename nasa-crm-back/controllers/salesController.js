import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const getSales = async (req, res) => {
    const allSales = await prisma.sale.findMany()
    res.send(allSales);
}

export const createSale= async (req, res) => {   
    const resSale = await prisma.sale.create({
        data: req.body
      })
    res.send(resSale);
};

export const getSale = async (req, res) => {
    const resSale = await prisma.sale.findUnique({
        where: {
            sale_id : parseInt(req.params.id)
        }
      })
    res.send(resSale)
};

export const deleteSale= async (req, res) => { 
    const delSale = await prisma.sale.delete({
        where: {
            sale_id : parseInt(req.params.id)
        }
      })
    res.send(delSale)
};

export const updateSale= async (req,res) => {
    const updateSale = await prisma.sale.update({
        where: {
            sale_id: parseInt(req.params.id),
        },
        data: req.body.data,
      })
    
    res.send(updateSale)
};