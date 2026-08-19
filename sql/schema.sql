-- ============================================================
-- Banco de dados de Cadastro (Pessoa Física / Pessoa Jurídica)
-- ============================================================

CREATE DATABASE IF NOT EXISTS cadastro_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE cadastro_db;

-- ============================================================
-- PESSOA FÍSICA
-- ============================================================
CREATE TABLE IF NOT EXISTS pessoa_fisica (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

  -- Dados pessoais
  nome            VARCHAR(150)      NOT NULL,
  cpf             VARCHAR(14)       NOT NULL UNIQUE,
  data_nascimento DATE              NULL,
  sexo            ENUM('feminino','masculino','outro','nao_informar') NULL,
  documento       VARCHAR(30)       NULL,
  telefone        VARCHAR(20)       NULL,
  email           VARCHAR(150)      NULL,

  -- Endereço
  cep             VARCHAR(9)        NULL,
  rua             VARCHAR(150)      NULL,
  numero          VARCHAR(10)       NULL,
  complemento     VARCHAR(100)      NULL,
  bairro          VARCHAR(100)      NULL,
  cidade          VARCHAR(100)      NULL,
  estado          CHAR(2)           NULL,

  -- Acesso ao sistema (opcional)
  senha_hash      VARCHAR(255)      NULL,

  criado_em       DATETIME DEFAULT CURRENT_TIMESTAMP,
  atualizado_em   DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  UNIQUE KEY uk_pf_email (email)
) ENGINE=InnoDB;

-- ============================================================
-- PESSOA JURÍDICA
-- ============================================================
CREATE TABLE IF NOT EXISTS pessoa_juridica (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

  -- Dados da empresa
  razao_social    VARCHAR(150)      NOT NULL,
  nome_fantasia   VARCHAR(150)      NULL,
  cnpj            VARCHAR(18)       NOT NULL UNIQUE,
  inscricao_estadual VARCHAR(30)    NULL,
  data_abertura   DATE              NULL,
  tipo_juridico   ENUM('MEI','LTDA','EIRELI','S/A','Outro') NULL,
  cnae            VARCHAR(20)       NULL,
  telefone        VARCHAR(20)       NULL,
  email           VARCHAR(150)      NULL,

  -- Endereço da empresa
  cep             VARCHAR(9)        NULL,
  rua             VARCHAR(150)      NULL,
  numero          VARCHAR(10)       NULL,
  complemento     VARCHAR(100)      NULL,
  bairro          VARCHAR(100)      NULL,
  cidade          VARCHAR(100)      NULL,
  estado          CHAR(2)           NULL,

  -- Responsável legal
  resp_nome       VARCHAR(150)      NULL,
  resp_cpf        VARCHAR(14)       NULL,
  resp_cargo      VARCHAR(100)      NULL,

  criado_em       DATETIME DEFAULT CURRENT_TIMESTAMP,
  atualizado_em   DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  UNIQUE KEY uk_pj_email (email)
) ENGINE=InnoDB;
