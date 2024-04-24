$(document).ready(function() {
    // Inicializar contadores
    let totalPcs = 0;
    let disponibles = 0;
    let noDisponibles = 0;
    let fueraDeServicio = 0;

    $.ajax({
        url: 'http://localhost/Actividad_Mac/datos.php',
        type: 'GET',
        dataType: 'json',
        success: function(response) {
            if (response.hasOwnProperty('error')) {
                $('#container').text('Error: ' + response.error);
            } else {
                response.forEach(function(item, index) {
                    crearCuadroConImagen(item, index + 1);
                    // Incrementar el contador total y los específicos según el estado
                    totalPcs++;
                    if (item.estado === 'disponible') disponibles++;
                    else if (item.estado === 'nodisponible') noDisponibles++;
                    else if (item.estado === 'fueradeservicio') fueraDeServicio++;
                });
                // Actualizar contadores en el DOM
                $('#totalPcs').text(`Total PCs: ${totalPcs}`);
                $('#disponibles').text(`Disponibles: ${disponibles}`);
                $('#noDisponibles').text(`No Disponibles: ${noDisponibles}`);
                $('#fueraDeServicio').text(`Fuera de Servicio: ${fueraDeServicio}`);
            }
        },
        error: function(xhr, _status, _error) {
            console.error(xhr.responseText);
            $('#container').text('Error al realizar la petición AJAX.');
        }
    });

    // Evento contextmenu para todas las imágenes con la clase pc-img
    $(document).on('contextmenu', '.pc-img', function(e) {
        e.preventDefault();
        mostrarMenuContextual($(this), e.pageX, e.pageY);
    });

    $(document).on('click', '.estado-opcion', function() {
        var pcId = $(this).data('id');
        var nuevoEstado = $(this).data('estado');
        actualizarEstadoPc(pcId, nuevoEstado);
    });

    // Permitir que las imágenes sean arrastrables
    interact('.pc-img').draggable({
        listeners: {
            move(event) {
                var target = event.target;
                var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
                var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

                // Actualizar la posición del elemento
                target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';

                // Guardar la posición en localStorage
                var item = $(target).data('item');
                localStorage.setItem('pcPos-' + item.ID, JSON.stringify({x: x, y: y}));

                // Guardar la posición
                target.setAttribute('data-x', x);
                target.setAttribute('data-y', y);
            }
        }
    });
});


function mostrarMenuContextual($imagen, x, y) {
    $('.context-menu').remove();

    var menu = $('<ul>', { class: 'context-menu' })
        .css({ position: 'absolute', left: x, top: y, zIndex: 1000, backgroundColor: '#f0f0f0', padding: '5px', border: '1px solid #999', borderRadius: '8px' });

    var estados = {
        disponible: "Disponible",
        nodisponible: "No Disponible",
        fueradeservicio: "Fuera De Servicio"
    };

    var pcId = $imagen.data('item').ID;

    Object.entries(estados).forEach(([estado, etiqueta]) => {
        $('<li>', { text: etiqueta, class: 'estado-opcion' })
            .data({ id: pcId, estado: estado })
            .appendTo(menu);
    });

    $('body').append(menu);

    $(document).on('click', function(e) {
        if (!$(e.target).closest('.context-menu').length) {
            $('.context-menu').remove();
        }
    });
}

function actualizarEstadoPc(id, estado) {
    estado = estado.toLowerCase();

    $.ajax({
        url: 'http://localhost/Actividad_Mac/estado.php',
        type: 'POST',
        data: { id: id, estado: estado },
        dataType: 'json',
        success: function(response) {
            if (response.hasOwnProperty('success')) {
                // Mostrar alerta de éxito
                mostrarAlerta('El estado de la PC se actualizará.', function() {
                    // Recargar la página después de actualizar el estado
                    location.reload();
                });
            } else if (response.hasOwnProperty('error')) {
                // Mostrar alerta de error
                mostrarAlerta('Error al actualizar el estado de la PC: ' + response.error);
            } else {
                // Mostrar alerta de respuesta desconocida
                mostrarAlerta('Respuesta desconocida al actualizar el estado de la PC.');
            }
        },
        error: function(xhr, _status, _error) {
            // Mostrar alerta de error de AJAX
            console.error('Error al actualizar el estado: ', xhr.responseText);
            mostrarAlerta('Error al actualizar el estado de la PC.');
        }
    });
}

