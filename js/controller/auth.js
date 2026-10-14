const formularioRegistro = document.getElementById("form-registro");

let clientesBanc4 = JSON.parse(localStorage.getItem("clientesBanc4")) || [];

formularioRegistro.addEventListener("submit", (e) => {
    e.preventDefault();

    const identificacion = document.getElementById('reg-identificacion').value;
    const nombre = document.getElementById('reg-nombre').value;
    const celular = document.getElementById('reg-celular').value;
    const usuario = document.getElementById('reg-usuario').value;
    const password = document.getElementById('reg-password').value;
    const confirmarPassword = document.getElementById('reg-confirmar').value;

    if (password !== confirmarPassword) {
        alert("Las contraseñas no coinciden");
        return;
    }

    const nuevoCliente = new Cliente(identificacion, nombre, celular, usuario, password);
    
    // Agregamos a la lista correcta
    clientesBanc4.push(nuevoCliente);

    // CORREGIDO: Guardamos toda la lista (clientesBanc4) en lugar del cliente suelto (nuevoCliente)
    localStorage.setItem("clientesBanc4", JSON.stringify(clientesBanc4));
    
    alert("¡Registro exitoso! Por favor inicia sesión.");
    window.location.href = "login.html";
});