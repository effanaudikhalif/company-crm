import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const getProjects = async (req, res) => {
  const allProjects = await prisma.project.findMany({
    include: {
      pivot_project_tag: {
        include: {
          tag: true
        }
      },
      pivot_project_consultant: {
        include: true
      }
    }
  })
  res.send(allProjects);
}

export const createProject = async (req, res) => {
  const resProject = await prisma.project.create({
    data: req.body.data.project
  })

  // add tag if any
  if (req.body.data.tag) {
    let newTagList = []
    const tagList = req.body.data.tag;
    tagList.map(tag => {
      newTagList.push({ project_id: parseInt(resProject.project_id), tag_id: parseInt(tag) })
    })

    const resTag = await prisma.pivot_project_tag.createMany({
      data: newTagList
    })
  }

  // add consultant if any
  if (req.body.data.consultant) {
    let newConsultantList = []
    const consultantList = req.body.data.consultant;
    consultantList.map(consultant => {
      newConsultantList.push({ project_id: parseInt(resProject.project_id), consultant_id: parseInt(consultant) })
    })

    const resTag = await prisma.pivot_project_consultant.createMany({
      data: newConsultantList
    })
  }

  // add config
  req.body.data.configuration.project_id = resProject.project_id
  const resConf = await prisma.infraconfig.create({
    data: req.body.data.configuration
  })

  res.send(resProject);
};

export const getProject = async (req, res) => {
  const resProject = await prisma.project.findUnique({
    include: {
      pivot_project_tag: {
        include: {
          tag: true
        }
      },
      client: true,
      pivot_project_consultant: {
        include: {
          consultant: true
        }
      }
    },
    where: {
      project_id: parseInt(req.params.id)
    }
  })
  res.send(resProject)
};

export const deleteProject = async (req, res) => {
  const delProject = await prisma.project.delete({
    where: {
      project_id: parseInt(req.params.id),
    }
  })
  res.send(delProject)
};

export const updateProject = async (req, res) => {

  const updateProject = await prisma.project.update({
    where: {
      project_id: parseInt(req.params.id),
    },
    data: req.body.data,
  })

  res.send(updateProject)
};