function mostrarAlerta(mensaje, callback) {
    var alerta = $('<div>', {
        class: 'alert'
    }).append(
        $('<h2>', { text: 'Mensaje de actualización' }),
        $('<p>', { text: mensaje }),
        $('<button>', { text: 'Aceptar', style: 'margin-left: 10px; background-color: green;' }).on('click', function() {
            if(callback) callback();
            $(this).parent('.alert').remove();
        }),
        $('<button>', { text: 'Cancelar', style: 'margin-left: 10px; background-color: red;' }).on('click', function() {
            $(this).parent('.alert').remove();
        })
    );

    $('body').append(alerta);
}

$(document).ready(function() {
    $('.item').on('mouseover', function(event) {
        var itemData = $(this).data(); 
        mostrarInformacion(itemData, event);
    }).on('mouseout', function() {
        $('#info').hide();
    });
});


function mostrarInformacion(item, left, top, width) {
    var info = $('#info');
    if (!info.length) {
        $('body').append('<div id="info" class="info"></div>');
        info = $('#info');
    }

    info.empty();
    info.append('<p>ID: ' + item.ID + '</p>');
    info.append('<p>NombrePc: ' + item.NombrePc + '</p>');
    info.append('<p>Modelo: ' + item.Modelo + '</p>');
    info.append('<p>N.Serie: ' + item['N.Serie'] + '</p>');
    info.append('<p>Teclado: ' + item.Teclado + '</p>');
    info.append('<p>Mouse: ' + item.Mouse + '</p>');
    info.append('<p>Mesa: ' + item.mesa + '</p>');


    // Aplica solo los estilos dinámicos con JavaScript
    info.css({
        'left': left + 'px',
        'top': top + 'px',
        'width': width + 'px',
        'display': 'block' 
    });
}


function crearCuadroConImagen(item, _index) {
    var mesaId = item.mesa; // ID o nombre de la mesa

    if (mesaId) { // Si la PC tiene una mesa asignada
        var mesaDiv = $('#mesa-' + mesaId.replace(/\s+/g, "-")); // Asegurarse de que el ID sea válido
        if (mesaDiv.length === 0) {
            // Si no existe la mesa, crearla
            mesaDiv = $('<div>', {
                id: 'mesa-' + mesaId.replace(/\s+/g, "-"),
                class: 'mesa'
            }).append($('<div>', {class: 'mesa-title', text: mesaId}));
            $('#mesas-container').append(mesaDiv);
        }
        contenedorDestino = mesaDiv;
    } else {
        // Si la PC no tiene mesa asignada, usar el contenedor principal
        contenedorDestino = $('#container');
    }

    var estadoClase = item.estado === 'disponible' ? '1' : item.estado === 'nodisponible' ? '2' : '3';
    var imagenSrc = 'img/PC' + estadoClase + '.png';
    var imagen = $('<img>', {
        src: imagenSrc,
        class: 'pc-img',
        css: { cursor: 'pointer' },
        data: { item: item }
    }).on('mouseover', function() {
        var item = $(this).data('item');
        var offset = $(this).offset();
        mostrarInformacion(item, offset.left, offset.top + $(this).outerHeight());
    }).on('mouseout', function() {
        $('#info').hide();
    });

    // Verificar si hay una posición guardada 
    var pos = localStorage.getItem('pcPos-' + item.ID);
    if (pos) {
        var posObj = JSON.parse(pos);
        imagen.css('transform', 'translate(' + posObj.x + 'px, ' + posObj.y + 'px)');
        imagen.attr('data-x', posObj.x);
        imagen.attr('data-y', posObj.y);
    }

    if (mesaDiv) {
        mesaDiv.append(imagen);
    } else {
        $('#container').append(imagen);
    }
}