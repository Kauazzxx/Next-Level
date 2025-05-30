<?php
require_once 'config.php';

/**
 * Função para validar e sanitizar dados do formulário
 */
function sanitizeInput($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

/**
 * Função para validar email
 */
function validarEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

/**
 * Função para salvar contato no banco de dados
 */
function salvarContato($nome, $email, $assunto, $mensagem) {
    global $pdo;
    
    try {
        $sql = "INSERT INTO contatos (nome, email, assunto, mensagem, data_envio) 
                VALUES (:nome, :email, :assunto, :mensagem, NOW())";
        
        $stmt = $pdo->prepare($sql);
        $result = $stmt->execute([
            ':nome' => sanitizeInput($nome),
            ':email' => sanitizeInput($email),
            ':assunto' => sanitizeInput($assunto),
            ':mensagem' => sanitizeInput($mensagem)
        ]);
        
        return $result;
    } catch(PDOException $e) {
        error_log("Erro ao salvar contato: " . $e->getMessage());
        return false;
    }
}

/**
 * Função para listar contatos
 */
function listarContatos() {
    global $pdo;
    
    try {
        $sql = "SELECT * FROM contatos ORDER BY data_envio DESC";
        $stmt = $pdo->query($sql);
        return $stmt->fetchAll();
    } catch(PDOException $e) {
        error_log("Erro ao listar contatos: " . $e->getMessage());
        return [];
    }
}
?> 