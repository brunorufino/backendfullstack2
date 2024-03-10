import Dependente from "../Modelo/dependente.js";

export default class DependenteCtrl {

    gravar(requisicao,resposta){
        resposta.type('application/json');
        if (requisicao.method === 'POST' && requisicao.is('application/json')) {  

            const dados = requisicao.body;
            const nome = dados.nome;
            const idade = dados.idade;
            const sexo = dados.sexo;

            if(nome && idade && sexo ){
                const dependente = new Dependente(0,nome,idade,sexo);
                dependente.gravar().then(() => {
                    resposta.status(200).json({
                        "status": true,
                        "codigoGerado": dependente.codigo,
                        "mensagem": "Dependente incluído com sucesso!"
                    });
                })
                    .catch((erro) => {
                        resposta.status(500).json({
                            "status": false,
                            "mensagem": "Erro ao registrar um novo dependente:" + erro.message
                        });
                    });
            }
            else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Por favor, informe todos os campos do dependente!"
                });
            }
        }
    }

    atualizar(requisicao,resposta){
        resposta.type('application/json');
        if ((requisicao.method === 'PUT' || requisicao.method === 'PATCH') && requisicao.is('application/json')) {

            const dados = requisicao.body;
            const codigo = dados.codigo;
            const nome = dados.nome;
            const idade = dados.idade;
            const sexo = dados.sexo;


            console.log(codigo);
            console.log(nome);
            console.log(idade);
            console.log(sexo);

            if (codigo != null && nome != null && idade != null & sexo != null ) {
                const dependente = new Dependente(codigo,nome,idade,sexo)

                dependente.alterar().then(() => {
                    resposta.status(200).json({
                        "status": true,
                        "mensagem": "Dependente atualizado com sucesso!"
                    });
                })
                    .catch((erro) => {
                        resposta.status(500).json({
                            "status": false,
                            "mensagem": "Erro ao atualizar o Dependente:" + erro.message
                        });
                });
            }
            else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Por favor, informe todos os campos do dependente!"
                });
            }
        }
        else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Por favor, utilize os métodos PUT ou PATCH para atualizar o dependente!"
            });
        }
    }

    excluir(requisicao,resposta){
        resposta.type('application/json');
        if (requisicao.method === 'DELETE' && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const codigo = dados.codigo;
            
            if(codigo){
                const dependente = new Dependente(codigo)
                dependente.excluir().then(() => {
                    resposta.status(200).json({
                        "status": true,
                        "mensagem": "Dependente excluído com sucesso!"
                    });
                })
                    .catch((erro) => {
                        resposta.status(500).json({
                            "status": false,
                            "mensagem": "Erro ao excluir o dependente:" + erro.message
                        });
                    });
            }
            else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Por favor, informe o código do dependente!"
                });
            }
        }
        else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Por favor, utilize o método DELETE para excluir um dependente!"
            });
        }

    }

    consultar(requisicao, resposta) {
        resposta.type('application/json');
        
        let termo = requisicao.params.termo;
        if (!termo){
            termo = "";
        }
        if (requisicao.method === "GET"){
            const dependente = new Dependente();
            dependente.consultar(termo).then((listaDependentes)=>{
                resposta.json(
                    {
                        status:true,
                        listaDependentes
                    });
            })
            .catch((erro)=>{
                resposta.json(
                    {
                        status:false,
                        mensagem:"Não foi possível obter os dependentes: " + erro.message
                    }
                );
            });
        }
        else 
        {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Por favor, utilize o método GET para consultar dependentes!"
            });
        }
    }

}