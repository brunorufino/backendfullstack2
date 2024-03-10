import DependenteDAO from "../Persistencia/dependenteDAO.js";

export default class Dependente {

    #dep_codigo;
    #dep_nome;
    #dep_idade;
    #dep_sexo;

    constructor(codigo=0, nome="", idade=0, sexo="") {
        this.#dep_codigo = codigo;
        this.#dep_nome = nome;
        this.#dep_idade=idade;
        this.#dep_sexo = sexo;
    }

    // Métodos de acesso públicos

    get codigo() {
        return this.#dep_codigo;
    }

    set codigo(novoCodigo) {
        this.#dep_codigo = novoCodigo;
    }

    get nome() {
        return this.#dep_nome;
    }

    set nome(novoNome) {
        this.#dep_nome = novoNome;
    }

    get idade(){
        return this.#dep_idade;
    }
 
    get sexo(){
        return this.#dep_sexo;
    }

    // Override do método toJSON

    toJSON() {
        return {
            codigo: this.#dep_codigo,
            nome: this.#dep_nome,
            idade: this.#dep_idade,
            sexo: this.#dep_sexo
        };
    }

    async gravar(){
        const depDAO = new DependenteDAO();
        await depDAO.gravar(this);
     }
 
     async excluir(){
        const depDAO = new DependenteDAO();
        await depDAO.excluir(this);
     }
 
     async alterar(){
        const depDAO = new DependenteDAO();
        await depDAO.atualizar(this);
     }
 
     async consultar(termo){
        const depDAO = new DependenteDAO();
        return await depDAO.consultar(termo);
     }
}