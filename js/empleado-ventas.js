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

    // Event listener para el formulario de venta
    const saleForm = document.querySelector('.sale-form');
    if (saleForm) {
        saleForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (!selectedProduct) {
                alert('Por favor, selecciona un producto para la venta');
                return;
            }
            
            const fecha = document.querySelector('input[type="date"]').value;
            const cliente = document.querySelector('input[placeholder="Ingrese el nombre del cliente"]').value;
            const cantidad = parseInt(cantidadInput?.value) || 1;
            
            if (!fecha || !cliente) {
                alert('Por favor, completa todos los campos obligatorios');
                return;
            }
            
            // Aquí se procesaría la venta con el backend
            const totalVenta = selectedProduct.precio * cantidad;
            
            alert(`Venta registrada exitosamente!\n\nCliente: ${cliente}\nProducto: ${selectedProduct.nombre}\nCantidad: ${cantidad}\nTotal: $${totalVenta.toFixed(2)}`);
            
            // Limpiar formulario después de registrar la venta
            saleForm.reset();
            selectedProduct = null;
            productSearchInput.value = '';
            const infoElement = document.getElementById('selected-product-info');
            if (infoElement) {
                infoElement.remove();
            }
            if (cantidadInput) {
                cantidadInput.value = '1';
            }
            
            // Actualizar total
            updateTotal();
        });
    }
});
