<?php
header("Content-Type: application/json; charset=utf-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");

// NETHELY ADATOK!
$host = 'localhost'; 
$dbname = 'beadando_anybody';
$user = 'beadando_anybody';
$pass = 'A nyilvános Repo miatt a jelszó a dokumentáció 3. oldalán található! A weboldalon a jelszavas api.php van feltöltve.';

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
        $limit = 100;
        $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
        if ($page < 1) $page = 1;
        $offset = ($page - 1) * $limit; 

        // ÚJ: Rendezési paraméterek beolvasása (biztonsági ellenőrzéssel!)
        $allowedCols = ['datum', 'pilota_neve', 'helyezes', 'hiba', 'csapat', 'tipus', 'motor', 'id'];
        $sort = isset($_GET['sort']) && in_array($_GET['sort'], $allowedCols) ? $_GET['sort'] : 'id';
        $dir = isset($_GET['dir']) && strtoupper($_GET['dir']) === 'ASC' ? 'ASC' : 'DESC';

        $totalCount = $pdo->query("SELECT COUNT(*) FROM eredmenyek")->fetchColumn();

        // ÚJ: A lekérdezés most már az ORDER BY $sort $dir alapján rendez!
        $sql = "SELECT e.*, p.nev AS pilota_neve 
                FROM eredmenyek e 
                LEFT JOIN pilotak p ON e.pilotaaz = p.id 
                ORDER BY $sort $dir 
                LIMIT :limit OFFSET :offset";
        
        $stmt = $pdo->prepare($sql);
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();
        
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode([
            "total" => (int)$totalCount,
            "page" => $page,
            "limit" => $limit,
            "data" => $data
        ]);
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