// Lógica SPA para el panel de administrador
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
        'productos': 'fas fa-box',
        'proveedores': 'fas fa-user',
        'ventas': 'fas fa-shopping-cart',
        'informes': 'fas fa-chart-bar',
        'stock': 'fas fa-warehouse'
    };

    // Títulos para cada sección
    const sectionTitles = {
        'principal': 'Principal',
        'productos': 'Productos',
        'proveedores': 'Proveedores',
        'ventas': 'Ventas',
        'informes': 'Informes',
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

    // Funcionalidad para botones de acción en tablas
    const actionButtons = document.querySelectorAll('.btn-icon');
    actionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.querySelector('i').classList.contains('fa-edit') ? 'editar' : 'eliminar';
            const row = this.closest('tr');
            const productName = row.querySelector('td:first-child').textContent;
            
            if (action === 'eliminar') {
                if (confirm(`¿Estás seguro de que deseas eliminar "${productName}"?`)) {
                    row.remove();
                    alert('Elemento eliminado exitosamente');
                }
            } else {
                // Abrir modal de edición
                openEditModal(row);
            }
        });
    });

    // Funcionalidad del modal de edición
    const editModal = document.getElementById('edit-product-modal');
    const closeEditModal = document.getElementById('close-edit-modal');
    const cancelEdit = document.getElementById('cancel-edit');
    const editForm = document.getElementById('edit-product-form');
    let currentEditRow = null;
    let originalProductData = null;

    function openEditModal(row) {
        currentEditRow = row;
        
        // Obtener datos de la fila
        const cells = row.querySelectorAll('td');
        const nombre = cells[0].textContent.trim();
        const categoria = cells[1].textContent.trim();
        const descripcion = cells[2].textContent.trim();
        const precio = cells[3].textContent.replace('$', '').trim();
        const stock = cells[4].querySelector('.stock-badge').textContent.trim();
        
        // Guardar datos originales para referencia
        originalProductData = {
            nombre: nombre,
            categoria: categoria,
            descripcion: descripcion,
            precio: precio,
            stock: stock
        };
        
        // Llenar el formulario con los datos actuales
        document.getElementById('edit-nombre').value = nombre;
        document.getElementById('edit-categoria').value = categoria;
        document.getElementById('edit-descripcion').value = descripcion;
        document.getElementById('edit-precio').value = precio;
        document.getElementById('edit-stock').value = stock;
        
        // Mostrar modal
        editModal.style.display = 'block';
        
        // Enfocar el primer campo
        document.getElementById('edit-nombre').focus();
    }

    function closeEditModalFunc() {
        editModal.style.display = 'none';
        currentEditRow = null;
        originalProductData = null;
        editForm.reset();
    }

    // Event listeners para cerrar modal
    if (closeEditModal) {
        closeEditModal.addEventListener('click', closeEditModalFunc);
    }

    if (cancelEdit) {
        cancelEdit.addEventListener('click', closeEditModalFunc);
    }

    // Cerrar modal al hacer clic fuera
    if (editModal) {
        editModal.addEventListener('click', function(e) {
            if (e.target === editModal) {
                closeEditModalFunc();
            }
        });
    }

    // Función para actualizar todas las tablas que contengan el producto
    function updateProductInAllTables(originalName, newData) {
        // Buscar en todas las tablas del documento
        const allTables = document.querySelectorAll('.data-table');
        
        allTables.forEach(table => {
            const rows = table.querySelectorAll('tbody tr');
            
            rows.forEach(row => {
                const firstCell = row.querySelector('td:first-child');
                if (firstCell && firstCell.textContent.trim() === originalName) {
                    // Actualizar datos de la fila
                    const cells = row.querySelectorAll('td');
                    
                    if (cells.length >= 4) {
                        cells[0].textContent = newData.nombre;
                        cells[1].textContent = newData.categoria;
                        
                        // Si hay columna de descripción
                        if (cells.length >= 3) {
                            cells[2].textContent = newData.descripcion;
                        }
                        
                        // Actualizar precio
                        if (cells.length >= 4) {
                            cells[3].textContent = `$${parseFloat(newData.precio).toFixed(2)}`;
                        }
                        
                        // Actualizar stock si existe
                        if (cells.length >= 5) {
                            const stockCell = cells[4];
                            const stockBadge = stockCell.querySelector('.stock-badge');
                            
                            if (stockBadge) {
                                stockBadge.textContent = newData.stock;
                                stockBadge.className = 'stock-badge';
                                
                                // Aplicar clase de color según el stock
                                const stockValue = parseInt(newData.stock);
                                if (stockValue === 0) {
                                    stockBadge.classList.add('empty');
                                } else if (stockValue <= 2) {
                                    stockBadge.classList.add('low');
                                } else {
                                    stockBadge.classList.add('good');
                                }
                            } else {
                                // Si no hay badge, crear uno
                                stockCell.innerHTML = `<span class="stock-badge ${getStockClass(newData.stock)}">${newData.stock}</span>`;
                            }
                        }
                    }
                }
            });
        });
    }

    // Función para determinar la clase CSS del stock
    function getStockClass(stock) {
        const stockValue = parseInt(stock);
        if (stockValue === 0) return 'empty';
        if (stockValue <= 2) return 'low';
        return 'good';
    }

    // Manejar envío del formulario de edición
    if (editForm) {
        editForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (!currentEditRow || !originalProductData) {
                alert('Error: No se puede editar el producto');
                return;
            }
            
            // Obtener valores del formulario
            const formData = new FormData(editForm);
            const nombre = formData.get('nombre').trim();
            const categoria = formData.get('categoria').trim();
            const descripcion = formData.get('descripcion').trim();
            const precio = parseFloat(formData.get('precio'));
            const stock = parseInt(formData.get('stock'));
            
            // Validaciones
            if (!nombre || !categoria || !descripcion) {
                alert('Por favor complete todos los campos obligatorios');
                return;
            }
            
            if (precio < 0) {
                alert('El precio no puede ser negativo');
                return;
            }
            
            if (stock < 0) {
                alert('El stock no puede ser negativo');
                return;
            }
            
            // Crear objeto con los nuevos datos
            const newProductData = {
                nombre: nombre,
                categoria: categoria,
                descripcion: descripcion,
                precio: precio.toFixed(2),
                stock: stock.toString()
            };
            
            // Actualizar todas las tablas que contengan este producto
            updateProductInAllTables(originalProductData.nombre, newProductData);
            
            // Cerrar modal y mostrar confirmación
            closeEditModalFunc();
            
            // Mostrar resumen de cambios
            let changes = [];
            if (originalProductData.nombre !== nombre) changes.push(`Nombre: "${originalProductData.nombre}" → "${nombre}"`);
            if (originalProductData.categoria !== categoria) changes.push(`Categoría: "${originalProductData.categoria}" → "${categoria}"`);
            if (originalProductData.descripcion !== descripcion) changes.push(`Descripción actualizada`);
            if (originalProductData.precio !== precio.toFixed(2)) changes.push(`Precio: $${originalProductData.precio} → $${precio.toFixed(2)}`);
            if (originalProductData.stock !== stock.toString()) changes.push(`Stock: ${originalProductData.stock} → ${stock}`);
            
            if (changes.length > 0) {
                alert(`Producto actualizado exitosamente!\n\nCambios realizados:\n${changes.join('\n')}`);
            } else {
                alert('Producto actualizado exitosamente!');
            }
        });
    }

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

    // Funcionalidad para filtros de informes
    const clearFiltersBtn = document.querySelector('.btn-outline');
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', function() {
            const dateInputs = document.querySelectorAll('input[type="date"]');
            dateInputs.forEach(input => input.value = '');
            alert('Filtros limpiados');
        });
    }

    const exportBtn = document.getElementById('exportar-pdf');
    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            alert('Generando reporte PDF...');
            setTimeout(() => {
                alert('Reporte PDF generado exitosamente');
            }, 2000);
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