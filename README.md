# nasa-crm

## CI/CD

The CI/CD has been automated through docker, the file .gitlab-ci.yml contain the list of command to exectude everytime a push is made to the main branch. 
It will build 3 images, an image for the frontend, a frontend for local dev and one for the backend. Respectively called nasa-crm-front, nasa-crm-front_local and nasa-crm-back.

Since everything is automated, no actions are needed for this step.

## What to do to put it in prod

Everything is described in the .gitlab-di.yml, and the deployement is automatically pushed in nasa-crm.corp.castsoftware.com through docker compase. 
The list of steps is written in the docker-compose.yml.

## What to do to put it in prod *in local*

Since the images are automatically generated and put in the Deploy->Container Registry, the local dev env is already generated.

Create a folder where you put the docker-composs.yml, *you have to change nasa-crm-front to nasa-crm-front_local*, then execute these command to run the different images as one container : 

``
docker compose down
docker compose pull
docker compose up -d --build
``

PS : Your local machin needs to be connected to the gitlab repo to be able to pull the different images

``
docker login registry.gitlab.com
user : watkinscast
password : EBC2q2gKYOAmWBeJtm6n
``

These credentials are stored in the nasa Keypass.# company-crm
