class Cliente {
    // CONSTRUCTOR
    constructor(identification, name, phone, user, password) {
        this.identification = identification;
        this.name = name;
        this.phone = phone;
        this.user = user;
        this.password = password;
        this.failedAttempts = 0; // Nombre unificado
        this.blocked = false;
        this.accounts = [];
        this.cards = [];
    }

    // MÉTODO DE VALIDAR CONTRASEÑA
    verificarPassword(passwordIngresada) {
        if (this.blocked) {
            return {
                exito: false,
                mensaje: "Tu cuenta está bloqueada temporalmente tras varios intentos fallidos."
            };
        }

        if (this.password === passwordIngresada) {
            this.reiniciarIntentos();
            return {
                exito: true,
                mensaje: "¡Bienvenido a Banc4!"
            };
        } else {
            this.incrementarIntentos();
            
            // Si tras incrementar ya se bloqueó
            if (this.blocked) {
                return {
                    exito: false,
                    mensaje: "Has superado el límite de intentos. Tu cuenta ha sido bloqueada."
                };
            }

            const remainingAttempts = 3 - this.failedAttempts;
            return {
                exito: false,
                mensaje: `Contraseña incorrecta. Te quedan ${remainingAttempts} intentos.`
            };
        }
    }

    // MÉTODO PARA INCREMENTAR LOS INTENTOS
    incrementarIntentos() {
        this.failedAttempts++;
        if (this.failedAttempts >= 3) {
            this.blocked = true;
        }
    }

    // MÉTODO PARA REINICIAR LOS INTENTOS
    reiniciarIntentos() {
        this.failedAttempts = 0; // Apunta a la misma propiedad en inglés
    }
}