// ==========================================
// 1. SEGURIDAD Y SESIÓN
// ==========================================
const usuarioActual = JSON.parse(localStorage.getItem("usuarioSesion"));

if (!usuarioActual) {
    window.location.href = "login.html";
} else {
    const tituloSaludo = document.getElementById("saludo-usuario");
    if (tituloSaludo) { 
        tituloSaludo.innerText = `¡Hola, ${usuarioActual.name}! Bienvenido a Banc4`;
    }
}

const btnCerrarSesion = document.getElementById("btn-cerrar-sesion");
if (btnCerrarSesion) {
    btnCerrarSesion.addEventListener("click", () => {
        localStorage.removeItem("usuarioSesion");
        window.location.href = "login.html";
    });
}

// ==========================================
// 2. NAVEGACIÓN POR PESTAÑAS (Bloque Completo)
// ==========================================
const navCuentas = document.getElementById("nav-cuentas");
const navTarjetas = document.getElementById("nav-tarjetas");
const navTransferencias = document.getElementById("nav-transferencias");
const navPerfil = document.getElementById("nav-perfil");
const navAdmin = document.getElementById("nav-admin");
const navHistorial = document.getElementById("nav-historial");

const vistaCuentas = document.getElementById("vista-cuentas");
const vistaTarjetas = document.getElementById("vista-tarjetas");
const vistaTransferencias = document.getElementById("vista-transferencias");
const vistaPerfil = document.getElementById("vista-perfil");
const vistaAdmin = document.getElementById("vista-admin");
const vistaHistorial = document.getElementById("vista-historial");

function activarVista(vistaActiva, navActivo) {
    if (vistaCuentas) vistaCuentas.classList.add("vista-oculta");
    if (vistaTarjetas) vistaTarjetas.classList.add("vista-oculta");
    if (vistaTransferencias) vistaTransferencias.classList.add("vista-oculta");
    if (vistaPerfil) vistaPerfil.classList.add("vista-oculta");
    if (vistaAdmin) vistaAdmin.classList.add("vista-oculta");
    if (vistaHistorial) vistaHistorial.classList.add("vista-oculta");

    if (navCuentas) navCuentas.classList.remove("active");
    if (navTarjetas) navTarjetas.classList.remove("active");
    if (navTransferencias) navTransferencias.classList.remove("active");
    if (navPerfil) navPerfil.classList.remove("active");
    if (navAdmin) navAdmin.classList.remove("active");
    if (navHistorial) navHistorial.classList.remove("active");

    if (vistaActiva) vistaActiva.classList.remove("vista-oculta");
    if (navActivo) navActivo.classList.add("active");
}

if (navCuentas) {
    navCuentas.addEventListener("click", (e) => { 
        e.preventDefault(); 
        activarVista(vistaCuentas, navCuentas); 
    });
}

if (navTarjetas) {
    navTarjetas.addEventListener("click", (e) => { 
        e.preventDefault(); 
        activarVista(vistaTarjetas, navTarjetas); 
        renderizarTarjeta(); 
    });
}

if (navTransferencias) {
    navTransferencias.addEventListener("click", (e) => { 
        e.preventDefault(); 
        activarVista(vistaTransferencias, navTransferencias); 
    });
}

