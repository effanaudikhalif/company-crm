import express from "express";
import bodyParser from "body-parser";
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';

import consultantsRoutes from "./routes/consultants.js";
import trainRoutes from './routes/trains.js'
import projectRoutes from './routes/projects.js'
import stageRoutes from './routes/stages.js'
import tagRoutes from './routes/tags.js'
import clientRoutes from './routes/clients.js'
import saleRoutes from './routes/sales.js'
import configurationRoutes from './routes/configurations.js'
import { checkForStageChanges } from './utils/stageChange.js'

const app = express();
const PORT = 443;

app.use(cors()) // Use this after the variable declaration

app.use(bodyParser.json());

app.use("/consultants", consultantsRoutes);
app.use("/trains", trainRoutes);
app.use("/projects", projectRoutes);
app.use("/stages", stageRoutes);
app.use("/tags", tagRoutes);
app.use("/clients", clientRoutes);
app.use("/sales", saleRoutes);
app.use("/configurations", configurationRoutes);

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
      origin: '*'
    }
});

server.listen(PORT, () => console.log(`Server running on port: http://localhost:${PORT}`));


setInterval(() => checkForStageChanges(io), 1000);