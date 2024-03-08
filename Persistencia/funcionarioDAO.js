import Funcionario from "../Modelo/funcionario.js";
import conectar from "./conexao.js";

export default class FuncionarioDAO{
    async gravar(funcionario){
        if (funcionario instanceof Funcionario){
            const sql = "INSERT INTO funcionario(func_nome,func_cargo,func_salario,func_dataAdmissao,func_departamento) VALUES(?,?,?,?,?)"; 
            const parametros = [funcionario.nome,funcionario.cargo,funcionario.salario,funcionario.dataAdmissao,funcionario.departamento];
            const conexao = await conectar(); 
            const retorno = await conexao.execute(sql,parametros);
            funcionario.codigo = retorno[0].insertId;
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async atualizar(funcionario){
        if (funcionario instanceof Funcionario){
            const sql = "UPDATE funcionario SET func_nome = ?, func_cargo = ?, func_salario = ?, func_dataAdmissao = ?, func_departamento = ? WHERE func_codigo = ? "; 
            const parametros = [funcionario.nome, funcionario.cargo, funcionario.salario, funcionario.dataAdmissao, funcionario.departamento, funcionario.codigo];
            const conexao = await conectar(); 
            await conexao.execute(sql,parametros); 
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async excluir(funcionario){
        if (funcionario instanceof Funcionario){
            const sql = "DELETE FROM funcionario WHERE func_codigo = ?"; 
            const parametros = [funcionario.codigo];
            const conexao = await conectar(); 
            await conexao.execute(sql,parametros); 
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async consultar(termo){
       
        let parametros=[];
        let valores;
        var condicao="";
        if(!isNaN(parseFloat(termo)) && isFinite(termo)){
            condicao = " func_codigo = "
            valores = [termo];
         }
        else{
             
                condicao = " func_nome LIKE "
                valores = ['%' + termo +'%'];
        }
        const conexao = await conectar();
        const sql = "SELECT a.func_codigo, a.func_nome, a.func_cargo, a.func_salario, a.func_dataAdmissao , b.dept_nome  FROM funcionario a INNER JOIN departamento b ON func_departamento = dept_codigo WHERE "+condicao+" ? ORDER BY func_nome";
      
        console.log(sql);
        const [rows] = await conexao.query(sql,valores);
        global.poolConexoes.releaseConnection(conexao);
        let listaFuncionarios = [];

        for(const row of rows){
       
            const funcionario = new Funcionario(row['func_codigo'],row['func_nome'],row['func_cargo'],row['func_salario'],row['func_dataAdmissao'],row['dept_nome']);
            listaFuncionarios.push(funcionario);
        }



        return listaFuncionarios;
    }
}