if (navPerfil) {
    navPerfil.addEventListener("click", (e) => { 
        e.preventDefault(); 
        activarVista(vistaPerfil, navPerfil); 
        
        const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${usuarioActual.user}`;
        document.getElementById("perfil-img").src = avatarUrl;

    
        document.getElementById("perfil-nombre-display").innerText = usuarioActual.name;
        document.getElementById("perfil-usuario-display").innerText = `@${usuarioActual.user}`;
        
        let numeroCuentaActual = (usuarioActual.accounts && usuarioActual.accounts.length > 0) 
            ? usuarioActual.accounts[0].accountNumber 
            : "Sin cuenta";
            
        document.getElementById("perfil-cuenta-display").innerText = numeroCuentaActual;
        document.getElementById("perfil-celular-display").innerText = usuarioActual.phone || "No registrado";
        document.getElementById("perfil-correo-display").innerText = usuarioActual.email || `${usuarioActual.user}@banc4.com`;

        document.getElementById("input-perfil-nombre").value = usuarioActual.name;
        document.getElementById("input-perfil-celular").value = usuarioActual.phone || "";
        document.getElementById("input-perfil-correo").value = usuarioActual.email || `${usuarioActual.user}@banc4.com`;
    });
}

if (navAdmin) {
    navAdmin.addEventListener("click", (e) => {
        e.preventDefault();
        activarVista(vistaAdmin, navAdmin);
        renderizarTablaAdmin();
    });
}

if (navHistorial) {
    navHistorial.addEventListener("click", (e) => { 
        e.preventDefault(); 
        activarVista(vistaHistorial, navHistorial); 
    });
}

// ==========================================
// 3. INICIALIZACIÓN DE CUENTA BANCARIA
// ==========================================
if (usuarioActual && usuarioActual.accounts.length === 0) {
    const numeroCuenta = "AH-" + Math.floor(Math.random() * 100000);
    const newAccount = new CuentaAhorros(numeroCuenta, 0);

    usuarioActual.accounts.push(newAccount);

    localStorage.setItem("usuarioSesion", JSON.stringify(usuarioActual));
    let clientesBanc4 = JSON.parse(localStorage.getItem("clientesBanc4"));
    const index = clientesBanc4.findIndex(c => c.user === usuarioActual.user);
    
    clientesBanc4[index] = usuarioActual; 
    localStorage.setItem("clientesBanc4", JSON.stringify(clientesBanc4));
}

let cuentaData = usuarioActual.accounts[0];
let cuentaPrincipal = new CuentaAhorros(
    cuentaData.accountNumber, 
    cuentaData.saldo, 
    cuentaData.movements, 
    cuentaData.state
);

const textoSaldo = document.getElementById("saldo-pantalla");
if (textoSaldo) {
    textoSaldo.innerText = `$${cuentaPrincipal.saldo.toFixed(2)}`;
}

// ==========================================
// 4. OPERACIONES FINANCIERAS
// ==========================================
const btnConsignar = document.getElementById("btn-consignar");
if (btnConsignar) {
    btnConsignar.addEventListener("click", () =>{
        let montoIngresado = parseFloat(prompt("¿Cuánto dinero deseas consignar?"));

        if (isNaN(montoIngresado) || montoIngresado <= 0) {
            alert("Por favor, ingresa un valor numérico válido mayor a 0.");
            return;
        }

        let resultado = cuentaPrincipal.consignar(montoIngresado);

        if (resultado.exito) {
            alert(resultado.mensaje);
            document.getElementById("saldo-pantalla").innerText = `$${cuentaPrincipal.saldo.toFixed(2)}`;

            usuarioActual.accounts[0] = cuentaPrincipal;
            localStorage.setItem("usuarioSesion", JSON.stringify(usuarioActual));

            let clientesBanc4 = JSON.parse(localStorage.getItem("clientesBanc4"));
            let index = clientesBanc4.findIndex(c => c.user === usuarioActual.user);
            clientesBanc4[index] = usuarioActual;
            localStorage.setItem("clientesBanc4", JSON.stringify(clientesBanc4));

            actualizarHistorial();
        } else {
            alert(resultado.mensaje);
        }
    });
}

const btnRetirar = document.getElementById("btn-retirar");
if (btnRetirar) {
    btnRetirar.addEventListener("click", () => {
        let montoIngresado = parseFloat(prompt("¿Cuánto dinero deseas retirar?"));

        if (isNaN(montoIngresado) || montoIngresado <= 0) {
            alert("Por favor, ingresa un valor numérico válido mayor a 0.");
            return;
        }

        let resultado = cuentaPrincipal.retirar(montoIngresado);

        if (resultado.exito) {
            alert(resultado.mensaje);
            document.getElementById("saldo-pantalla").innerText = `$${cuentaPrincipal.saldo.toFixed(2)}`;

            usuarioActual.accounts[0] = cuentaPrincipal;
            localStorage.setItem("usuarioSesion", JSON.stringify(usuarioActual));

            let clientesBanc4 = JSON.parse(localStorage.getItem("clientesBanc4"));
            let index = clientesBanc4.findIndex(c => c.user === usuarioActual.user);
            clientesBanc4[index] = usuarioActual;
            localStorage.setItem("clientesBanc4", JSON.stringify(clientesBanc4));

            actualizarHistorial();
        } else {
            alert(resultado.mensaje);
        }
    });
}

// ==========================================
// 5. RENDERIZADO DEL HISTORIAL (VISUAL)
// ==========================================
function actualizarHistorial() {
    const listaMovimientos = document.getElementById("lista-movimientos");
    if (!listaMovimientos) return;

    listaMovimientos.innerHTML = "";

    if (cuentaPrincipal.movements.length === 0) {
        listaMovimientos.innerHTML = "<li class='movimiento-vacio'>No hay movimientos recientes.</li>";
        return;
    }

    const movimientosInvertidos = cuentaPrincipal.movements.slice().reverse();

    movimientosInvertidos.forEach(mov => {
        const item = document.createElement("li");
        item.className = "item-movimiento";
        
        const claseColor = mov.tipo.includes("Consignación") || mov.tipo.includes("recibida") || mov.tipo.includes("Interés") ? "texto-ingreso" : "texto-egreso";
        const signo = claseColor === "texto-ingreso" ? "+" : "-";
        const fechaFormateada = new Date(mov.fechaHora).toLocaleString();

        item.innerHTML = `
            <div class="movimiento-info">
                <strong>${mov.tipo}</strong>
                <span class="movimiento-fecha">${fechaFormateada}</span>
            </div>
            <strong class="${claseColor}">${signo}$${parseFloat(mov.valor).toFixed(2)}</strong>
        `;
        
        listaMovimientos.appendChild(item);
    });
}

actualizarHistorial();

// ==========================================
// 6. SOLICITUD DE PRODUCTOS (TARJETA DE CRÉDITO)
// ==========================================
const btnSolicitarTc = document.getElementById("btn-solicitar-tc");

if (btnSolicitarTc) {
    if (usuarioActual.cards && usuarioActual.cards.length > 0) {
        btnSolicitarTc.innerText = "Ya la tienes";
        btnSolicitarTc.disabled = true;
        btnSolicitarTc.style.opacity = "0.5";
        btnSolicitarTc.style.cursor = "not-allowed";
    }

    btnSolicitarTc.addEventListener("click", () => {
        if (usuarioActual.cards && usuarioActual.cards.length > 0) {
            alert("Ya posees una Tarjeta de Crédito con nosotros.");
            return;
        }

        let confirmar = confirm("¿Deseas solicitar una Tarjeta de Crédito con un cupo preaprobado de $5.000.000?");
        
        if (confirmar) {
            const numAleatorio = () => Math.floor(1000 + Math.random() * 9000);
            const numeroTarjeta = `4029 ${numAleatorio()} ${numAleatorio()} ${numAleatorio()}`;
            
            const nuevaTarjeta = new TarjetaCredito(numeroTarjeta, 5000000);
            
            if (!usuarioActual.cards) usuarioActual.cards = [];
            usuarioActual.cards.push(nuevaTarjeta);

            localStorage.setItem("usuarioSesion", JSON.stringify(usuarioActual));

            let clientesBanc4 = JSON.parse(localStorage.getItem("clientesBanc4"));
            let index = clientesBanc4.findIndex(c => c.user === usuarioActual.user);
            clientesBanc4[index] = usuarioActual;
            localStorage.setItem("clientesBanc4", JSON.stringify(clientesBanc4));

            alert(`¡Felicidades! Tu tarjeta terminada en ${numeroTarjeta.slice(-4)} ha sido aprobada.`);
            btnSolicitarTc.innerText = "Ya la tienes";
            btnSolicitarTc.disabled = true;
            btnSolicitarTc.style.opacity = "0.5";
            btnSolicitarTc.style.cursor = "not-allowed";
        }
    });
}

// ==========================================
// 7. RENDERIZADO DE LA VISTA "TARJETAS"
// ==========================================
function renderizarTarjeta() {
    const mensajeSinTarjeta = document.getElementById("mensaje-sin-tarjeta");
    const datosMiTarjeta = document.getElementById("datos-mi-tarjeta");

    if (!usuarioActual.cards || usuarioActual.cards.length === 0) {
        mensajeSinTarjeta.classList.remove("vista-oculta");
        datosMiTarjeta.classList.add("vista-oculta");
        return;
    }

    mensajeSinTarjeta.classList.add("vista-oculta");
    datosMiTarjeta.classList.remove("vista-oculta");

    let tarjetaData = usuarioActual.cards[0];
    let miTarjeta = new TarjetaCredito(tarjetaData.numeroTarjeta, tarjetaData.cupoCredito);
    miTarjeta.deudaActual = tarjetaData.deudaActual;

    datosMiTarjeta.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 20px;">
            <div class="tarjeta-banc4-virtual" style="width: 100%; height: 200px;">
                <div class="tarjeta-top">
                    <div class="tarjeta-chip"></div>
                    <div class="tarjeta-logo-mini">Banc4</div>
                </div>
                <div class="tarjeta-numero">${miTarjeta.numeroTarjeta}</div>
                <div class="tarjeta-bottom">
                    <div class="tarjeta-titular">${usuarioActual.name.toUpperCase()}</div>
                    <div class="tarjeta-vencimiento">12/29</div>
                </div>
            </div>

            <div class="tarjeta-panel" style="padding: 1.5rem;">
                <h4 style="margin-bottom: 10px;">Simular Compra</h4>
                <input type="number" id="input-monto-compra" placeholder="Monto $" style="width: 100%; padding: 10px; margin-bottom: 10px; border-radius: 8px; border: 1px solid #ccc;">
                <input type="number" id="input-cuotas" placeholder="Cuotas (Ej: 12)" style="width: 100%; padding: 10px; margin-bottom: 15px; border-radius: 8px; border: 1px solid #ccc;">
                <button id="btn-comprar-tc" class="btn-principal" style="width: 100%;">Pagar con Tarjeta</button>
            </div>
        </div>

        <div class="info-cupos">
            <h3>Cupo Total Aprobado</h3>
            <h2 style="font-size: 1.8rem;">$${miTarjeta.cupoCredito.toLocaleString()}</h2>
            
            <h3>Deuda Actual</h3>
            <h2 style="color: #e11d48;">$${miTarjeta.deudaActual.toFixed(2)}</h2>
            
            <h3>Cupo Disponible para Compras</h3>
            <h2 style="color: var(--teal-500);">$${miTarjeta.consultarCupoDisponible().toFixed(2)}</h2>
        </div>
    `;

    document.getElementById("btn-comprar-tc").addEventListener("click", () => {
        let monto = parseFloat(document.getElementById("input-monto-compra").value);
        let cuotas = parseInt(document.getElementById("input-cuotas").value);

        if (isNaN(monto) || monto <= 0 || isNaN(cuotas) || cuotas <= 0) {
            alert("Ingresa un monto y número de cuotas válidos.");
            return;
        }

        let resultado = miTarjeta.comprar(monto, cuotas);

        if (resultado !== false) {
            alert(`Compra exitosa.\nPagarás ${cuotas} cuotas de $${resultado.toFixed(2)}`);
            
            usuarioActual.cards[0] = miTarjeta;
            localStorage.setItem("usuarioSesion", JSON.stringify(usuarioActual));
            
            let clientesBanc4 = JSON.parse(localStorage.getItem("clientesBanc4"));
            let index = clientesBanc4.findIndex(c => c.user === usuarioActual.user);
            clientesBanc4[index] = usuarioActual;
            localStorage.setItem("clientesBanc4", JSON.stringify(clientesBanc4));

            renderizarTarjeta();
        } else {
            alert("Cupo insuficiente para esta compra.");
        }
    });
}

// ==========================================
// 8. MÓDULO DE TRANSFERENCIAS
// ==========================================
const btnTransferir = document.getElementById("btn-ejecutar-transferencia");

if (btnTransferir) {
    btnTransferir.addEventListener("click", () => {
        const cuentaDestino = document.getElementById("input-cuenta-destino").value.trim();
        const monto = parseFloat(document.getElementById("input-monto-transferencia").value);

        if (cuentaDestino === "") {
            alert("Por favor ingresa un número de cuenta destino.");
            return;
        }
        if (isNaN(monto) || monto <= 0) {
            alert("El monto a transferir debe ser mayor a 0.");
            return;
        }
        
        if (cuentaDestino === cuentaPrincipal.accountNumber) {
            alert("Error: No se permiten transferencias al mismo producto de origen.");
            return;
        }
        if (monto > cuentaPrincipal.saldo) {
            alert("Fondos insuficientes para realizar esta transferencia.");
            return;
        }

        let clientesBanc4 = JSON.parse(localStorage.getItem("clientesBanc4")) || [];
        let indexClienteDestino = -1;
        let indexCuentaDestino = -1;

        for (let i = 0; i < clientesBanc4.length; i++) {
            let cuentasCliente = clientesBanc4[i].accounts;
            for (let j = 0; j < cuentasCliente.length; j++) {
                if (cuentasCliente[j].accountNumber === cuentaDestino) {
                    indexClienteDestino = i;
                    indexCuentaDestino = j;
                    break;
                }
            }
            if (indexClienteDestino !== -1) break;
        }

        if (indexClienteDestino === -1) {
            alert("La cuenta destino no existe en el sistema Banc4.");
            return;
        }

        cuentaPrincipal.saldo -= monto;
        cuentaPrincipal.registrarMovimiento("Transferencia enviada", monto);

        let clienteReceptor = clientesBanc4[indexClienteDestino];
        let cuentaReceptora = clienteReceptor.accounts[indexCuentaDestino];
        
        cuentaReceptora.saldo += monto;
        cuentaReceptora.movements.push({
            fechaHora: new Date().toISOString(),
            tipo: "Transferencia recibida",
            valor: monto
        });

        usuarioActual.accounts[0] = cuentaPrincipal;
        localStorage.setItem("usuarioSesion", JSON.stringify(usuarioActual));

        let miIndex = clientesBanc4.findIndex(c => c.user === usuarioActual.user);
        clientesBanc4[miIndex] = usuarioActual;
        clientesBanc4[indexClienteDestino] = clienteReceptor;
        
        localStorage.setItem("clientesBanc4", JSON.stringify(clientesBanc4));

        alert(`Transferencia de $${monto} a la cuenta ${cuentaDestino} realizada con éxito.`);
        document.getElementById("saldo-pantalla").innerText = `$${cuentaPrincipal.saldo.toFixed(2)}`;
        document.getElementById("input-cuenta-destino").value = "";
        document.getElementById("input-monto-transferencia").value = "";
        actualizarHistorial();
    });
}

// ==========================================
// 9. MÓDULO DE PERFIL Y SEGURIDAD
// ==========================================
const btnActualizarPerfil = document.getElementById("btn-actualizar-perfil");
if (btnActualizarPerfil) {
    btnActualizarPerfil.addEventListener("click", () => {
        const nuevoNombre = document.getElementById("input-perfil-nombre").value.trim();
        const nuevoCelular = document.getElementById("input-perfil-celular").value.trim();
        const nuevoCorreo = document.getElementById("input-perfil-correo").value.trim();

        if (nuevoNombre === "") {
            alert("El nombre no puede estar vacío.");
            return;
        }

        usuarioActual.name = nuevoNombre;
        usuarioActual.phone = nuevoCelular;
        usuarioActual.email = nuevoCorreo;

        localStorage.setItem("usuarioSesion", JSON.stringify(usuarioActual));
        let clientes = JSON.parse(localStorage.getItem("clientesBanc4"));
        let idx = clientes.findIndex(c => c.user === usuarioActual.user);
        clientes[idx] = usuarioActual;
        localStorage.setItem("clientesBanc4", JSON.stringify(clientes));

        document.getElementById("perfil-nombre-display").innerText = nuevoNombre;
        document.getElementById("perfil-celular-display").innerText = nuevoCelular || "No registrado";
        document.getElementById("perfil-correo-display").innerText = nuevoCorreo || `${usuarioActual.user}@banc4.com`;

        const tituloSaludo = document.getElementById("saludo-usuario");
        if (tituloSaludo) tituloSaludo.innerText = `¡Hola, ${nuevoNombre}! Bienvenido a Banc4`;
        
        alert("¡Perfil actualizado correctamente!");
    });
}

const btnCambiarPass = document.getElementById("btn-cambiar-pass");
if (btnCambiarPass) {
    btnCambiarPass.addEventListener("click", () => {
        const passActual = document.getElementById("input-pass-actual").value;
        const passNueva = document.getElementById("input-pass-nueva").value;
        const passConfirm = document.getElementById("input-pass-confirmar").value;

        if (passActual !== usuarioActual.password) {
            alert("Error: La contraseña actual es incorrecta.");
            return;
        }
        if (passNueva.length < 4) {
            alert("Error: La nueva contraseña debe tener al menos 4 caracteres.");
            return;
        }
        if (passNueva !== passConfirm) {
            alert("Error: Las nuevas contraseñas no coinciden.");
            return;
        }

        usuarioActual.password = passNueva;
        
        localStorage.setItem("usuarioSesion", JSON.stringify(usuarioActual));
        let clientes = JSON.parse(localStorage.getItem("clientesBanc4"));
        let idx = clientes.findIndex(c => c.user === usuarioActual.user);
        clientes[idx] = usuarioActual;
        localStorage.setItem("clientesBanc4", JSON.stringify(clientes));

        alert("Contraseña actualizada con éxito. Por seguridad, debes iniciar sesión nuevamente.");
        localStorage.removeItem("usuarioSesion");
        window.location.href = "login.html";
    });
}

// ==========================================
// 10. MÓDULO DE ADMINISTRACIÓN (CRUD)
// ==========================================
function renderizarTablaAdmin() {
    const tbody = document.getElementById("tabla-clientes-body");
    if (!tbody) return;

    tbody.innerHTML = "";
    let clientes = JSON.parse(localStorage.getItem("clientesBanc4")) || [];

    if (clientes.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--texto-claro);">No hay clientes registrados.</td></tr>`;
        return;
    }

    clientes.forEach((cli, index) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${cli.id || 'N/A'}</td>
            <td>${cli.name}</td>
            <td>@${cli.user}</td>
            <td>${cli.phone || 'No registrado'}</td>
            <td>
                <button class="btn-accion-tabla btn-editar" onclick="editarCliente(${index})">Editar</button>
                <button class="btn-accion-tabla btn-eliminar" onclick="eliminarCliente(${index})">Eliminar</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

const btnAdminCrear = document.getElementById("btn-admin-crear");
if (btnAdminCrear) {
    btnAdminCrear.addEventListener("click", () => {
        const id = document.getElementById("admin-reg-id").value.trim();
        const name = document.getElementById("admin-reg-nombre").value.trim();
        const phone = document.getElementById("admin-reg-celular").value.trim();
        const user = document.getElementById("admin-reg-user").value.trim();
        const pass = document.getElementById("admin-reg-pass").value;

        if (!id || !name || !user || !pass) {
            alert("Por favor completa los campos obligatorios.");
            return;
        }

        let clientes = JSON.parse(localStorage.getItem("clientesBanc4")) || [];
        
        if (clientes.some(c => c.user === user)) {
            alert("El nombre de usuario ya existe en el sistema.");
            return;
        }

        const nuevaCuenta = new CuentaAhorros("AH-" + Math.floor(Math.random() * 100000), 0);
        const nuevoCliente = new Cliente(id, name, phone, user, pass, [nuevaCuenta], []);

        clientes.push(nuevoCliente);
        localStorage.setItem("clientesBanc4", JSON.stringify(clientes));

        document.getElementById("admin-reg-id").value = "";
        document.getElementById("admin-reg-nombre").value = "";
        document.getElementById("admin-reg-celular").value = "";
        document.getElementById("admin-reg-user").value = "";
        document.getElementById("admin-reg-pass").value = "";

        alert("Cliente registrado exitosamente.");
        renderizarTablaAdmin();
    });
}

window.editarCliente = function(index) {
    let clientes = JSON.parse(localStorage.getItem("clientesBanc4")) || [];
    let cliente = clientes[index];

    let nuevoNombre = prompt("Editar Nombre Completo:", cliente.name);
    if (nuevoNombre === null) return;

    let nuevoCelular = prompt("Editar Celular:", cliente.phone || "");
    if (nuevoCelular === null) return;

    cliente.name = nuevoNombre.trim() || cliente.name;
    cliente.phone = nuevoCelular.trim();

    clientes[index] = cliente;
    localStorage.setItem("clientesBanc4", JSON.stringify(clientes));

    if (usuarioActual.user === cliente.user) {
        localStorage.setItem("usuarioSesion", JSON.stringify(cliente));
    }

    alert("Cliente actualizado correctamente.");
    renderizarTablaAdmin();
};

window.eliminarCliente = function(index) {
    let clientes = JSON.parse(localStorage.getItem("clientesBanc4")) || [];
    let cliente = clientes[index];

    if (cliente.user === usuarioActual.user) {
        let confirmarPropio = confirm("Estás a punto de eliminar tu propia cuenta activa. ¿Deseas continuar?");
        if (!confirmarPropio) return;
        
        clientes.splice(index, 1);
        localStorage.setItem("clientesBanc4", JSON.stringify(clientes));
        localStorage.removeItem("usuarioSesion");
        alert("Cuenta eliminada. Redirigiendo al login.");
        window.location.href = "login.html";
        return;
    }

    let confirmar = confirm(`¿Estás seguro de eliminar al cliente ${cliente.name}?`);
    if (confirmar) {
        clientes.splice(index, 1);
        localStorage.setItem("clientesBanc4", JSON.stringify(clientes));
        alert("Cliente eliminado del sistema.");
        renderizarTablaAdmin();
    }
};