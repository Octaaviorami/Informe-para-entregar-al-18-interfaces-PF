// Funcionalidad de búsqueda de productos para la sección de ventas (Empleado)

document.addEventListener('DOMContentLoaded', function() {
    const productSearchInput = document.getElementById('product-search');
    const productResults = document.getElementById('product-results');
    
    // Productos de ejemplo (en un proyecto real esto vendría de una base de datos)
    const productos = [
        { id: 1, nombre: 'Libro "El Principito"', precio: 15.99, stock: 5, categoria: 'Libros' },
        { id: 2, nombre: 'Lapicera Bic Cristal', precio: 2.50, stock: 0, categoria: 'Útiles Escolares' },
        { id: 3, nombre: 'Cuaderno A4 100 hojas', precio: 8.99, stock: 2, categoria: 'Papelería' },
        { id: 4, nombre: 'Resaltador Amarillo', precio: 3.50, stock: 8, categoria: 'Útiles Escolares' },
        { id: 5, nombre: 'Goma de Borrar', precio: 1.25, stock: 1, categoria: 'Útiles Escolares' },
        { id: 6, nombre: 'Libro "Cien Años de Soledad"', precio: 22.99, stock: 3, categoria: 'Libros' },
        { id: 7, nombre: 'Tijera Escolar', precio: 4.99, stock: 12, categoria: 'Útiles Escolares' },
        { id: 8, nombre: 'Carpeta A4 con Ganchos', precio: 6.99, stock: 6, categoria: 'Papelería' }
    ];

    let selectedProduct = null;
    let productosAgregados = []; // Array para almacenar productos agregados a la venta

    // Función para filtrar productos
    function filterProducts(searchTerm) {
        if (!searchTerm.trim()) {
            return [];
        }
        
        return productos.filter(producto => 
            producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            producto.categoria.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    // Función para mostrar resultados
    function showResults(results) {
        if (results.length === 0) {
            productResults.style.display = 'none';
            return;
        }

        productResults.innerHTML = '';
        
        results.forEach(producto => {
            const resultItem = document.createElement('div');
            resultItem.className = 'product-result-item';
            resultItem.innerHTML = `
                <div class="product-result-name">${producto.nombre}</div>
                <div class="product-result-details">
                    $${producto.precio} | Stock: ${producto.stock} | ${producto.categoria}
                </div>
            `;
            
            resultItem.addEventListener('click', () => {
                selectProduct(producto);
            });
            
            productResults.appendChild(resultItem);
        });
        
        productResults.style.display = 'block';
    }

    // Función para seleccionar un producto
    function selectProduct(producto) {
        selectedProduct = producto;
        productSearchInput.value = producto.nombre;
        productResults.style.display = 'none';
        
        // Actualizar el precio total si hay cantidad
        updateTotal();
        
        // Mostrar información del producto seleccionado
        showSelectedProductInfo(producto);
    }

    // Función para mostrar información del producto seleccionado
    function showSelectedProductInfo(producto) {
        // Crear o actualizar elemento de información
        let infoElement = document.getElementById('selected-product-info');
        if (!infoElement) {
            infoElement = document.createElement('div');
            infoElement.id = 'selected-product-info';
            infoElement.style.cssText = `
                margin-top: 10px;
                padding: 10px;
                background: #f8f9fa;
                border-radius: 6px;
                font-size: 14px;
            `;
            productSearchInput.parentNode.appendChild(infoElement);
        }
        
        infoElement.innerHTML = `
            <strong>Producto seleccionado:</strong> ${producto.nombre}<br>
            <strong>Precio:</strong> $${producto.precio} | <strong>Stock disponible:</strong> ${producto.stock}
        `;
    }

    // Función para mostrar productos agregados
    function mostrarProductosAgregados() {
        let productosContainer = document.getElementById('productos-agregados');
        if (!productosContainer) {
            productosContainer = document.createElement('div');
            productosContainer.id = 'productos-agregados';
            productosContainer.style.cssText = `
                margin-top: 15px;
                padding: 15px;
                background: #f8f9fa;
                border-radius: 8px;
                border: 1px solid #dee2e6;
            `;
            
            // Insertar después del div product-selection
            const productSelection = document.querySelector('.product-selection');
            if (productSelection) {
                productSelection.parentNode.insertBefore(productosContainer, productSelection.nextSibling);
            }
        }
        
        if (productosAgregados.length === 0) {
            productosContainer.innerHTML = '<p style="color: #6c757d; font-style: italic;">No hay productos agregados</p>';
            return;
        }
        
        let html = '<h5 style="margin-bottom: 10px; color: #495057;"><i class="fas fa-list"></i> Productos Agregados</h5>';
        html += '<div style="max-height: 200px; overflow-y: auto;">';
        
        productosAgregados.forEach((item, index) => {
            html += `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px; border-bottom: 1px solid #dee2e6; background: white; margin-bottom: 5px; border-radius: 4px;">
                    <div>
                        <strong>${item.producto.nombre}</strong><br>
                        <small style="color: #6c757d;">Cantidad: ${item.cantidad} | Precio: $${item.producto.precio}</small>
                    </div>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span style="font-weight: bold; color: #28a745;">$${(item.producto.precio * item.cantidad).toFixed(2)}</span>
                        <button type="button" class="btn-icon" onclick="removeProducto(${index})" style="background: #dc3545; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer;">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        productosContainer.innerHTML = html;
    }

    // Función para remover producto de la lista
    window.removeProducto = function(index) {
        productosAgregados.splice(index, 1);
        mostrarProductosAgregados();
        calcularTotalVenta();
    };

    // Función para calcular el total de la venta
    function calcularTotalVenta() {
        const total = productosAgregados.reduce((sum, item) => {
            return sum + (item.producto.precio * item.cantidad);
        }, 0);
        
        const totalElement = document.querySelector('.total-section h4');
        if (totalElement) {
            totalElement.textContent = `$ Total: $${total.toFixed(2)}`;
        }
    }

    // Función para actualizar el total
    function updateTotal() {
        const cantidadInput = document.querySelector('input[type="number"]');
        if (selectedProduct && cantidadInput) {
            const cantidad = parseInt(cantidadInput.value) || 0;
            const total = selectedProduct.precio * cantidad;
            
            const totalElement = document.querySelector('.total-section h4');
            if (totalElement) {
                totalElement.textContent = `$ Total: $${total.toFixed(2)}`;
            }
        }
    }

    // Event listener para la búsqueda
    if (productSearchInput) {
        productSearchInput.addEventListener('input', function() {
            const searchTerm = this.value;
            const results = filterProducts(searchTerm);
            showResults(results);
            
            // Limpiar producto seleccionado si se borra la búsqueda
            if (!searchTerm.trim()) {
                selectedProduct = null;
                const infoElement = document.getElementById('selected-product-info');
                if (infoElement) {
                    infoElement.remove();
                }
            }
        });

        // Event listener para cerrar resultados al hacer clic fuera
        document.addEventListener('click', function(e) {
            if (!productSearchInput.contains(e.target) && !productResults.contains(e.target)) {
                productResults.style.display = 'none';
            }
        });

        // Event listener para navegación con teclado
        productSearchInput.addEventListener('keydown', function(e) {
            const items = productResults.querySelectorAll('.product-result-item');
            const selectedItem = productResults.querySelector('.product-result-item.selected');
            
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (!selectedItem) {
                    items[0]?.classList.add('selected');
                } else {
                    selectedItem.classList.remove('selected');
                    const nextItem = selectedItem.nextElementSibling;
                    if (nextItem) {
                        nextItem.classList.add('selected');
                    } else {
                        items[0]?.classList.add('selected');
                    }
                }
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (selectedItem) {
                    selectedItem.classList.remove('selected');
                    const prevItem = selectedItem.previousElementSibling;
                    if (prevItem) {
                        prevItem.classList.add('selected');
                    } else {
                        items[items.length - 1]?.classList.add('selected');
                    }
                }
            } else if (e.key === 'Enter') {
                e.preventDefault();
                const selectedItem = productResults.querySelector('.product-result-item.selected');
                if (selectedItem) {
                    const index = Array.from(items).indexOf(selectedItem);
                    selectProduct(productos[index]);
                }
            } else if (e.key === 'Escape') {
                productResults.style.display = 'none';
            }
        });
    }

    // Event listener para el botón de cantidad
    const cantidadInput = document.querySelector('input[type="number"]');
    if (cantidadInput) {
        cantidadInput.addEventListener('input', updateTotal);
    }

    // Event listener para el botón Agregar
    const agregarBtn = document.querySelector('.product-selection .btn-secondary');
    if (agregarBtn) {
        agregarBtn.addEventListener('click', function() {
            if (selectedProduct) {
                const cantidad = parseInt(cantidadInput?.value) || 1;
                
                // Verificar si el producto ya está en la lista
                const productoExistente = productosAgregados.find(item => item.producto.id === selectedProduct.id);
                
                if (productoExistente) {
                    // Si ya existe, aumentar la cantidad
                    productoExistente.cantidad += cantidad;
                    alert(`Cantidad actualizada para "${selectedProduct.nombre}" (Total: ${productoExistente.cantidad} unidad/es)`);
                } else {
                    // Si es nuevo, agregarlo a la lista
                    productosAgregados.push({
                        producto: selectedProduct,
                        cantidad: cantidad
                    });
                    alert(`Producto "${selectedProduct.nombre}" agregado (${cantidad} unidad/es)`);
                }
                
                // Actualizar la vista de productos agregados
                mostrarProductosAgregados();
                calcularTotalVenta();
                
                // Limpiar selección
                selectedProduct = null;
                productSearchInput.value = '';
                const infoElement = document.getElementById('selected-product-info');
                if (infoElement) {
                    infoElement.remove();
                }
                
                // Resetear cantidad a 1
                if (cantidadInput) {
                    cantidadInput.value = '1';
                }
            } else {
                alert('Por favor, selecciona un producto primero');
            }
        });
    }

    // Event listener para el formulario de venta
    const saleForm = document.querySelector('.sale-form');
    if (saleForm) {
        saleForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (productosAgregados.length === 0) {
                alert('Por favor, agrega al menos un producto a la venta');
                return;
            }
            
            // Aquí se procesaría la venta con el backend
            const totalVenta = productosAgregados.reduce((sum, item) => {
                return sum + (item.producto.precio * item.cantidad);
            }, 0);
            
            alert(`Venta registrada exitosamente!\n\nTotal: $${totalVenta.toFixed(2)}\nProductos: ${productosAgregados.length}`);
            
            // Limpiar todo después de registrar la venta
            productosAgregados = [];
            mostrarProductosAgregados();
            calcularTotalVenta();
            selectedProduct = null;
            productSearchInput.value = '';
            const infoElement = document.getElementById('selected-product-info');
            if (infoElement) {
                infoElement.remove();
            }
            if (cantidadInput) {
                cantidadInput.value = '1';
            }
        });
    }
});
