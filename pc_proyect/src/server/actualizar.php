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

    $id = isset($data['ID']) ? intval($data['ID']) : null;
    $nombrePc = isset($data['NombrePc']) ? trim($data['NombrePc']) : '';
    $modelo = isset($data['Modelo']) ? trim($data['Modelo']) : '';
    $nSerie = isset($data['NSerie']) ? trim($data['NSerie']) : '';
    $teclado = isset($data['Teclado']) ? $data['Teclado'] : '';
    $mouse = isset($data['Mouse']) ? $data['Mouse'] : '';
    $estado = isset($data['Estado']) ? trim($data['Estado']) : '';

    if ($id === null) {
        http_response_code(400); 
        echo json_encode(["error" => "Se requiere un ID para actualizar"]);
        exit();
    }

    $mysqli = new mysqli("localhost", "root", "", "bdevento");
    if ($mysqli->connect_errno) {
        echo json_encode(["error" => "Fallo al conectar a la base de datos"]);
        exit();
    }

    // Iniciar transacción
    $mysqli->begin_transaction();

    $updatePC = "UPDATE pc SET NombrePc = ?, Modelo = ?, `N.Serie` = ?, Teclado = ?, Mouse = ? WHERE ID = ?";
    $updateEstado = "UPDATE estado SET Estado = ? WHERE pc_id = ?";

    $stmt = $mysqli->prepare($updatePC);
    if (!$stmt) {
        echo json_encode(["error" => "Error al preparar la consulta SQL para actualizar PC"]);
        exit();
    }

    $stmt->bind_param("sssssi", $nombrePc, $modelo, $nSerie, $teclado, $mouse, $id);
    $executePC = $stmt->execute();
    $stmt->close();

    $stmt = $mysqli->prepare($updateEstado);
    if (!$stmt) {
        echo json_encode(["error" => "Error al preparar la consulta SQL para actualizar estado"]);
        exit();
    }

    $stmt->bind_param("si", $estado, $id);
    $executeEstado = $stmt->execute();
    $stmt->close();

    if ($executePC && $executeEstado) {
        $mysqli->commit();
        echo json_encode(["success" => true]);
    } else {
        $mysqli->rollback();
        echo json_encode(["error" => "Error al actualizar el registro de PC o estado"]);
    }

    $mysqli->close();
} else {
    http_response_code(405); 
    echo json_encode(["error" => "Método no permitido"]);
}
?>
