<?php
require_once 'functions.php';

header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Recebe os dados do formulário
    $nome = $_POST['name'] ?? '';
    $email = $_POST['email'] ?? '';
    $assunto = $_POST['subject'] ?? '';
    $mensagem = $_POST['message'] ?? '';
    
    // Validação dos dados
    $erros = [];
    
    if (empty($nome)) {
        $erros[] = "O nome é obrigatório";
    }
    
    if (empty($email)) {
        $erros[] = "O email é obrigatório";
    } elseif (!validarEmail($email)) {
        $erros[] = "Email inválido";
    }
    
    if (empty($assunto)) {
        $erros[] = "O assunto é obrigatório";
    }
    
    if (empty($mensagem)) {
        $erros[] = "A mensagem é obrigatória";
    }
    
    // Se houver erros, retorna eles
    if (!empty($erros)) {
        http_response_code(400);
        echo json_encode([
            'status' => 'error',
            'message' => 'Erros de validação',
            'errors' => $erros
        ]);
        exit;
    }
    
    // Tenta salvar o contato
    if (salvarContato($nome, $email, $assunto, $mensagem)) {
        echo json_encode([
            'status' => 'success',
            'message' => 'Mensagem enviada com sucesso!'
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            'status' => 'error',
            'message' => 'Erro ao salvar a mensagem. Por favor, tente novamente.'
        ]);
    }
} else {
    http_response_code(405);
    echo json_encode([
        'status' => 'error',
        'message' => 'Método não permitido'
    ]);
}
?> 