<?php

$host = "localhost";
$usuario = "root";
$senha = "";
$banco = "nextlevel_db";

$conn = new mysqli($host, $usuario, $senha, $banco);

if ($conn->connect_error) {
    die("Erro na conexão: " . $conn->connect_error);
}

$nome = $_POST['name'];
$email = $_POST['email'];
$assunto = $_POST['subject'];
$mensagem = $_POST['message'];

$stmt = $conn->prepare("INSERT INTO contatos (nome, email, assunto, mensagem) VALUES (?, ?, ?, ?)");
$stmt->bind_param("ssss", $nome, $email, $assunto, $mensagem);

if ($stmt->execute()) {
    echo "<script>alert('Mensagem enviada com sucesso!'); window.location.href='contato.html';</script>";
} else {
    echo "Erro ao enviar: " . $stmt->error;
}

$stmt->close();
$conn->close();
?>
