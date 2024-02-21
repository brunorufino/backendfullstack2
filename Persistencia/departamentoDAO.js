import Departamento from '../Modelo/departamento.js';
import conectar from './conexao.js';

export default class DepartamentoDAO {

    async gravar(departamento) {
        if (departamento instanceof Departamento) {
            const sql = `INSERT INTO departamento(
                dept_descricao,
                dept_localizacao,
                dept_nome,
                dept_responsavel,
                dept_telefone)
                VALUES(?,?,?,?,?)`;
            const parametros = [departamento.descricao, departamento.localizacao, departamento.nome,
                departamento.responsavel, departamento.telefone];

            const conexao = await conectar();
            const retorno = await conexao.execute(sql, parametros);
            departamento.codigo = retorno[0].insertId;
            global.poolConexoes.releaseConnection(conexao);
        }
    }
    async atualizar(departamento) {
        if (departamento instanceof Departamento) {
            const sql = `UPDATE departamento SET dept_descricao = ?, dept_localizacao = ?,
            dept_nome = ?, dept_responsavel = ?, dept_telefone = ?
            WHERE dept_codigo = ?`;
            const parametros = [departamento.descricao, departamento.localizacao, departamento.nome,
                departamento.responsavel, departamento.telefone,departamento.codigo];

            const conexao = await conectar();
            await conexao.execute(sql, parametros);
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async excluir(departamento) {
        if (departamento instanceof Departamento) {
            const sql = `DELETE FROM departamento WHERE dept_codigo = ?`;
            const parametros = [departamento.codigo];
            const conexao = await conectar();
            await conexao.execute(sql, parametros);
            global.poolConexoes.releaseConnection(conexao);
        }
    }

   async consultar(termo){

    var condicao="";
    let valores;

    if (!isNaN(parseFloat(termo)) && isFinite(termo)){
        condicao = " dept_codigo = "
        valores = [termo];
    }
    else{
        condicao = " dept_nome LIKE "
        valores = ['%' + termo +'%'];
    }

    const conexao = await conectar();
    const sql = "SELECT * FROM departamento WHERE "+condicao+" ? ORDER BY dept_nome";
    console.log(sql);
    const [rows] = await conexao.query(sql,valores);
    const listaDep = [];

    for(const row of rows){
       
        const departamento = new Departamento(row['dept_codigo'],row['dept_descricao'],row['dept_localizacao'],row['dept_nome'],row['dept_responsavel'],row['dept_telefone']);
        listaDep.push(departamento);
    }

    return listaDep;
}


   
}