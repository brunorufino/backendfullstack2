import Departamento from "../Modelo/departamento.js";
import Dependente from "../Modelo/dependente.js";
import DependenteFuncionario from "../Modelo/dependenteFuncionario.js";
import Funcionario from "../Modelo/funcionario.js";

export default class FuncionarioCtrl {

    gravar(requisicao, resposta) {
        resposta.type('application/json');
        if (requisicao.method === 'POST' && requisicao.is('application/json')) {
           
            const dados = requisicao.body;
            const nome = dados.nome;
            const cargo = dados.cargo;
            const salario = dados.salario;
            const dataAdmissao = dados.dataAdmissao;
            const departamento = dados.departamento;
            const dependenteFuncionario = dados.dependentes;


            const objDepartamento = new Departamento(departamento.codigo);

            const dependentes = [];
            for (const dependente of dependenteFuncionario) {

                    
                    const dep = new Dependente(dependente.codigo);

                    const objDependenteFuncionario = new DependenteFuncionario(dep,dependente.parentesco);
 
                    dependentes.push(objDependenteFuncionario);
                    
            }

            const funcionario = new Funcionario(0,nome,cargo,salario,dataAdmissao,objDepartamento,dependentes);
            
                //resolver a promise
                funcionario.gravar().then(() => {
                    resposta.status(200).json({
                        "status": true,
                        "codigoGerado": funcionario.codigo,
                        "mensagem": "Funcionário cadastrado com sucesso!"
                    });
                })
                    .catch((erro) => {
                        resposta.status(500).json({
                            "status": false,
                            "mensagem": "Erro ao cadastrado o funcionário:" + erro.message
                        });
                    });
        }
        else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Por favor, utilize o método POST para cadastrar um funcionário!"
            });
        }
    }

    atualizar(requisicao, resposta) {
        resposta.type('application/json');
        if ((requisicao.method === 'PUT' || requisicao.method === 'PATCH') && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const codigo = dados.codigo;
            const nome = dados.nome;
            const cargo = dados.cargo;
            const salario = dados.salario;
            const dataAdmissao = dados.dataAdmissao;
            const departamento = dados.departamento;
            const dependenteFuncionario = dados.dependentes;


            const objDepartamento = new Departamento(departamento.codigo);

            const dependentes = [];
            for (const dependente of dependenteFuncionario) {
                    const dep = new Dependente(dependente.codigo);
                    const objDependenteFuncionario = new DependenteFuncionario(dep,dependente.parentesco);
                    dependentes.push(objDependenteFuncionario);
            }

            const funcionario = new Funcionario(codigo,nome,cargo,salario,dataAdmissao,objDepartamento,dependentes);
            
                //resolver a promise
                funcionario.atualizar().then(() => {
                    resposta.status(200).json({
                        "status": true,
                        "mensagem": "Funcionário alterado com sucesso!"
                    });
                })
                    .catch((erro) => {
                        resposta.status(500).json({
                            "status": false,
                            "mensagem": "Erro ao alterar o funcionário:" + erro.message
                        });
                    });
        }
        else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Por favor, utilize os métodos PUT ou PATCH para alterar um funcionário!"
            });
        }
    }

    excluir(requisicao, resposta) {
        resposta.type('application/json');
        if (requisicao.method === 'DELETE' && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const codigo = dados.codigo;
            if (codigo) {
                const funcionario = new Funcionario(codigo);
                //resolver a promise
                funcionario.excluir().then(() => {
                    resposta.status(200).json({
                        "status": true,
                        "mensagem": "Funcionário apagado com sucesso!"
                    });
                })
                    .catch((erro) => {
                        resposta.status(500).json({
                            "status": false,
                            "mensagem": "Erro ao apagado o funcionário:" + erro.message
                        });
                    });
            }
            else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Por favor, informe o código do funcionário!"
                });
            }
        }
        else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Por favor, utilize o método DELETE para excluir um funcionário!"
            });
        }
    }


    consultar(requisicao, resposta) {
        resposta.type('application/json');
       
        let termo = requisicao.params.termo;
        
        if (!termo) {
            termo = "";
        }
        if (requisicao.method === "GET") {
            const funcionario = new Funcionario();
            funcionario.consultar(termo).then((listaFuncionarios) => {
                resposta.json(
                    {
                        status: true,
                        listaFuncionarios
                    });
            })
                .catch((erro) => {
                    resposta.json(
                        {
                            status: false,
                            mensagem: "Não foi possível obter os funcionários: " + erro.message
                        }
                    );
                });
        }
        else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Por favor, utilize o método GET para consultar funcionários!"
            });
        }
    }
}