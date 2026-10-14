
class TarjetaCredito {
    constructor(numeroTarjeta, cupoCredito, deudaActual = 0) {
        this.numeroTarjeta = numeroTarjeta;
        this.cupoCredito = cupoCredito;
        this.deudaActual = deudaActual;
    }

    consultarCupoDisponible() {
        return this.cupoCredito - this.deudaActual;
    }

    comprar(monto, cuotas) {
        if (monto > this.consultarCupoDisponible()) {
            return false; // Cupo insuficiente
        }

        let tasaMensual = 0;
        
        // REGLA ESTRICTA: Asignación de tasa por cuotas
        if (cuotas <= 2) {
            tasaMensual = 0.0;
        } else if (cuotas >= 3 && cuotas <= 6) {
            tasaMensual = 0.019; // 1.9%
        } else if (cuotas >= 7) {
            tasaMensual = 0.023; // 2.3%
        }

        let valorCuotaMensual = 0;

        if (tasaMensual === 0) {
            // A 1 o 2 cuotas, sin intereses
            valorCuotaMensual = monto / cuotas;
        } else {
            // REGLA ESTRICTA: Fórmula (Capital x tasa) / (1 - (1 + tasa)^(-n))
            let numerador = monto * tasaMensual;
            let denominador = 1 - Math.pow(1 + tasaMensual, -cuotas);
            valorCuotaMensual = numerador / denominador;
        }

        this.deudaActual += monto;
        
        // Retornamos el valor de la cuota para mostrarlo en el alert del dashboard
        return valorCuotaMensual;
    }
}