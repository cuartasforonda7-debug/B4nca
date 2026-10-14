class Transaccion {
    constructor(tipo, valor, detallesExtra = "") {
        this.id = Date.now().toString();
        this.fechaHora = new Date();

        this.tipo = tipo;
        this.valor = valor;
        this.detallesExtra = detallesExtra; 
    }

    obtenerResumen() {
        return `${this.tipo} de ${this.valor}, realizado el ${this.fechaHora.toLocaleString()}`;
    }
}