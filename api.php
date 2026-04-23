<?php
header("Content-Type: application/json; charset=utf-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");

// NETHELY ADATOK!
$host = 'localhost'; 
$dbname = 'beadando_anybody';
$user = 'beadando_anybody';
$pass = 'M1szt3rM1n1szt3r!';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);
} catch (PDOException $e) {
    die(json_encode(["error" => "Kapcsolódási hiba: " . $e->getMessage()]));
}

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        // Csak az utolsó 100-at kérjük le, hogy ne fagyjon le a böngésző a 2259 sortól!
        $stmt = $pdo->query("SELECT * FROM eredmenyek ORDER BY id DESC LIMIT 100");
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"), true);
        $sql = "INSERT INTO eredmenyek (datum, pilotaaz, helyezes, hiba, csapat, tipus, motor) VALUES (?, ?, ?, ?, ?, ?, ?)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$data['datum'], $data['pilotaaz'], $data['helyezes'], $data['hiba'], $data['csapat'], $data['tipus'], $data['motor']]);
        echo json_encode(["status" => "Mentve", "id" => $pdo->lastInsertId()]);
        break;

    case 'PUT':
        $id = explode('/', $_SERVER['PATH_INFO'] ?? '')[1] ?? null;
        if (!$id) {
             $data = json_decode(file_get_contents("php://input"), true);
             $id = $data['id'] ?? null;
        }
        $data = json_decode(file_get_contents("php://input"), true);
        $sql = "UPDATE eredmenyek SET datum=?, pilotaaz=?, helyezes=?, hiba=?, csapat=?, tipus=?, motor=? WHERE id=?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$data['datum'], $data['pilotaaz'], $data['helyezes'], $data['hiba'], $data['csapat'], $data['tipus'], $data['motor'], $id]);
        echo json_encode(["status" => "Frissítve"]);
        break;

    case 'DELETE':
        $path = explode('/', $_SERVER['PATH_INFO'] ?? '');
        $id = end($path);
        if ($id) {
            $stmt = $pdo->prepare("DELETE FROM eredmenyek WHERE id = ?");
            $stmt->execute([$id]);
            echo json_encode(["status" => "Törölve"]);
        }
        break;
}
?>