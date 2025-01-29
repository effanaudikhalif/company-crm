import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const getTags = async (req, res) => {

    const allTags = await prisma.tag.findMany()
    res.send(allTags);
}

export const createTag = (req, res) => {   

};

export const getTag = async (req, res) => {

    const resTag = await prisma.pivot_tag.findMany({
        include:{
            tag:true
        },
        where: {
            train_id : parseInt(req.params.id)
        }
      })
    res.send(resTag.map(x => x.tag))
};

export const deleteTag = (req, res) => { 

};

export const updateTag = async (req,res) => {
    
};

export const updateTrainTag = async (req,res) => {

    const tagList = req.body;

    await prisma.pivot_tag.deleteMany({
        where: {
          train_id: parseInt(req.params.id),
        }
      })

    let newTagList = []
    tagList.tag.map(tag => {
        newTagList.push({train_id : parseInt(req.params.id), tag_id: parseInt(tag)})
    })

    const resTag = await prisma.pivot_tag.createMany({
        data: newTagList
    })
    
    res.send(resTag)
};

export const updateProjectTag = async (req,res) => {
    const tagList = req.body;

    await prisma.pivot_project_tag.deleteMany({
        where: {
          project_id: parseInt(req.params.id),
        }
      })

    let newTagList = []
    tagList.tag.map(tag => {
        newTagList.push({project_id : parseInt(req.params.id), tag_id: parseInt(tag)})
    })

    const resTag = await prisma.pivot_project_tag.createMany({
        data: newTagList
    })
    
    res.send(resTag)
};