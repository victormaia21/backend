import { Request, Response } from 'express';
import db from '../db/conn';
import haversine from '../middleware/haversine';
import Genetic, { Entity, Optimize, Select1, Select2, Crossover } from 'genetic-js';

interface Coordenada {
    latitude: number;
    longitude: number;
}

interface Cliente {
    id: number;
    nome: string;
    email: string;
    telefone: string;
    latitude: number;
    longitude: number;
}
export default class ClienteController {
    static async teste(req: Request, res: Response) {
        const nome = "Victor";
        const email = "Victor@gmail.com";
        const telefone = "68996028395";
      
        const sql = "INSERT INTO clientes (nome, email, telefone) VALUES ($1, $2, $3)";
      
        db.query(sql, [nome, email, telefone], (err, result) => {
          if (err) {
            res.status(422).json({ err });
          } else {
            res.status(201).json({ message: "Cliente criado com sucesso" });
          }
      
        });
      }

      static async Registrar(req:Request,res:Response) {
        const {nome,email,telefone,cor_x,cor_y} = req.body;

        if(!nome) {
            return res.status(422).json({message:"Nome obrigatorio!"});
        } 
        
        if(!email) {
            return res.status(422).json({message:"Email obrigatorio!"});
        }

        if(!telefone) {
            return res.status(422).json({message:"Telefone obrigatorio!"});
        }

        if(!cor_x) {
            return res.status(422).json({message:"Cordenada x obrigatoria"})
        }

        if(!cor_y) {
            return res.status(422).json({message:"Cordenada y obrigatoria"})
        }

        const sql1 = "INSERT INTO clientes (nome, email, telefone, createdat, updateat) VALUES ($1, $2, $3, NOW()::timestamp, NOW()::timestamp)";

        const cliente = await db.query(sql1,[nome,email,telefone])

        const sqlPegarUltimoCliente = "SELECT id FROM clientes ORDER BY id DESC LIMIT 1";
        const {rows} = await db.query(sqlPegarUltimoCliente);

        const {id} = rows[0]

        const sql2 = "INSERT INTO cordenadas (cor_x,cor_y,cliente_id) VALUES ($1,$2,$3)"
        
        db.query(sql2,[cor_x,cor_y,id],(err,result) => {
            if(err) {
                console.log(err)
            } else {
                res.status(201).json({message:"Cliente criado com sucesso"})
            }
        });
      }

      static async AllClientes(req:Request,res:Response) {
        const {per_pg,pg,filter} = req.params;

        const porPagina = Number(per_pg) ? Number(per_pg) : 10;
        const pagina = Number(pg) ? Number(pg) : 1;
        const filtro = filter ? filter : 'MAIS_ANTIGO';

        let sql : string;

        const ultima = porPagina * pagina;
        const primeira = ultima - porPagina;

        
        if(filtro === 'MAIS_NOVO') {
            sql = "SELECT * FROM clientes ORDER BY createdat DESC OFFSET $1 LIMIT $2";
        }
        if(filter === 'ORDEM_ALFABETICA') {
            sql = "SELECT * FROM clientes ORDER BY nome ASC OFFSET $1 LIMIT $2";
        } else {
            sql = "SELECT * FROM clientes ORDER BY createdat ASC OFFSET $1 LIMIT $2";
        }

        db.query(sql,[primeira,ultima],(err,result) => {
            if(err) {
                res.status(500).json({err})
            } else {
                
                res.status(200).json({
                    clientes:result.rows
                });
            }
        })
      }

