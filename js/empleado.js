// Lógica SPA para el panel de empleado
// Permite mostrar solo una sección a la vez según el menú lateral

document.addEventListener('DOMContentLoaded', function() {
    const menuLinks = document.querySelectorAll('.sidebar-menu a[data-section]');
    const sections = document.querySelectorAll('.spa-section');
    const headerTitle = document.querySelector('.header-title h2');
    const headerIcon = document.querySelector('.header-title i');
    const logoutBtn = document.getElementById('logout-btn');
    const logoutModal = document.getElementById('logout-modal');
    const confirmLogout = document.getElementById('confirm-logout');
    const cancelLogout = document.getElementById('cancel-logout');

    // Iconos para cada sección
    const sectionIcons = {
        'principal': 'fas fa-file-alt',
        'ventas': 'fas fa-shopping-cart',
        'stock': 'fas fa-warehouse'
    };

    // Títulos para cada sección
    const sectionTitles = {
        'principal': 'Principal',
        'ventas': 'Ventas',
        'stock': 'Stock'
    };

    // Función para actualizar el header
    function updateHeader(sectionId) {
        if (headerTitle && headerIcon) {
            const section = sectionId.replace('-section', '');
            headerTitle.textContent = sectionTitles[section] || 'Principal';
            headerIcon.className = sectionIcons[section] || 'fas fa-file-alt';
        }
    }

    // Función para mostrar sección
    function showSection(sectionId) {
        // Oculta todas las secciones
        sections.forEach(sec => sec.style.display = 'none');
        
        // Muestra la sección seleccionada
        const section = document.getElementById(sectionId);
        if (section) {
            section.style.display = 'block';
        }
        
        // Actualiza el header
        updateHeader(sectionId);
    }

    // Event listeners para navegación
    menuLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remueve la clase active de todos los enlaces
            menuLinks.forEach(l => l.classList.remove('active'));
            
            // Agrega la clase active al enlace clickeado
            this.classList.add('active');
            
            // Muestra la sección correspondiente
            const sectionId = link.getAttribute('data-section') + '-section';
            showSection(sectionId);
        });
    });

    // Funcionalidad de cierre de sesión
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (logoutModal) {
                logoutModal.style.display = 'block';
            }
        });
    }

    // Confirmar cierre de sesión
    if (confirmLogout) {
        confirmLogout.addEventListener('click', function() {
            // Mostrar mensaje de confirmación
            alert('Sesión cerrada exitosamente. ¡Hasta luego!');
            
            // Redirigir al login
            window.location.href = 'index.html';
        });
    }

    // Cancelar cierre de sesión
    if (cancelLogout) {
        cancelLogout.addEventListener('click', function() {
            if (logoutModal) {
                logoutModal.style.display = 'none';
            }
        });
    }

    // Cerrar modal al hacer clic fuera de él
    if (logoutModal) {
        logoutModal.addEventListener('click', function(e) {
            if (e.target === logoutModal) {
                logoutModal.style.display = 'none';
            }
        });
    }

    // Mostrar la primera sección por defecto (Principal)
    if (sections.length > 0) {
        showSection('principal-section');
    }

    // Funcionalidad para formularios
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simular envío de formulario
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = 'Procesando...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                alert('Datos guardados exitosamente');
                form.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 1000);
        });
    });

    // Funcionalidad para búsqueda
    const searchInput = document.querySelector('.search-box input');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const tableRows = document.querySelectorAll('.data-table tbody tr');
            
            tableRows.forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(searchTerm) ? '' : 'none';
            });
        });
    }

    // Funcionalidad para botones de agregar productos en ventas
    const addProductBtn = document.querySelector('.product-selection .btn-secondary');
    if (addProductBtn) {
        addProductBtn.addEventListener('click', function() {
            const productSelect = this.closest('.form-row').querySelector('select');
            const quantityInput = this.closest('.form-row').querySelector('input[type="number"]');
            
            if (productSelect.value && quantityInput.value > 0) {
                alert(`Producto "${productSelect.options[productSelect.selectedIndex].text}" agregado (${quantityInput.value} unidades)`);
                // Aquí se podría actualizar el total
            } else {
                alert('Por favor selecciona un producto y especifica la cantidad');
            }
        });
    }
}); 