<?php
header("Access-Control-Allow-Origin: *");

$mysqli = new mysqli("localhost", "root", "", "bdevento");
if ($mysqli->connect_errno) {
    echo "Fallo al conectar a MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;
    exit();
}

// Consulta SQL que incluye un JOIN entre pc, estado y mesa1
$sql = "SELECT pc.ID, pc.NombrePc, pc.Modelo, pc.`N.Serie`, pc.Teclado, pc.Mouse, estado.estado, mesa1.mesa 
        FROM pc 
        LEFT JOIN estado ON pc.ID = estado.pc_id
        LEFT JOIN mesa1 ON pc.ID = mesa1.pc_id";
$result  = $mysqli->query($sql);

if ($result->num_rows > 0) {
    $rows = $result->fetch_all(MYSQLI_ASSOC);
    echo json_encode($rows);
} else {
    echo json_encode(["error" => "no hay datos"]);
}

$mysqli->close();
?>