import { Router } from "express";
import DependenteCtrl from "../Controle/dependenteCtrl.js";

const rotaDependente = new Router();
const dep = new DependenteCtrl();


rotaDependente
.get('/',dep.consultar)
.get('/:termo', dep.consultar)
.post('/',dep.gravar)
.patch('/',dep.atualizar)
.put('/',dep.atualizar)
.delete('/',dep.excluir);

export default rotaDependente;