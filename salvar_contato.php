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

$nome = $_POST['nome'] ?? '';
$email = $_POST['email'] ?? '';
$assunto = $_POST['assunto'] ?? '';
$mensagem = $_POST['mensagem'] ?? '';

if ($nome && $email && $mensagem && $assunto) {
    $stmt = $conn->prepare("INSERT INTO contatos (nome, email, assunto, mensagem) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssss", $nome, $email, $assunto, $mensagem);
    if ($stmt->execute()) {
        echo json_encode(['sucesso' => true]);
    } else {
        echo json_encode(['sucesso' => false, 'erro' => 'Erro ao salvar no banco']);
    }
    $stmt->close();
} else {
    echo json_encode(['sucesso' => false, 'erro' => 'Dados incompletos']);
}

$conn->close(); 