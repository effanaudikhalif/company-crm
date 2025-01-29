import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const getStages = async (req, res) => {
    const allStages = await prisma.stage.findMany({ where: { active : true, display : true}, orderBy: { executionorder : 'asc' }})
    res.send(allStages);
}