<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$host = 'localhost';
$user = 'root';
$pass = '';
$db = 'nextlevel';

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    echo json_encode(['sucesso' => false, 'erro' => 'Erro de conexão com o banco de dados']);
    exit;
}

$result = $conn->query("SELECT id, nome, email, assunto, mensagem, data_envio FROM contatos ORDER BY data_envio DESC");
$contatos = [];
while ($row = $result->fetch_assoc()) {
    $contatos[] = $row;
}

echo json_encode(['sucesso' => true, 'contatos' => $contatos]);

$conn->close(); 