      static async PegarClientePorNome(req:Request,res:Response) {
        const { nome, per_pg, pg, filter } = req.params;

        const porPagina = Number(per_pg) ? Number(per_pg) : 10;
        const pagina = Number(pg) ? Number(pg) : 1;
        const filtro = filter ? filter : 'MAIS_ANTIGO';
    
        let sql: string;
    
        const ultima = porPagina * pagina;
        const primeira = ultima - porPagina;
    
        if (filtro === 'MAIS_NOVO') {
            sql = "SELECT * FROM clientes AS c WHERE c.nome ILIKE $1 ORDER BY createdat DESC OFFSET $2 LIMIT $3";
        } else if (filtro === 'ORDEM_ALFABETICA') {
            sql = "SELECT * FROM clientes AS c WHERE c.nome ILIKE $1 ORDER BY nome ASC OFFSET $2 LIMIT $3";
        } else {
            sql = "SELECT * FROM clientes AS c WHERE c.nome ILIKE $1 ORDER BY createdat ASC OFFSET $2 LIMIT $3";
        }
    
        db.query(sql, [`%${nome}%`, primeira, ultima], (err, result) => {
            if (err) {
                res.status(500).json({ err });
            } else {
                res.status(200).json({
                    clientes: result.rows
                });
            }
        });
      }

      static async PegarClientePorEmail(req:Request,res:Response) {
        const { email, per_pg, pg, filter } = req.params;

        const porPagina = Number(per_pg) ? Number(per_pg) : 10;
        const pagina = Number(pg) ? Number(pg) : 1;
        const filtro = filter ? filter : 'MAIS_ANTIGO';
    
        let sql: string;
    
        const ultima = porPagina * pagina;
        const primeira = ultima - porPagina;
    
        if (filtro === 'MAIS_NOVO') {
            sql = "SELECT * FROM clientes AS c WHERE c.email ILIKE $1 ORDER BY createdat DESC OFFSET $2 LIMIT $3";
        } else if (filtro === 'ORDEM_ALFABETICA') {
            sql = "SELECT * FROM clientes AS c WHERE c.email ILIKE $1 ORDER BY nome ASC OFFSET $2 LIMIT $3";
        } else {
            sql = "SELECT * FROM clientes AS c WHERE c.email ILIKE $1 ORDER BY createdat ASC OFFSET $2 LIMIT $3";
        }
    
        db.query(sql, [`%${email}%`, primeira, ultima], (err, result) => {
            if (err) {
                res.status(500).json({ err });
            } else {
                res.status(200).json({
                    clientes: result.rows
                });
            }
        });
      }

      static async PegarClientePorTelefone(req:Request,res:Response) {
        const { telefone, per_pg, pg, filter } = req.params;

        const porPagina = Number(per_pg) ? Number(per_pg) : 10;
        const pagina = Number(pg) ? Number(pg) : 1;
        const filtro = filter ? filter : 'MAIS_ANTIGO';
    
        let sql: string;
    
        const ultima = porPagina * pagina;
        const primeira = ultima - porPagina;
    
        if (filtro === 'MAIS_NOVO') {
            sql = "SELECT * FROM clientes AS c WHERE c.telefone ILIKE $1 ORDER BY createdat DESC OFFSET $2 LIMIT $3";
        } else if (filtro === 'ORDEM_ALFABETICA') {
            sql = "SELECT * FROM clientes AS c WHERE c.telefone ILIKE $1 ORDER BY nome ASC OFFSET $2 LIMIT $3";
        } else {
            sql = "SELECT * FROM clientes AS c WHERE c.telefone ILIKE $1 ORDER BY createdat ASC OFFSET $2 LIMIT $3";
        }
    
        db.query(sql, [`%${telefone}%`, primeira, ultima], (err, result) => {
            if (err) {
                res.status(500).json({ err });
            } else {
                res.status(200).json({
                    clientes: result.rows
                });
            }
        });
      }

      
      static async CalcularDistanciaCliente(req: Request, res: Response) {
        const { latitudeEmpresa, longitudeEmpresa } = req.params;

        // Obter os clientes e suas coordenadas do banco de dados
        const query = "SELECT cli.id, cli.nome, cli.email, cli.telefone, cor.cor_x as latitude, cor.cor_y as longitude FROM clientes as cli, cordenadas as cor WHERE cor.cliente_id = cli.id";
        const { rows: clientes } = await db.query(query);

        // Adicione a coordenada da empresa ao início da lista de clientes
        const coordenadaEmpresa: Coordenada = {
            latitude: +latitudeEmpresa,
            longitude: +longitudeEmpresa,
        };

        const clientesComEmpresa = [coordenadaEmpresa, ...clientes];

        // Encontrar a rota otimizada usando o algoritmo de Força Bruta
        const melhorRota = ClienteController.calcularRotaForcaBruta(clientesComEmpresa);

        // Calcular a distância percorrida para cada cliente e o total
        let distanciaTotal = 0;
        const distanciasPorCliente: { cliente: Cliente, distancia: string }[] = [];

        for (let i = 0; i < melhorRota.length - 1; i++) {
            const pontoAtual = melhorRota[i];
            const pontoProximo = melhorRota[i + 1];

            const distanciaEntrePontos = ClienteController.calcularDistanciaHaversine(
                pontoAtual.latitude, pontoAtual.longitude,
                pontoProximo.latitude, pontoProximo.longitude
            );

            distanciaTotal += distanciaEntrePontos;

            // Armazenar a distância para cada cliente
            if (i < clientes.length) {
                distanciasPorCliente.push({
                    cliente: clientes[i],
                    distancia: distanciaEntrePontos.toFixed(2),
                });
            }
        }

        // Ordenar distanciasPorCliente pela distância
        distanciasPorCliente.sort((a, b) => parseFloat(a.distancia) - parseFloat(b.distancia));

        res.json({
            melhorRota,
            distanciaTotal: distanciaTotal.toFixed(2),
            distanciasPorCliente,
        });
    }

