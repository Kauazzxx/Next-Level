-- Criação do banco de dados
CREATE DATABASE IF NOT EXISTS next_level
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

-- Usa o banco de dados
USE next_level;

-- Criação da tabela de contatos
CREATE TABLE IF NOT EXISTS contatos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    assunto VARCHAR(100) NOT NULL,
    mensagem TEXT NOT NULL,
    data_envio DATETIME NOT NULL,
    status ENUM('novo', 'lido', 'respondido') DEFAULT 'novo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_status (status),
    INDEX idx_data_envio (data_envio)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Inserir alguns dados de exemplo (opcional)
INSERT INTO contatos (nome, email, assunto, mensagem, data_envio, status) VALUES
('João Silva', 'joao@exemplo.com', 'Dúvida sobre jogos', 'Olá, gostaria de saber mais sobre os jogos disponíveis.', NOW(), 'novo'),
('Maria Santos', 'maria@exemplo.com', 'Sugestão', 'Tenho uma sugestão para melhorar o site.', NOW(), 'novo'); 