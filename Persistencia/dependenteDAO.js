import Dependente from "../Modelo/dependente";
import conectar from "./conexao.js";

export default class DependenteDAO{

    // um dependente no banco de dados grava registro na tabela dependentes e também na tabela funcionário dependente
    async gravar(dependente){
        

        if(dependente instanceof Dependente){

            const conexao = await conectar();
            conexao.beginTransaction();

            try {
                
                const sql = 'INSERT INTO dependentes (dep_nome, dep_parentesco) VALUES (?,?)';
                const parametros = [dependente.nome,dependente.parentesco];
                const retorno = await conexao.conexao(sql,parametros);
                dependente.codigo = retorno[0].insertId;


                
                conexao.commit();

            } catch (error) {
                conexao.rollback();

            }
        }

    }

}