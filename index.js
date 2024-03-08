import express from 'express';
import cors from 'cors';
import rotaDepartamento from './Rotas/rotaDepartamento.js';
import rotaFuncionario from './Rotas/rotaFuncionario.js';
import dotenv from 'dotenv';
import session from 'express-session';
import rotaLogin from './Rotas/rotaLogin.js';
import { verificarAcesso } from './Seguranca/Autenticacao.js';

const host='0.0.0.0';
const porta='3000';

dotenv.config();



const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
    secret: 'm1Nh4Ch4v3SeCr3T4',
    resave: false,
    saveUninitialized: true,
    maxAge: 1000 * 60 * 5
}))

app.use('/login',rotaLogin);
app.use('/departamento',verificarAcesso,rotaDepartamento);
app.use('/funcionario',verificarAcesso,rotaFuncionario);

app.listen(porta, host, ()=>{
    console.log(`Servidor escutando na porta ${host}:${porta}.`);
})



