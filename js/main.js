// Lógica de login para el sistema de gestión de inventario
// Validación de credenciales y redirección según rol

document.addEventListener('DOMContentLoaded', function() {
    // Elementos del formulario de login
    const loginForm = document.getElementById('login-form');
    const emailInput = document.getElementById('login-email');
    const passwordInput = document.getElementById('login-password');

    // Credenciales de demostración (usuarios por defecto)
    const defaultCredentials = {
        'admin@demo.com': {
            password: 'admin123',
            role: 'admin',
            redirect: 'admin.html'
        },
        'empleado@demo.com': {
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

    // Función para validar credenciales (determina rol automáticamente)
    function validateCredentials(email, password) {
        if (!email || !password) {
            return { valid: false, message: 'Por favor, completa todos los campos.' };
        }

        // Verificar usuarios por defecto
        const defaultUser = defaultCredentials[email];
        if (defaultUser && password === defaultUser.password) {
            return { 
                valid: true, 
                message: `Bienvenido ${email}!`,
                redirect: defaultUser.redirect,
                role: defaultUser.role
            };
        }

        return { 
            valid: false, 
            message: 'Credenciales incorrectas. Verifica tu email y contraseña.' 
        };
    }

    // Event listener para el formulario de login
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        // Validar credenciales
        const result = validateCredentials(email, password);
        
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

    // Event listeners para mejorar la experiencia de usuario - Login
    emailInput.addEventListener('focus', function() {
        this.style.borderColor = '#667eea';
    });

    emailInput.addEventListener('blur', function() {
        this.style.borderColor = '#e1e5e9';
    });

    passwordInput.addEventListener('focus', function() {
        this.style.borderColor = '#667eea';
    });

    passwordInput.addEventListener('blur', function() {
        this.style.borderColor = '#e1e5e9';
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

    // Función para limpiar formulario
    function clearForm(form) {
        form.reset();
        const inputs = form.querySelectorAll('input');
        inputs.forEach(input => {
            input.style.borderColor = '#e1e5e9';
        });
    }

    // Agregar botón de limpiar
    function addClearButton(form) {
        if (!form.querySelector('.clear-btn')) {
            const clearBtn = document.createElement('button');
            clearBtn.type = 'button';
            clearBtn.className = 'clear-btn';
            clearBtn.textContent = 'Limpiar';
            
            clearBtn.addEventListener('click', () => clearForm(form));
            form.appendChild(clearBtn);
        }
    }

    addClearButton(loginForm);

    // Funcionalidad para mostrar/ocultar contraseña
    function setupPasswordToggle(passwordInput, toggleBtn) {
        toggleBtn.addEventListener('click', function() {
            const type = passwordInput.type === 'password' ? 'text' : 'password';
            passwordInput.type = type;
            this.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
        });
    }

    // Configurar toggle para el campo de contraseña
    setupPasswordToggle(passwordInput, document.getElementById('login-password-toggle'));
}); 