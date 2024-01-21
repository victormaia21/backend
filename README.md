- O projeto pode ser rodado com "yarn start ou npm start" primeiramente instalando os pacotes com npm install ou yarn.
- Entre na pasta db/coon.ts, lá vai ficar todas as informações de conexão de banco de dados, caso precise mudar, fique a disposição.
- Abra o postgres e use os seguinte comandos para criar o banco de dados "CREATE DATABASE teste_linkedin"
- Depois crie as tabelas
- 
CREATE TABLE clientes (
	id SERIAL PRIMARY KEY,
	nome VARCHAR(50) NOT NULL,
	email VARCHAR(50) NOT NULL,
	telefone VARCHAR(30) NOT NULL,
	createdat TIMESTAMP NOT NULL,
	updateat TIMESTAMP NOT NULL
);

CREATE TABLE cordenadas (
	id SERIAL PRIMARY KEY,
	cor_x VARCHAR(100) NOT NULL,
	cor_y VARCHAR(100) NOT NULL,
	cliente_id INT REFERENCES clientes(id)
);

INSERT INTO clientes (nome,email,telefone,createdat,updateat) VALUES ('João victor','jv@gmail.com','68996028395',NOW()::timestamp,NOW()::timestamp);
INSERT INTO clientes (nome,email,telefone,createdat,updateat) VALUES ('Roberto','roberto0@gmail.com','68996028395',NOW()::timestamp,NOW()::timestamp);
INSERT INTO clientes (nome,email,telefone,createdat,updateat) VALUES ('Diego','diego@gmail.com','68996028395',NOW()::timestamp,NOW()::timestamp);
INSERT INTO clientes (nome,email,telefone,createdat,updateat) VALUES ('Carlos','carlos@gmail.com','68996028395',NOW()::timestamp,NOW()::timestamp);


