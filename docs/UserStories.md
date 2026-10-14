# Documento de Historias de Usuario - Sistema Bancario "Mi Plata" (Banc4)

Este documento detalla todas las historias de usuario orientadas al desarrollo frontend, estructuradas de acuerdo con la arquitectura, los módulos funcionales y las reglas de negocio evaluadas en el proyecto del CESDE.

---

## Módulo 1: Autenticación y Registro

### HU-01: Registro de Nuevos Clientes
* **Como** usuario nuevo,
* **Quiero** registrarme en la plataforma ingresando mi identificación, nombre, celular, usuario único y contraseña con confirmación,
* **Para poder** acceder a los servicios financieros digitales del banco.
* **Criterios de aceptación:**
  1. El formulario debe validar que todos los campos obligatorios estén llenos.
  2. Las contraseñas deben coincidir antes de permitir el registro.
  3. El nombre de usuario debe ser único en el sistema (`localStorage`).
  4. Tras el registro exitoso, se crea automáticamente una cuenta de ahorros inicial para el usuario.

### HU-02: Inicio de Sesión y Seguridad de Intentos
* **Como** cliente registrado,
* **Quiero** iniciar sesión con mi usuario y contraseña,
* **Para** acceder de manera segura a mi panel de transacciones personalizado.
* **Criterios de aceptación:**
  1. El sistema valida las credenciales contra la base de datos local.
  2. Se cuenta con un sistema de control de intentos fallidos (máximo 3).
  3. Al tercer intento fallido, la cuenta se bloquea temporalmente informando al usuario mediante una alerta visual.

### HU-03: Administración de Usuarios (CRUD)
* **Como** administrador del sistema,
* **Quiero** visualizar una lista de todos los clientes registrados, así como agregar nuevos, editar sus datos o eliminarlos,
* **Para** mantener una gestión centralizada y segura de los usuarios de la plataforma.
* **Criterios de aceptación:**
  1. Interfaz en forma de tabla responsiva con datos de identificación, nombre, usuario y celular.
  2. Opción de registrar clientes directamente desde el panel de administración.
  3. Funciones de edición interactiva (`prompt`) y eliminación con confirmación de seguridad.

---

## Módulo 2: Interfaz Principal y Landing Page

### HU-04: Presentación Institucional y One-Page Navigation
* **Como** visitante de la página principal,
* **Quiero** interactuar con una Landing Page moderna que incluya secciones de inicio, historia y contacto, además de una tarjeta de crédito virtual animada en CSS con Glassmorfismo,
* **Para** conocer la propuesta de valor del banco con una experiencia visual atractiva y fluida.
* **Criterios de aceptación:**
  1. Diseño responsivo adaptado a dispositivos móviles, tablets y escritorios.
  2. Navegación fluida por desplazamiento suave (*smooth scroll*).
  3. Coherencia visual con la paleta monocromática azul corporativa.

---

## Módulo 3: Panel de Transacciones y Productos (Dashboard)

### HU-05: Consulta y Gestión de Cuenta de Ahorros
* **Como** cliente autenticado,
* **Quiero** consultar mi saldo actual y realizar operaciones de consignación y retiro,
* **Para** gestionar mis fondos de manera segura con cálculo automático de intereses.
* **Criterios de aceptación:**
  1. El saldo se actualiza visualmente de forma inmediata tras cada transacción.
  2. Las consignaciones exigen montos positivos mayores a cero.
  3. Los retiros en cuentas de ahorros aplican automáticamente y de forma explícita el rendimiento del 1.5% mensual al momento del retiro.

### HU-06: Gestión de Cuenta Corriente y Sobregiro Dinámico
* **Como** cliente con cuenta corriente,
* **Quiero** realizar retiros que puedan exceder mi saldo actual utilizando un sobregiro,
* **Para** contar con flexibilidad en la gestión diaria de mi dinero.
* **Criterios de aceptación:**
  1. El sistema calcula y permite un sobregiro de hasta el 20% adicional sobre el saldo actual.
  2. Las operaciones que superen este límite son bloqueadas con mensajes de retroalimentación claros.

### HU-07: Historial de Movimientos Detallado
* **Como** usuario del sistema,
* **Quiero** visualizar un registro cronológico de todas mis transacciones (consignaciones, retiros, transferencias),
* **Para** llevar un control transparente de mis finanzas.
* **Criterios de aceptación:**
  1. Los movimientos se almacenan en un arreglo estructurado con fecha y hora, tipo y valor.
  2. El historial se presenta de forma descendente (los movimientos más recientes primero).

---

## Módulo 4: Tarjeta de Crédito y Simulación Financiera

### HU-08: Solicitud de Tarjeta de Crédito
* **Como** cliente activo,
* **Quiero** solicitar una tarjeta de crédito con un cupo preaprobado desde los productos recomendados,
* **Para** financiar mis compras a cuotas.
* **Criterios de aceptación:**
  1. El sistema valida si el usuario ya posee una tarjeta para evitar duplicados.
  2. Al aprobarse, genera un número aleatorio de tarjeta de 16 dígitos y actualiza el estado del botón a "Ya la tienes".

### HU-09: Simulación de Compras con Tasas de Interés y Cuotas
* **Como** titular de una tarjeta de crédito,
* **Quiero** simular compras ingresando el monto y el número de cuotas,
* **Para** conocer el valor exacto de la cuota mensual calculada bajo la fórmula de amortización financiera.
* **Criterios de aceptación:**
  1. Asignación automática de tasas: 0% para $\le2$ cuotas, 1.9% para 3-6 cuotas, y 2.3% para $\ge7$ cuotas.
  2. Validación estricta del cupo disponible de la tarjeta antes de autorizar la compra.

---

## Módulo 5: Transferencias y Perfil de Usuario

### HU-10: Transferencias Bancarias Cruzadas
* **Como** cliente del banco,
* **Quiero** transferir dinero desde mi cuenta hacia las cuentas de otros usuarios registrados o propios,
* **Para** enviar fondos de manera instantánea.
* **Criterios de aceptación:**
  1. El sistema busca de manera segura la cuenta destino en toda la base de datos local.
  2. Se restringen estrictamente las transferencias dirigidas al mismo número de cuenta de origen.
  3. Se actualizan simultáneamente los saldos y los historiales de ambos usuarios involucrados.

### HU-11: Gestión de Perfil, Avatar y Seguridad
* **Como** usuario autenticado,
* **Quiero** visualizar mi número de cuenta, correo, celular y avatar digital, además de poder editar mis datos y cambiar mi contraseña,
* **Para** mantener actualizada mi información personal y proteger mi cuenta.
* **Criterios de aceptación:**
  1. Generación automática de un avatar visual único basado en el nombre de usuario.
  2. Visualización clara del número de cuenta asignado (ej. `AH-XXXXX`).
  3. Formulario seguro para cambio de contraseña que exige la verificación estricta de la clave actual y la confirmación de la nueva.