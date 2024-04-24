<?php
header("Access-Control-Allow-Origin: *");

// Configuración de la conexión a la base de datos
$host = "localhost";
$dbname = "bdevento";
$username = "root";
$password = "";

try {
    // Crear conexión con PDO
    $conn = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    // Establece el modo de error de PDO a excepción
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Preparar y ejecutar la consulta
    $sql = "SELECT Mesa1.mesa, pc.* FROM Mesa1 JOIN pc ON Mesa1.pc_ID = pc.id";
    $stmt = $conn->prepare($sql);
    $stmt->execute();

    // Recoger los resultados
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Devolver los resultados en formato JSON
    echo json_encode($result);
} catch(PDOException $e) {
    // Manejo del error
    echo json_encode(["error" => "Error en la conexión: " . $e->getMessage()]);
}
?>
