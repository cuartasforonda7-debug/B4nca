
class Cuenta {
    constructor(numeroCuenta, saldo = 0, movements = [], state = 'Activa') {
        this.accountNumber = numeroCuenta;
        this.saldo = saldo;
        this.movements = movements;
        this.state = state;
    }

    consignar(monto) {
        if (monto <= 0) return { exito: false, mensaje: "El monto debe ser mayor a 0." };
        this.saldo += monto;
        this.registrarMovimiento("Consignación", monto);
        return { exito: true, mensaje: `Consignación exitosa. Nuevo saldo: $${this.saldo.toFixed(2)}` };
    }

    registrarMovimiento(tipo, valor) {
        const movimiento = {
            fechaHora: new Date().toISOString(),
            tipo: tipo,
            valor: valor
        };
        this.movements.push(movimiento);
    }
}

class CuentaAhorros extends Cuenta {
    constructor(numeroCuenta, saldo, movements, state) {
        super(numeroCuenta, saldo, movements, state);
    }

    // POLIMORFISMO: Comportamiento único para Ahorros
    retirar(monto) {
        if (monto <= 0) return { exito: false, mensaje: "El monto a retirar debe ser mayor a 0." };
        if (monto > this.saldo) {
            return { exito: false, mensaje: "Fondos insuficientes en Cuenta de Ahorros." };
        }

        // REGLA ESTRICTA: 1.5% calculado y aplicado en el momento del retiro
        let interes = this.saldo * 0.015;
        this.saldo += interes; // El banco te premia sumando el interés
        this.registrarMovimiento("Interés Generado", interes.toFixed(2));

        this.saldo -= monto;
        this.registrarMovimiento("Retiro", monto);

        return { 
            exito: true, 
            mensaje: `Retiro exitoso.\nSe aplicó un rendimiento a tu favor de $${interes.toFixed(2)}\nNuevo saldo: $${this.saldo.toFixed(2)}` 
        };
    }
}

class CuentaCorriente extends Cuenta {
    constructor(numeroCuenta, saldo, movements, state) {
        super(numeroCuenta, saldo, movements, state);
    }

    // POLIMORFISMO: Comportamiento único para Corriente
    retirar(monto) {
        if (monto <= 0) return { exito: false, mensaje: "El monto a retirar debe ser mayor a 0." };

        // REGLA ESTRICTA: Sobregiro del 20% sobre el saldo actual
        let sobregiroPermitido = this.saldo * 0.20;
        let limiteTotal = this.saldo + sobregiroPermitido;

        if (monto > limiteTotal) {
            return { 
                exito: false, 
                mensaje: `Fondos insuficientes. Tu saldo es $${this.saldo} y tu límite con sobregiro (20%) es $${limiteTotal.toFixed(2)}.` 
            };
        }

        this.saldo -= monto;
        this.registrarMovimiento("Retiro", monto);
        
        return { 
            exito: true, 
            mensaje: `Retiro exitoso. Saldo actual: $${this.saldo.toFixed(2)}` 
        };
    }
}