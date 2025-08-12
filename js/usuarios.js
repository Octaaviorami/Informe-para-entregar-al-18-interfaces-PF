// Funcionalidad para la gestión de usuarios

document.addEventListener('DOMContentLoaded', function() {
    const userForm = document.querySelector('.user-form');
    
    // Usuarios de ejemplo (en un proyecto real esto vendría de una base de datos)
    let usuarios = [
        {
            id: 1,
            nombre: 'Admin',
            apellido: 'Demo',
            email: 'admin@demo.com',
            rol: 'admin',
            fechaRegistro: '01-01-2024'
        },
        {
            id: 2,
            nombre: 'Empleado',
            apellido: 'Demo',
            email: 'empleado@demo.com',
            rol: 'empleado',
            fechaRegistro: '01-01-2024'
        },
        {
            id: 3,
            nombre: 'Juan',
            apellido: 'Pérez',
            email: 'juan.perez@empresa.com',
            rol: 'empleado',
            fechaRegistro: '15-06-2024'
        }
    ];

    // Función para validar el formulario de usuario
    function validarFormularioUsuario(formData) {
        const { nombre, apellido, email, password, confirmPassword, rol } = formData;
        
        if (!nombre || !apellido || !email || !password || !confirmPassword || !rol) {
            return { valido: false, mensaje: 'Por favor, completa todos los campos obligatorios.' };
        }
        
        if (password !== confirmPassword) {
            return { valido: false, mensaje: 'Las contraseñas no coinciden.' };
        }
        
        if (password.length < 6) {
            return { valido: false, mensaje: 'La contraseña debe tener al menos 6 caracteres.' };
        }
        
        // Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return { valido: false, mensaje: 'Por favor, ingresa un email válido.' };
        }
        
        // Verificar si el email ya existe
        const emailExiste = usuarios.some(usuario => usuario.email === email);
        if (emailExiste) {
            return { valido: false, mensaje: 'El email ya está registrado en el sistema.' };
        }
        
        return { valido: true, mensaje: 'Usuario registrado exitosamente.' };
    }

    // Función para registrar un nuevo usuario
    function registrarUsuario(formData) {
        const nuevoUsuario = {
            id: usuarios.length + 1,
            nombre: formData.nombre,
            apellido: formData.apellido,
            email: formData.email,
            password: formData.password, // En un proyecto real, esto se encriptaría
            rol: formData.rol,
            fechaRegistro: new Date().toLocaleDateString('es-ES')
        };
        
        usuarios.push(nuevoUsuario);
        actualizarTablaUsuarios();
        
        // Guardar en localStorage (en un proyecto real, esto iría a una base de datos)
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
    }

    // Función para actualizar la tabla de usuarios
    function actualizarTablaUsuarios() {
        const tabla = document.querySelector('#usuarios-section .data-table tbody');
        if (!tabla) return;
        
        tabla.innerHTML = '';
        
        usuarios.forEach(usuario => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${usuario.nombre}</td>
                <td>${usuario.apellido}</td>
                <td>${usuario.email}</td>
                <td><span class="status-badge ${usuario.rol}">${usuario.rol === 'admin' ? 'Administrador' : 'Empleado'}</span></td>
                <td>${usuario.fechaRegistro}</td>
                <td>
                    <button class="btn-icon" onclick="editarUsuario(${usuario.id})"><i class="fas fa-edit"></i></button>
                    <button class="btn-icon" onclick="eliminarUsuario(${usuario.id})"><i class="fas fa-trash"></i></button>
                </td>
            `;
            tabla.appendChild(fila);
        });
    }

    // Función para limpiar el formulario
    function limpiarFormulario() {
        if (userForm) {
            userForm.reset();
        }
    }

    // Event listener para el formulario de registro de usuarios
    if (userForm) {
        userForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = {
                nombre: this.querySelector('input[placeholder="Ingrese el nombre"]').value.trim(),
                apellido: this.querySelector('input[placeholder="Ingrese el apellido"]').value.trim(),
                email: this.querySelector('input[type="email"]').value.trim(),
                password: this.querySelector('input[placeholder="Ingrese la contraseña"]').value,
                confirmPassword: this.querySelector('input[placeholder="Confirme la contraseña"]').value,
                rol: this.querySelector('select').value
            };
            
            const validacion = validarFormularioUsuario(formData);
            
            if (validacion.valido) {
                registrarUsuario(formData);
                alert(validacion.mensaje);
                limpiarFormulario();
            } else {
                alert(validacion.mensaje);
            }
        });
    }

    // Función para editar usuario (global para poder ser llamada desde el HTML)
    window.editarUsuario = function(id) {
        const usuario = usuarios.find(u => u.id === id);
        if (usuario) {
            alert(`Función de edición para usuario: ${usuario.nombre} ${usuario.apellido}\n\nEn un proyecto real, aquí se abriría un modal de edición.`);
        }
    };

    // Función para eliminar usuario (global para poder ser llamada desde el HTML)
    window.eliminarUsuario = function(id) {
        const usuario = usuarios.find(u => u.id === id);
        if (usuario) {
            const confirmacion = confirm(`¿Estás seguro de que deseas eliminar al usuario ${usuario.nombre} ${usuario.apellido}?`);
            if (confirmacion) {
                usuarios = usuarios.filter(u => u.id !== id);
                actualizarTablaUsuarios();
                localStorage.setItem('usuarios', JSON.stringify(usuarios));
                alert('Usuario eliminado exitosamente.');
            }
        }
    };

    // Cargar usuarios desde localStorage al inicializar
    const usuariosGuardados = localStorage.getItem('usuarios');
    if (usuariosGuardados) {
        usuarios = JSON.parse(usuariosGuardados);
    }
    
    // Actualizar tabla al cargar la página
    actualizarTablaUsuarios();
});
