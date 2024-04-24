<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && empty($_POST)) {
    $data = json_decode(file_get_contents("php://input"), true);
    
    if (isset($data['pc_ID'], $data['Estado'])) {
        $mysqli = new mysqli("localhost", "root", "", "bdevento");
        
        if ($mysqli->connect_errno) {
            http_response_code(500);
            echo json_encode(["error" => "Fallo al conectar a MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error]);
            exit();
        }

        $query = "INSERT INTO estado (pc_ID, Estado) VALUES (?, ?)";
        $stmt = $mysqli->prepare($query);

        $stmt->bind_param("is", $data['pc_ID'], $data['Estado']);
        $success = $stmt->execute();

        if ($success) {
            http_response_code(201);
            echo json_encode(["message" => "Estado creado con éxito"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Error al crear el estado"]);
        }

        $stmt->close();
        $mysqli->close();
    } else {
        http_response_code(400);
        echo json_encode(["error" => "Datos incompletos para la creación del estado"]);
    }
} else {
    http_response_code(405);
    echo json_encode(["error" => "Método no permitido"]);
}
?>