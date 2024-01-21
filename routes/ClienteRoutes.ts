import { Router } from "express";
const router = Router();
import ClienteController from "../controllers/ClienteController";

router.post("/registro",ClienteController.Registrar);
router.get('/queryCordenada/:latitudeEmpresa/:longitudeEmpresa',ClienteController.CalcularDistanciaCliente);
router.get('/:per_pg?/:pg?/:filter?',ClienteController.AllClientes);
router.get('/queryName/:nome/:per_pg?/:pg?/:filter?',ClienteController.PegarClientePorNome);
router.get('/queryEmail/:email/:per_pg?/:pg?/:filter?',ClienteController.PegarClientePorEmail);
router.get('/queryTelefone/:telefone/:per_pg?/:pg?/:filter?',ClienteController.PegarClientePorTelefone);


export default router;