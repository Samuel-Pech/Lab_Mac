<?php
header("Access-Control-Allow-Origin: http://localhost:3000"); 
header("Access-Control-Allow-Methods: POST"); 
header("Access-Control-Allow-Headers: Content-Type"); 

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $pcId = isset($data['ID']) ? trim($data['ID']) : '';


    $mysqli = new mysqli("localhost", "root", "", "bdevento");
    if ($mysqli->connect_errno) {
        echo json_encode(["error" => "Fallo al conectar a la base de datos"]);
        exit();
    }

    $sql = "DELETE FROM pc WHERE ID = ?";
    $stmt = $mysqli->prepare($sql);
    if (!$stmt) {
        echo json_encode(["error" => "Error al preparar la consulta SQL"]);
        exit();
    }

    // Vincular el parámetro a la consulta preparada
    $stmt->bind_param("i", $pcId);

    // Ejecutar la consulta preparada
    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "PC eliminada correctamente"]);
    } else {
        echo json_encode(["error" => "Error al eliminar la PC"]);
    }

    // Cerrar la conexión y liberar los recursos
    $stmt->close();
    $mysqli->close();
} else {
    http_response_code(405); // Método no permitido
    echo json_encode(["error" => "Método no permitido"]);
}
?>
