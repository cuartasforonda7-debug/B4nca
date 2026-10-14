const formularioLogin = document.getElementById('form-login');

let clientesBanc4 = JSON.parse(localStorage.getItem("clientesBanc4")) || [];

formularioLogin.addEventListener("submit", (e) => {
    e.preventDefault();

    const usuario = document.getElementById('login-usuario').value.toLowerCase();
    const password = document.getElementById('login-password').value;

    if (clientesBanc4.length === 0) {
        alert("No hay usuarios registrados en el sistema. Registrate primero"); // Cambiado console.log a alert por experiencia de usuario
        return;
    }

    let clienteData = clientesBanc4.find(c => c.user.toLowerCase() === usuario);

    if (!clienteData) {
        alert("Usuario o contraseña incorrectos."); 
        return;
    }

    let clienteRevivido = new Cliente(
        clienteData.identification, 
        clienteData.name, 
        clienteData.phone, 
        clienteData.user, 
        clienteData.password
    );

    clienteRevivido.failedAttempts = clienteData.failedAttempts;
    clienteRevivido.blocked = clienteData.blocked;

    const resultadoLogin = clienteRevivido.verificarPassword(password);

    if (resultadoLogin.exito === true) {
        alert(resultadoLogin.mensaje);
        localStorage.setItem("usuarioSesion", JSON.stringify(clienteRevivido));

        window.location.href = "dashboard.html";
    } else {
        alert(resultadoLogin.mensaje);

        const index = clientesBanc4.findIndex(c => c.user === clienteRevivido.user);
        clientesBanc4[index] = clienteRevivido;
        localStorage.setItem("clientesBanc4", JSON.stringify(clientesBanc4));
    }
});