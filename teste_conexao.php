<?php
require_once 'config.php';

if(isset($pdo)) {
    echo "Conexão com o banco de dados estabelecida com sucesso!";
    
    // Testa se o banco de dados existe
    try {
        $result = $pdo->query("SHOW DATABASES LIKE 'next_level'");
        if($result->rowCount() > 0) {
            echo "\nBanco de dados 'next_level' existe!";
            
            // Testa se a tabela existe
            $pdo->query("USE next_level");
            $result = $pdo->query("SHOW TABLES LIKE 'contatos'");
            if($result->rowCount() > 0) {
                echo "\nTabela 'contatos' existe!";
            } else {
                echo "\nTabela 'contatos' não existe!";
            }
        } else {
            echo "\nBanco de dados 'next_level' não existe!";
        }
    } catch(PDOException $e) {
        echo "\nErro ao verificar estruturas: " . $e->getMessage();
    }
} else {
    echo "Erro na conexão com o banco de dados!";
}
?> 