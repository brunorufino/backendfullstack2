import Dependente from "../Modelo/dependente.js";
import conectar from "./conexao.js";

export default class DependenteDAO{

    async gravar(dependentes) {
        if (dependentes instanceof Dependente) {
            const sql = `INSERT INTO dependentes(
                dep_nome,dep_idade,dep_sexo)
                VALUES(?,?,?)`;
            const parametros = [dependentes.nome, dependentes.idade, dependentes.sexo];

            const conexao = await conectar();
            const retorno = await conexao.execute(sql, parametros);
            dependentes.codigo = retorno[0].insertId;
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async atualizar(dependentes) {
        if (dependentes instanceof Dependente) {
            const sql = `UPDATE dependentes SET dep_nome = ?, dep_idade = ?,
            dep_sexo = ? WHERE dep_codigo = ?`;
            const parametros = [dependentes.nome, dependentes.idade, dependentes.sexo, dependentes.codigo];

            const conexao = await conectar();
            await conexao.execute(sql, parametros);
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async excluir(dependentes) {
        if (dependentes instanceof Dependente) {
            const sql = `DELETE FROM dependentes WHERE dep_codigo = ?`;
            const parametros = [dependentes.codigo];
            const conexao = await conectar();
            await conexao.execute(sql, parametros);
            global.poolConexoes.releaseConnection(conexao);
        }
    }

   async consultar(termo){

    var condicao="";
    let valores;

    if (!isNaN(parseFloat(termo)) && isFinite(termo)){
        condicao = " dep_codigo = "
        valores = [termo];
    }
    else{
        condicao = " dep_nome LIKE "
        valores = ['%' + termo +'%'];
    }

    const conexao = await conectar();
    const sql = "SELECT * FROM dependentes WHERE "+condicao+" ? ORDER BY dep_nome";
    console.log(sql);
    const [rows] = await conexao.query(sql,valores);
    global.poolConexoes.releaseConnection(conexao);
    const listaDep = [];

    for(const row of rows){
       
        const dependentes = new Dependente(row['dep_codigo'],row['dep_nome'],row['dep_idade'],row['dep_sexo']);
        listaDep.push(dependentes);
    }

    return listaDep;
}

}