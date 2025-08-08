// Lógica de login y registro para el sistema de gestión de inventario
// Validación de credenciales, registro de usuarios y redirección según rol

document.addEventListener('DOMContentLoaded', function() {
    // Elementos del formulario de login
    const loginForm = document.getElementById('login-form');
    const emailInput = document.getElementById('login-email');
    const passwordInput = document.getElementById('login-password');
    const roleSelect = document.getElementById('login-rol');

    // Elementos del formulario de registro
    const registerForm = document.getElementById('register-form');
    const nombreInput = document.getElementById('register-nombre');
    const apellidoInput = document.getElementById('register-apellido');
    const registerEmailInput = document.getElementById('register-email');
    const registerPasswordInput = document.getElementById('register-password');
    const registerRoleSelect = document.getElementById('register-rol');

    // Contenedores
    const loginContainer = document.getElementById('login-container');
    const registerContainer = document.getElementById('register-container');

    // Enlaces para cambiar entre login y registro
    const showRegisterLink = document.getElementById('show-register');
    const showLoginLink = document.getElementById('show-login');

    // Almacenamiento local para usuarios registrados
    let registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];

    // Credenciales de demostración (usuarios por defecto)
    const defaultCredentials = {
        admin: {
            email: 'admin@demo.com',
            password: 'admin123',
            role: 'admin',
            redirect: 'admin.html'
        },
        empleado: {
            email: 'empleado@demo.com',
            password: 'empleado123',
            role: 'empleado',
            redirect: 'empleado.html'
        }
    };

    // Función para mostrar mensaje de error
    function showError(message) {
        alert(message);
    }

    // Función para mostrar mensaje de éxito
    function showSuccess(message) {
        alert(message);
    }

    // Función para cambiar entre login y registro
    function showRegister() {
        loginContainer.style.display = 'none';
        registerContainer.style.display = 'block';
    }

    function showLogin() {
        registerContainer.style.display = 'none';
        loginContainer.style.display = 'block';
    }

    // Event listeners para cambiar entre formularios
    showRegisterLink.addEventListener('click', function(e) {
        e.preventDefault();
        showRegister();
    });

    showLoginLink.addEventListener('click', function(e) {
        e.preventDefault();
        showLogin();
    });

    // Función para validar credenciales (incluye usuarios registrados)
    function validateCredentials(email, password, role) {
        if (!email || !password || !role) {
            return { valid: false, message: 'Por favor, completa todos los campos y selecciona un rol.' };
        }

        // Primero verificar usuarios por defecto
        const defaultUser = defaultCredentials[role];
        if (defaultUser && email === defaultUser.email && password === defaultUser.password) {
            return { 
                valid: true, 
                message: `Bienvenido ${email}!`,
                redirect: defaultUser.redirect
            };
        }

        // Luego verificar usuarios registrados
        const registeredUser = registeredUsers.find(user => 
            user.email === email && 
            user.password === password && 
            user.role === role
        );

        if (registeredUser) {
            return { 
                valid: true, 
                message: `Bienvenido ${email}!`,
                redirect: role === 'admin' ? 'admin.html' : 'empleado.html'
            };
        }

        return { 
            valid: false, 
            message: `Credenciales incorrectas para ${role === 'admin' ? 'administrador' : 'empleado'}.` 
        };
    }

    // Función para validar registro
    function validateRegistration(nombre, apellido, email, password, confirmPassword, role) {
        if (!nombre || !apellido || !email || !password || !confirmPassword || !role) {
            return { valid: false, message: 'Por favor, completa todos los campos.' };
        }

        if (password !== confirmPassword) {
            return { valid: false, message: 'Las contraseñas no coinciden.' };
        }

        if (password.length < 6) {
            return { valid: false, message: 'La contraseña debe tener al menos 6 caracteres.' };
        }

        // Verificar si el email ya existe
        const emailExists = registeredUsers.some(user => user.email === email);
        if (emailExists) {
            return { valid: false, message: 'El email ya está registrado.' };
        }

        return { valid: true, message: 'Usuario registrado exitosamente.' };
    }

    // Función para registrar usuario
    function registerUser(nombre, apellido, email, password, role) {
        const newUser = {
            nombre: nombre,
            apellido: apellido,
            email: email,
            password: password,
            role: role,
            fechaRegistro: new Date().toISOString()
        };

        registeredUsers.push(newUser);
        localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
    }

    // Event listener para el formulario de login
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        const role = roleSelect.value;

        // Validar credenciales
        const result = validateCredentials(email, password, role);
        
        if (result.valid) {
            // Mostrar mensaje de éxito
            showSuccess(result.message);
            
            // Simular carga
            const submitBtn = loginForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Iniciando sesión...';
            submitBtn.disabled = true;
            
            // Redirigir después de un breve delay
            setTimeout(() => {
                window.location.href = result.redirect;
            }, 1000);
        } else {
            showError(result.message);
        }
    });

    // Event listener para el formulario de registro
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const nombre = nombreInput.value.trim();
        const apellido = apellidoInput.value.trim();
        const email = registerEmailInput.value.trim();
        const password = registerPasswordInput.value.trim();
        const confirmPassword = document.getElementById('register-confirm-password').value.trim();
        const role = registerRoleSelect.value;

        // Validar registro
        const result = validateRegistration(nombre, apellido, email, password, confirmPassword, role);
        
        if (result.valid) {
            // Registrar usuario
            registerUser(nombre, apellido, email, password, role);
            
            // Mostrar mensaje de éxito
            showSuccess(result.message);
            
            // Simular carga
            const submitBtn = registerForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Registrando...';
            submitBtn.disabled = true;
            
            // Limpiar formulario y volver al login
            setTimeout(() => {
                registerForm.reset();
                showLogin();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 1000);
        } else {
            showError(result.message);
        }
    });

    // Event listeners para mejorar la experiencia de usuario - Login
    emailInput.addEventListener('focus', function() {
        this.style.borderColor = '#007bff';
    });

    emailInput.addEventListener('blur', function() {
        this.style.borderColor = '#ddd';
    });

    passwordInput.addEventListener('focus', function() {
        this.style.borderColor = '#007bff';
    });

    passwordInput.addEventListener('blur', function() {
        this.style.borderColor = '#ddd';
    });

    roleSelect.addEventListener('focus', function() {
        this.style.borderColor = '#007bff';
    });

    roleSelect.addEventListener('blur', function() {
        this.style.borderColor = '#ddd';
    });

    // Event listeners para mejorar la experiencia de usuario - Registro
    [nombreInput, apellidoInput, registerEmailInput, registerPasswordInput, registerRoleSelect].forEach(field => {
        field.addEventListener('focus', function() {
            this.style.borderColor = '#007bff';
        });

        field.addEventListener('blur', function() {
            this.style.borderColor = '#ddd';
        });
    });

    // Validación en tiempo real - Login
    function validateField(field, minLength = 1) {
        const value = field.value.trim();
        const isValid = value.length >= minLength;
        
        if (isValid) {
            field.style.borderColor = '#28a745';
        } else {
            field.style.borderColor = '#dc3545';
        }
        
        return isValid;
    }

    emailInput.addEventListener('input', function() {
        validateField(this, 1);
    });

    passwordInput.addEventListener('input', function() {
        validateField(this, 6);
    });

    // Validación en tiempo real - Registro
    apellidoInput.addEventListener('input', function() {
        validateField(this, 1);
    });

    registerPasswordInput.addEventListener('input', function() {
        validateField(this, 6);
    });

    // Función para limpiar formularios
    function clearForm(form) {
        form.reset();
        const inputs = form.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.style.borderColor = '#ddd';
        });
    }

    // Agregar botones de limpiar
    function addClearButton(form, container) {
        if (!container.querySelector('.clear-btn')) {
            const clearBtn = document.createElement('button');
            clearBtn.type = 'button';
            clearBtn.className = 'clear-btn';
            clearBtn.textContent = 'Limpiar';
            clearBtn.style.cssText = `
                background: #6c757d;
                color: #fff;
                border: none;
                padding: 12px;
                border-radius: 8px;
                font-size: 16px;
                font-weight: 500;
                cursor: pointer;
                margin-top: 10px;
                width: 100%;
            `;
            
            clearBtn.addEventListener('click', () => clearForm(form));
            form.appendChild(clearBtn);
        }
    }

    addClearButton(loginForm, loginContainer);
    addClearButton(registerForm, registerContainer);

    // Funcionalidad para mostrar/ocultar contraseñas
    function setupPasswordToggle(passwordInput, toggleBtn) {
        toggleBtn.addEventListener('click', function() {
            const type = passwordInput.type === 'password' ? 'text' : 'password';
            passwordInput.type = type;
            this.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
        });
    }

    // Configurar toggles para todos los campos de contraseña
    setupPasswordToggle(passwordInput, document.getElementById('login-password-toggle'));
    setupPasswordToggle(registerPasswordInput, document.getElementById('register-password-toggle'));
    setupPasswordToggle(document.getElementById('register-confirm-password'), document.getElementById('register-confirm-password-toggle'));
}); 