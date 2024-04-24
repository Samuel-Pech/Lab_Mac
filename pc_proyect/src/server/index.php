<?php
header("Access-Control-Allow-Origin: *");

$mysqli = new mysqli("localhost", "root", "", "bdevento");
if ($mysqli->connect_errno) {
    echo "Fallo al conectar a MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;
    exit();
}

// Consulta SQL modificada para incluir el estado
$sql = "SELECT pc.ID, pc.NombrePc, pc.Modelo, pc.`N.Serie`, pc.Teclado, pc.Mouse, estado.Estado
        FROM pc
        LEFT JOIN estado ON pc.ID = estado.pc_id";
$result  = $mysqli->query($sql);

if ($result->num_rows > 0) {
    $rows = [];
    while ($row = $result->fetch_assoc()) {
        // Agregar cada fila al array con el formato deseado
        $rows[] = [
            "ID" => $row["ID"],
            "NombrePc" => $row["NombrePc"],
            "Modelo" => $row["Modelo"],
            "N.Serie" => $row["N.Serie"],
            "Teclado" => $row["Teclado"],
            "Mouse" => $row["Mouse"],
            "Estado" => $row["Estado"] ?? "N/A",
        ];
    }
    echo json_encode($rows);
} else {
    echo json_encode(["error" => "no hay datos"]);
}

$mysqli->close();
?>