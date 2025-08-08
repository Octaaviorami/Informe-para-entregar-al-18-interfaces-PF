// Funcionalidad de filtros para la sección de informes

document.addEventListener('DOMContentLoaded', function() {
    const fechaInicio = document.getElementById('fecha-inicio');
    const fechaFin = document.getElementById('fecha-fin');
    const buscarBtn = document.getElementById('buscar-filtros');
    const limpiarBtn = document.querySelector('.filters-buttons .btn-outline');

    // Datos de ejemplo de ventas (en un proyecto real esto vendría de una base de datos)
    const ventasData = [
        {
            fecha: '2025-06-30',
            cliente: 'Juan Pérez',
            producto: 'Libro "El Principito"',
            cantidad: 1,
            precioUnitario: 15.99,
            total: 15.99
        },
        {
            fecha: '2025-06-29',
            cliente: 'María García',
            producto: 'Lapicera Bic Cristal',
            cantidad: 5,
            precioUnitario: 2.50,
            total: 12.50
        },
        {
            fecha: '2025-06-28',
            cliente: 'Carlos López',
            producto: 'Cuaderno A4 100 hojas',
            cantidad: 3,
            precioUnitario: 8.99,
            total: 26.97
        },
        {
            fecha: '2025-06-27',
            cliente: 'Ana Martínez',
            producto: 'Resaltador Amarillo',
            cantidad: 2,
            precioUnitario: 3.50,
            total: 7.00
        },
        {
            fecha: '2025-06-26',
            cliente: 'Luis Rodríguez',
            producto: 'Goma de Borrar',
            cantidad: 4,
            precioUnitario: 1.25,
            total: 5.00
        },
        {
            fecha: '2025-06-25',
            cliente: 'Sofía Torres',
            producto: 'Libro "Cien Años de Soledad"',
            cantidad: 1,
            precioUnitario: 22.99,
            total: 22.99
        },
        {
            fecha: '2025-06-24',
            cliente: 'Miguel Ángel',
            producto: 'Tijera Escolar',
            cantidad: 2,
            precioUnitario: 4.99,
            total: 9.98
        },
        {
            fecha: '2025-06-23',
            cliente: 'Carmen Ruiz',
            producto: 'Carpeta A4 con Ganchos',
            cantidad: 1,
            precioUnitario: 6.99,
            total: 6.99
        }
    ];

    // Función para filtrar ventas por rango de fechas
    function filtrarVentas(fechaInicio, fechaFin) {
        if (!fechaInicio || !fechaFin) {
            return ventasData; // Si no hay fechas, mostrar todas
        }

        return ventasData.filter(venta => {
            const fechaVenta = new Date(venta.fecha);
            const inicio = new Date(fechaInicio);
            const fin = new Date(fechaFin);
            
            return fechaVenta >= inicio && fechaVenta <= fin;
        });
    }

    // Función para obtener ventas del mes actual
    function obtenerVentasMesActual() {
        const fechaActual = new Date();
        const mesActual = fechaActual.getMonth();
        const añoActual = fechaActual.getFullYear();
        
        return ventasData.filter(venta => {
            const fechaVenta = new Date(venta.fecha);
            return fechaVenta.getMonth() === mesActual && fechaVenta.getFullYear() === añoActual;
        });
    }

    // Función para actualizar las estadísticas
    function actualizarEstadisticas(ventasFiltradas) {
        const totalVentas = ventasFiltradas.length;
        const totalProductos = ventasFiltradas.reduce((sum, venta) => sum + venta.cantidad, 0);
        const totalRecaudacion = ventasFiltradas.reduce((sum, venta) => sum + venta.total, 0);

        // Obtener ventas del mes actual para mostrar por defecto
        const ventasMesActual = obtenerVentasMesActual();
        const recaudacionMesActual = ventasMesActual.reduce((sum, venta) => sum + venta.total, 0);
        const nombreMesActual = new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });

        // Calcular productos más y menos vendidos del mes actual
        const productosVendidosMes = {};
        ventasMesActual.forEach(venta => {
            if (productosVendidosMes[venta.producto]) {
                productosVendidosMes[venta.producto] += venta.cantidad;
            } else {
                productosVendidosMes[venta.producto] = venta.cantidad;
            }
        });

        let productoMasVendidoMes = { nombre: 'N/A', cantidad: 0 };
        let productoMenosVendidoMes = { nombre: 'N/A', cantidad: 0 };
        
        if (Object.keys(productosVendidosMes).length > 0) {
            const productosOrdenados = Object.entries(productosVendidosMes).sort((a, b) => b[1] - a[1]);
            productoMasVendidoMes = {
                nombre: productosOrdenados[0][0],
                cantidad: productosOrdenados[0][1]
            };
            productoMenosVendidoMes = {
                nombre: productosOrdenados[productosOrdenados.length - 1][0],
                cantidad: productosOrdenados[productosOrdenados.length - 1][1]
            };
        }

        // Actualizar tarjetas de estadísticas
        const ventasMesElement = document.querySelector('.stats-cards .stat-card:nth-child(1) .stat-content h3');
        const ventasHistoricasElement = document.querySelector('.stats-cards .stat-card:nth-child(2) .stat-content h3');
        const productosMesElement = document.querySelector('.stats-cards .stat-card:nth-child(3) .stat-content h3');
        const productosTotalElement = document.querySelector('.stats-cards .stat-card:nth-child(4) .stat-content h3');
        const recaudacionMesElement = document.querySelector('.stats-cards .stat-card:nth-child(5) .stat-content h3');
        const productoMasVendidoElement = document.querySelector('.stats-cards .stat-card:nth-child(6) .stat-content h3');
        const productoMenosVendidoElement = document.querySelector('.stats-cards .stat-card:nth-child(7) .stat-content h3');

        if (ventasMesElement) ventasMesElement.textContent = ventasMesActual.length;
        if (ventasHistoricasElement) ventasHistoricasElement.textContent = ventasData.length;
        if (productosMesElement) productosMesElement.textContent = ventasMesActual.reduce((sum, venta) => sum + venta.cantidad, 0);
        if (productosTotalElement) productosTotalElement.textContent = ventasData.reduce((sum, venta) => sum + venta.cantidad, 0);
        if (recaudacionMesElement) recaudacionMesElement.textContent = `$${recaudacionMesActual.toFixed(2)}`;
        if (productoMasVendidoElement) productoMasVendidoElement.textContent = productoMasVendidoMes.nombre;
        if (productoMenosVendidoElement) productoMenosVendidoElement.textContent = productoMenosVendidoMes.nombre;


    }

    // Función para actualizar la tabla de ventas
    function actualizarTablaVentas(ventasFiltradas) {
        const tablaVentas = document.querySelector('.table-section .data-table tbody');
        if (!tablaVentas) return;

        tablaVentas.innerHTML = '';

        if (ventasFiltradas.length === 0) {
            tablaVentas.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; color: #6c757d; font-style: italic;">
                        No hay ventas en el rango de fechas seleccionado
                    </td>
                </tr>
            `;
            return;
        }

        ventasFiltradas.forEach(venta => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${new Date(venta.fecha).toLocaleDateString('es-ES')}</td>
                <td>${venta.cliente}</td>
                <td>${venta.producto}</td>
                <td>${venta.cantidad}</td>
                <td>$${venta.precioUnitario.toFixed(2)}</td>
                <td>$${venta.total.toFixed(2)}</td>
            `;
            tablaVentas.appendChild(row);
        });
    }

    // Función para crear interfaz de resumen del período
    function crearInterfazResumen(ventasFiltradas, fechaInicioValue, fechaFinValue) {
        // Eliminar interfaz anterior si existe
        const interfazAnterior = document.getElementById('resumen-periodo');
        if (interfazAnterior) {
            interfazAnterior.remove();
        }

        // Calcular el producto más vendido
        const productosVendidos = {};
        ventasFiltradas.forEach(venta => {
            if (productosVendidos[venta.producto]) {
                productosVendidos[venta.producto] += venta.cantidad;
            } else {
                productosVendidos[venta.producto] = venta.cantidad;
            }
        });

        let productoMasVendido = { nombre: 'N/A', cantidad: 0 };
        if (Object.keys(productosVendidos).length > 0) {
            const productosOrdenados = Object.entries(productosVendidos).sort((a, b) => b[1] - a[1]);
            productoMasVendido = {
                nombre: productosOrdenados[0][0],
                cantidad: productosOrdenados[0][1]
            };
        }

        // Crear nueva interfaz con el estilo de la página
        const resumenContainer = document.createElement('div');
        resumenContainer.id = 'resumen-periodo';
        resumenContainer.className = 'form-section';
        resumenContainer.style.cssText = `
            margin-top: 20px;
            padding: 20px;
            background: #fff;
            border-radius: 8px;
            border: 1px solid #dee2e6;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        `;

        const totalVentas = ventasFiltradas.length;
        const totalProductos = ventasFiltradas.reduce((sum, venta) => sum + venta.cantidad, 0);
        const gananciasTotales = ventasFiltradas.reduce((sum, venta) => sum + venta.total, 0);
        const fechaInicioFormateada = new Date(fechaInicioValue).toLocaleDateString('es-ES');
        const fechaFinFormateada = new Date(fechaFinValue).toLocaleDateString('es-ES');

        resumenContainer.innerHTML = `
            <div style="text-align: center; margin-bottom: 20px;">
                <h4 style="margin: 0; color: #333; font-size: 20px; font-weight: 600;">
                    <i class="fas fa-chart-line" style="color: #007bff; margin-right: 8px;"></i> Resumen del Período
                </h4>
                <p style="margin: 10px 0 0 0; color: #666; font-size: 14px;">
                    ${fechaInicioFormateada} - ${fechaFinFormateada}
                </p>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 20px;">
                <div style="text-align: center; padding: 15px; background: #f8f9fa; border-radius: 8px; border: 1px solid #dee2e6;">
                    <div style="font-size: 24px; color: #007bff; margin-bottom: 8px;">
                        <i class="fas fa-shopping-cart"></i>
                    </div>
                    <div style="font-size: 24px; font-weight: bold; color: #333; margin-bottom: 5px;">${totalVentas}</div>
                    <div style="font-size: 12px; color: #666;">Ventas Realizadas</div>
                </div>
                
                <div style="text-align: center; padding: 15px; background: #f8f9fa; border-radius: 8px; border: 1px solid #dee2e6;">
                    <div style="font-size: 24px; color: #28a745; margin-bottom: 8px;">
                        <i class="fas fa-box"></i>
                    </div>
                    <div style="font-size: 24px; font-weight: bold; color: #333; margin-bottom: 5px;">${totalProductos}</div>
                    <div style="font-size: 12px; color: #666;">Productos Vendidos</div>
                </div>
                
                <div style="text-align: center; padding: 15px; background: #f8f9fa; border-radius: 8px; border: 1px solid #dee2e6;">
                    <div style="font-size: 24px; color: #dc3545; margin-bottom: 8px;">
                        <i class="fas fa-dollar-sign"></i>
                    </div>
                    <div style="font-size: 24px; font-weight: bold; color: #333; margin-bottom: 5px;">$${gananciasTotales.toFixed(2)}</div>
                    <div style="font-size: 12px; color: #666;">Ganancias Totales</div>
                </div>
            </div>
            
            <div style="margin-bottom: 20px; padding: 15px; background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px;">
                <div style="text-align: center;">
                    <div style="font-size: 20px; color: #856404; margin-bottom: 8px;">
                        <i class="fas fa-trophy"></i>
                    </div>
                    <div style="font-size: 18px; font-weight: bold; color: #856404; margin-bottom: 5px;">
                        Producto Más Vendido
                    </div>
                    <div style="font-size: 16px; color: #856404; margin-bottom: 3px; font-weight: 600;">
                        ${productoMasVendido.nombre}
                    </div>
                    <div style="font-size: 14px; color: #856404;">
                        ${productoMasVendido.cantidad} unidades vendidas
                    </div>
                </div>
            </div>
            
            <div style="text-align: center;">
                <button type="button" onclick="cerrarResumen()" class="btn-outline" style="
                    background: #fff;
                    border: 1px solid #dee2e6;
                    color: #6c757d;
                    padding: 8px 16px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 14px;
                    transition: all 0.3s ease;
                " onmouseover="this.style.background='#f8f9fa'" onmouseout="this.style.background='#fff'">
                    <i class="fas fa-times"></i> Cerrar Resumen
                </button>
            </div>
        `;

        // Insertar dentro del filters-section
        const filtersSection = document.querySelector('.filters-section');
        if (filtersSection) {
            filtersSection.appendChild(resumenContainer);
        }

        // Hacer scroll suave hacia el resumen
        resumenContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Función para cerrar el resumen
    window.cerrarResumen = function() {
        const resumen = document.getElementById('resumen-periodo');
        if (resumen) {
            resumen.remove();
        }
    };

    // Función para aplicar filtros
    function aplicarFiltros() {
        const fechaInicioValue = fechaInicio.value;
        const fechaFinValue = fechaFin.value;

        if (!fechaInicioValue || !fechaFinValue) {
            alert('Por favor, selecciona tanto la fecha de inicio como la fecha de fin');
            return;
        }

        if (new Date(fechaInicioValue) > new Date(fechaFinValue)) {
            alert('La fecha de inicio no puede ser posterior a la fecha de fin');
            return;
        }

        const ventasFiltradas = filtrarVentas(fechaInicioValue, fechaFinValue);
        
        actualizarEstadisticas(ventasFiltradas);
        actualizarTablaVentas(ventasFiltradas);
        crearInterfazResumen(ventasFiltradas, fechaInicioValue, fechaFinValue);

        // Mostrar mensaje de confirmación
        alert(`Filtro aplicado exitosamente!\n\nVentas encontradas: ${ventasFiltradas.length}\nPeríodo: ${new Date(fechaInicioValue).toLocaleDateString('es-ES')} - ${new Date(fechaFinValue).toLocaleDateString('es-ES')}`);
    }

    // Función para limpiar filtros
    function limpiarFiltros() {
        fechaInicio.value = '';
        fechaFin.value = '';
        
        // Eliminar interfaz de resumen si existe
        const resumen = document.getElementById('resumen-periodo');
        if (resumen) {
            resumen.remove();
        }
        
        // Restaurar datos originales y mostrar mes actual
        actualizarEstadisticas(ventasData);
        actualizarTablaVentas(ventasData);
        
        alert('Filtros limpiados. Mostrando ventas del mes actual.');
    }

    // Event listeners
    if (buscarBtn) {
        buscarBtn.addEventListener('click', aplicarFiltros);
    }

    if (limpiarBtn) {
        limpiarBtn.addEventListener('click', limpiarFiltros);
    }

    // Event listener para aplicar filtros al presionar Enter en los campos de fecha
    [fechaInicio, fechaFin].forEach(input => {
        if (input) {
            input.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    aplicarFiltros();
                }
            });
        }
    });

    // Inicializar mostrando el mes actual por defecto
    const ventasMesActual = obtenerVentasMesActual();
    actualizarEstadisticas(ventasData);
    actualizarTablaVentas(ventasMesActual);
});
