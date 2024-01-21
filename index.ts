import express from 'express';
import cors from 'cors';
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cors({credentials:true,origin:"*"}));

const PORT = process.env.PORT || 3000;

import ClienteRoutes from "./routes/ClienteRoutes";

app.use("/clientes",ClienteRoutes);

app.listen(PORT,() => console.log(`Running on port ${PORT}`));

