import Departamento from "../Modelo/departamento.js";
import Dependente from "../Modelo/dependente.js";
import DependenteFuncionario from "../Modelo/dependenteFuncionario.js";
import Funcionario from "../Modelo/funcionario.js";
import conectar from "./conexao.js";

export default class FuncionarioDAO{
    async gravar(funcionario){

        if (funcionario instanceof Funcionario){

            const conexao = await conectar();
            await conexao.beginTransaction();


            try {
                    const sql = "INSERT INTO funcionario(func_nome,func_cargo,func_salario,func_dataAdmissao,func_departamento) VALUES(?,?,?,?,?)"; 
                    const parametros = [funcionario.nome,funcionario.cargo,funcionario.salario,funcionario.dataAdmissao,funcionario.departamento.codigo];
            
                    const retorno = await conexao.execute(sql,parametros);
                    funcionario.codigo = retorno[0].insertId;

                    
                    for (const dependente of funcionario.dependentes) {
                       const sql2 = "INSERT INTO funcionario_dependente (func_codigo, dep_codigo,parentesco) VALUES (?,?,?)";
                       let parametros2 = [funcionario.codigo,dependente.dependente.codigo,dependente.parentesco]
                       await conexao.execute(sql2,parametros2);
                    }
                       
                   await conexao.commit();
                   global.poolConexoes.releaseConnection(conexao);

            } catch (error) {
                  await  conexao.rollback();
                  throw error;
            }

            
        }
    }


    async atualizar(funcionario) {
        if (funcionario instanceof Funcionario) {
            const conexao = await conectar();
            await conexao.beginTransaction();
    
            try {
                const sql = `
                    UPDATE funcionario 
                    SET func_nome = ?, func_cargo = ?, func_salario = ?, func_dataAdmissao = ?, func_departamento = ? 
                    WHERE func_codigo = ?`;
                const parametros = [funcionario.nome,funcionario.cargo,funcionario.salario,funcionario.dataAdmissao, funcionario.departamento.codigo,funcionario.codigo];
                
                await conexao.execute(sql, parametros);
    
                // Atualizar os dependentes (se houver)
                if (funcionario.dependentes && funcionario.dependentes.length > 0) {
                    for (const dependente of funcionario.dependentes) {
                        const sql2 = `
                            INSERT INTO funcionario_dependente (func_codigo, dep_codigo, parentesco) 
                            VALUES (?, ?, ?) 
                            ON DUPLICATE KEY UPDATE parentesco = VALUES(parentesco)`;
                        const parametros2 = [funcionario.codigo,dependente.dependente.codigo ?? null,dependente.parentesco ?? null ];
                        await conexao.execute(sql2, parametros2);
                    }
                }
    
                await conexao.commit();
                global.poolConexoes.releaseConnection(conexao);
            } catch (error) {
                await conexao.rollback();
                throw error;
            }
        }
    }

    async excluir(funcionario) {
        if (funcionario instanceof Funcionario) {
            const conexao = await conectar();
            await conexao.beginTransaction();
    
            try {
                const sqlDependentes = "DELETE FROM funcionario_dependente WHERE func_codigo = ?";
                const parametrosDependentes = [funcionario.codigo];
                await conexao.execute(sqlDependentes, parametrosDependentes);
    
                const sqlFuncionario = "DELETE FROM funcionario WHERE func_codigo = ?";
                const parametrosFuncionario = [funcionario.codigo];
                await conexao.execute(sqlFuncionario, parametrosFuncionario);
    
                await conexao.commit();
                global.poolConexoes.releaseConnection(conexao);
            } catch (error) {
                await conexao.rollback();
                throw error;
            }
        }
    }

    async consultar(termoBusca){
        const listaFuncionarios = [];

        if(!isNaN(termoBusca)){
            const conexao = await conectar();
            const sql = `SELECT * FROM funcionario AS F 
            INNER JOIN departamento AS D  ON F.func_departamento =  dept_codigo
            INNER JOIN funcionario_dependente dep ON dep.func_codigo = F.func_codigo
            INNER JOIN dependentes de ON de.dep_codigo = dep.dep_codigo 
            WHERE F.func_codigo = ?`



            const [registros, campos] = await conexao.execute(sql,[termoBusca]);


            if(registros.length > 0){
               

                const departamento = new Departamento(registros[0].dept_codigo,registros[0].dept_descricao,registros[0].dept_localizacao,registros[0].dept_nome, registros[0].dept_responsavel,registros[0].dept_telefone)
                let listaDependentes = [];
                for (const registro of registros) {

                    const dependente = new Dependente(registro.dep_codigo,registro.dep_nome,registro.dep_idade,registro.dep_sexo);
                    const funcionarioDep = new DependenteFuncionario(dependente,registro.parentesco);
                    listaDependentes.push(funcionarioDep.dependente);

                }
               
                const funcionario = new Funcionario(registros[0].func_codigo,registros[0].func_nome,registros[0].func_cargo,registros[0].func_salario,registros[0].func_dataAdmissao,departamento,listaDependentes)

              
                listaFuncionarios.push(funcionario);
            }

        }
        return listaFuncionarios;   

    }
}