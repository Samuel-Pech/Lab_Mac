<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

$mysqli = new mysqli("localhost", "root", "", "bdevento");

// Verificar conexión
if ($mysqli->connect_error) {
    echo json_encode(['error' => "Fallo al conectar a MySQL: " . $mysqli->connect_error]);
    exit();
}

// Asegurarse de que los datos POST necesarios están presentes
if (isset($_POST['id']) && isset($_POST['estado'])) {
    $id = $mysqli->real_escape_string($_POST['id']);
    $estado = $mysqli->real_escape_string($_POST['estado']);

    // Actualizar el estado
    $sql = "UPDATE estado SET estado = '$estado' WHERE ID = $id";
    if ($mysqli->query($sql) === TRUE) {
        echo json_encode(['success' => "El estado se ha actualizado correctamente."]);
    } else {
        echo json_encode(['error' => "Error al actualizar el estado: " . $mysqli->error]);
    }
} else {
    echo json_encode(['error' => "Datos POST faltantes"]);
}

$mysqli->close();
?>