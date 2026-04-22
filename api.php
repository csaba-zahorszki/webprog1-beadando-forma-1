<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");

// A TANÁR ÁLTAL KÉRT PDO CSATLAKOZÁS (Írd át a saját adataidra!)
try {
    $dbh = new PDO('mysql:host=localhost;dbname=IDE_AZ_ADATBÁZIS_NEVE', 
                   'IDE_A_FELHASZNÁLÓNÉV', 
                   'IDE_A_JELSZÓ', 
                   array(PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION));
} catch (PDOException $e) {
    die(json_encode(["error" => $e->getMessage()]));
}

$method = $_SERVER['REQUEST_METHOD'];
$table = $_GET['table']; // 'pilotak' vagy 'nagydijak'

// 1. LISTÁZÁS (READ)
if ($method === 'GET') {
    $stmt = $dbh->query("SELECT * FROM $table");
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
}

// 2. HOZZÁADÁS (CREATE)
if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    if ($table === 'pilotak') {
        $stmt = $dbh->prepare("INSERT INTO pilotak (nev, nemzet) VALUES (?, ?)");
        $stmt->execute([$input['nev'], $input['nemzet']]);
    } else {
        $stmt = $dbh->prepare("INSERT INTO nagydijak (datum, nev, helyszin) VALUES (?, ?, ?)");
        $stmt->execute([$input['datum'], $input['nev'], $input['helyszin']]);
    }
    echo json_encode(["status" => "success"]);
}

// 3. MÓDOSÍTÁS (UPDATE)
if ($method === 'PUT') {
    $id = $_GET['id'];
    $input = json_decode(file_get_contents('php://input'), true);
    if ($table === 'pilotak') {
        $stmt = $dbh->prepare("UPDATE pilotak SET nev=?, nemzet=? WHERE id=?");
        $stmt->execute([$input['nev'], $input['nemzet'], $id]);
    } else {
        $stmt = $dbh->prepare("UPDATE nagydijak SET datum=?, nev=?, helyszin=? WHERE id=?");
        $stmt->execute([$input['datum'], $input['nev'], $input['helyszin'], $id]);
    }
    echo json_encode(["status" => "updated"]);
}

// 4. TÖRLÉS (DELETE)
if ($method === 'DELETE') {
    $id = $_GET['id'];
    $stmt = $dbh->prepare("DELETE FROM $table WHERE id=?");
    $stmt->execute([$id]);
    echo json_encode(["status" => "deleted"]);
}
?>