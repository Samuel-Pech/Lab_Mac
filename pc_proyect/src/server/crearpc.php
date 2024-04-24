<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

$mysqli = new mysqli("localhost", "root", "", "bdevento");
if ($mysqli->connect_errno) {
    echo "Fallo al conectar a MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;
    exit();
}

// Obtener datos de la solicitud POST
$data = json_decode(file_get_contents("php://input"), true);
if (!$data) {
    echo json_encode(["error" => "No data provided"]);
    exit();
}

// Log para depuración
error_log("Recibiendo la siguiente data: " . print_r($data, true));

// Validar y sanitizar los datos recibidos (implementa una validación más robusta según sea necesario)
$nombrePc = isset($data['NombrePc']) ? trim($data['NombrePc']) : '';
$modelo = isset($data['Modelo']) ? trim($data['Modelo']) : '';
$nSerie = isset($data['NSerie']) ? trim($data['NSerie']) : '';
$teclado = isset($data['Teclado']) ? $data['Teclado'] : '';
$mouse = isset($data['Mouse']) ? $data['Mouse'] : '';
$estado = isset($data['Estado']) ? $data['Estado'] : '';

if ($nombrePc === '' || $modelo === '' || $nSerie === '' || $teclado === '' || $mouse === '' || $estado === '') {
    echo json_encode(["error" => "Incomplete data"]);
    exit();
}

// Crear la nueva PC
$query = "INSERT INTO pc (NombrePc, Modelo, `N.Serie`, Teclado, Mouse) VALUES (?, ?, ?, ?, ?)";
$stmt = $mysqli->prepare($query);
if (!$stmt) {
    echo "Error preparando la consulta: " . $mysqli->error;
    exit();
}
$stmt->bind_param("sssss", $nombrePc, $modelo, $nSerie, $teclado, $mouse);
$stmt->execute();
$newPcId = $stmt->insert_id; // Obtener el ID de la nueva PC creada
$stmt->close();

// Crear el estado para la nueva PC
$queryEstado = "INSERT INTO estado (pc_id, Estado) VALUES (?, ?)";
$stmtEstado = $mysqli->prepare($queryEstado);
$stmtEstado->bind_param("is", $newPcId, $estado);
$stmtEstado->execute();
$stmtEstado->close();

$mysqli->close();

echo json_encode(["message" => "Nueva PC y estado creados con éxito", "newPcId" => $newPcId]);
?>