    private static calcularRotaForcaBruta(clientes: Coordenada[]): Coordenada[] {
        let melhorRota: Coordenada[] | null = null;
        let menorDistancia = Infinity;

        // Função para calcular a distância total de uma rota
        const calcularDistanciaTotal = (rota: Coordenada[]): number => {
            let distanciaTotal = 0;

            for (let i = 0; i < rota.length - 1; i++) {
                const pontoAtual = rota[i];
                const pontoProximo = rota[i + 1];

                const distanciaEntrePontos = ClienteController.calcularDistanciaHaversine(
                    pontoAtual.latitude, pontoAtual.longitude,
                    pontoProximo.latitude, pontoProximo.longitude
                );

                distanciaTotal += distanciaEntrePontos;
            }

            return distanciaTotal;
        };

        // Função para trocar dois elementos em um array
        const trocarElementos = (array: Coordenada[], i: number, j: number): void => {
            const temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        };

        // Algoritmo de Força Bruta para encontrar a melhor rota
        const permutar = (array: Coordenada[], inicio: number): void => {
            if (inicio === array.length - 1) {
                const distanciaAtual = calcularDistanciaTotal(array);

                if (distanciaAtual < menorDistancia) {
                    menorDistancia = distanciaAtual;
                    melhorRota = [...array];
                }
            } else {
                for (let i = inicio; i < array.length; i++) {
                    trocarElementos(array, inicio, i);
                    permutar([...array], inicio + 1);
                    trocarElementos(array, inicio, i);
                }
            }
        };

        // Iniciar o algoritmo de Força Bruta
        permutar([...clientes], 1);

        return melhorRota || [];
    }

    private static calcularDistanciaHaversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
        const raioTerra = 6371;

    // Converter graus para radianos
    const grausParaRadianos = (graus: number): number => {
        return graus * (Math.PI / 180);
    };

    // Diferenças de coordenadas em radianos
    const dLat = grausParaRadianos(lat2 - lat1);
    const dLon = grausParaRadianos(lon2 - lon1);

    // Fórmula de Haversine
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(grausParaRadianos(lat1)) * Math.cos(grausParaRadianos(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    // Distância em quilômetros
    const distancia = raioTerra * c;

    return distancia;
    }

}