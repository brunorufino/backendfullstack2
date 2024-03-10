import { Router } from "express";
import DepartamentoCtrl from "../Controle/dependenteCtrl.js";

const depCtrl = new DepartamentoCtrl();
const rotaDepartamento = new Router();

rotaDepartamento
.get('/',depCtrl.consultar)
.get('/:termo', depCtrl.consultar)
.post('/',depCtrl.gravar)
.patch('/',depCtrl.atualizar)
.put('/',depCtrl.atualizar)
.delete('/',depCtrl.excluir);

export default rotaDepartamento;