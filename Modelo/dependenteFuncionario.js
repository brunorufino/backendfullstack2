export default class DependenteFuncionario{

    #dependente;
    #parentesco;

    constructor( dependente, parentesco){

        this.#dependente = dependente;
        this.#parentesco = parentesco;
    }

    get dependente(){
        return this.#dependente;
    }

    get parentesco(){
        return this.#parentesco;
    }
}