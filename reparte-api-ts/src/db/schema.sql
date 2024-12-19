CREATE DATABASE IF NOT EXISTS reparte;
USE reparte;

CREATE TABLE IF NOT EXISTS users
(
    id         INT AUTO_INCREMENT PRIMARY KEY,
    email      VARCHAR(255) NOT NULL UNIQUE,
    password   VARCHAR(255) NOT NULL,
    firstName  VARCHAR(100) NOT NULL,
    lastName   VARCHAR(100) NOT NULL,
    created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP    NULL
);

CREATE TABLE IF NOT EXISTS share_groups
(
    id           INT AUTO_INCREMENT PRIMARY KEY,
    name         VARCHAR(255)       NOT NULL,
    creator_user INT                NOT NULL,
    invite_code  VARCHAR(36) UNIQUE NOT NULL,
    created_at   TIMESTAMP          NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at   TIMESTAMP          NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at   TIMESTAMP          NULL,
    FOREIGN KEY (creator_user) REFERENCES users (id)
);

CREATE TABLE IF NOT EXISTS members
(
    id             INT AUTO_INCREMENT PRIMARY KEY,
    share_group_id INT          NOT NULL,
    name           VARCHAR(255) NOT NULL,
    user_id        INT          NULL,
    is_creator     BOOLEAN               DEFAULT FALSE,
    creator_user   INT          NULL,
    created_at     TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at     TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at     TIMESTAMP    NULL,
    FOREIGN KEY (share_group_id) REFERENCES share_groups (id),
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (creator_user) REFERENCES users (id)
);


CREATE TABLE IF NOT EXISTS expenses
(
    id             INT AUTO_INCREMENT PRIMARY KEY,
    share_group_id INT            NOT NULL,
    name           VARCHAR(60)    NOT NULL,
    amount         DECIMAL(10, 2) NOT NULL,
    type           VARCHAR(100)   NOT NULL,
    description    VARCHAR(255),
    paying_member  INT            NOT NULL,
    created_at     TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at     TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at     TIMESTAMP      NULL,
    FOREIGN KEY (share_group_id) REFERENCES share_groups (id),
    FOREIGN KEY (paying_member) REFERENCES members (id)
);


CREATE TABLE IF NOT EXISTS expense_splits
(
    expense_id INT            NOT NULL,
    member_id  INT            NOT NULL,
    amount     DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP      NULL,
    PRIMARY KEY (expense_id, member_id),
    FOREIGN KEY (expense_id) REFERENCES expenses (id),
    FOREIGN KEY (member_id) REFERENCES members (id)
);

CREATE TABLE IF NOT EXISTS refunds
(
    id             INT AUTO_INCREMENT PRIMARY KEY,
    share_group_id INT            NOT NULL,
    name           VARCHAR(60)    NOT NULL,
    amount         DECIMAL(10, 2) NOT NULL,
    type           VARCHAR(100)   NOT NULL,
    description    VARCHAR(255),
    paying_member  INT            NOT NULL,
    created_at     TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at     TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at     TIMESTAMP      NULL,
    FOREIGN KEY (share_group_id) REFERENCES share_groups (id),
    FOREIGN KEY (paying_member) REFERENCES members (id)
);


CREATE TABLE IF NOT EXISTS refund_splits
(
    refund_id INT            NOT NULL,
    member_id  INT            NOT NULL,
    amount     DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP      NULL,
    PRIMARY KEY (refund_id, member_id),
    FOREIGN KEY (refund_id) REFERENCES expenses (id),
    FOREIGN KEY (member_id) REFERENCES members (id)
);

CREATE TABLE IF NOT EXISTS balances
(
    member_id      INT            NOT NULL,
    share_group_id INT            NOT NULL,
    total_paid     DECIMAL(10, 2) NOT NULL DEFAULT 0,
    total_owed     DECIMAL(10, 2) NOT NULL DEFAULT 0,
    net_balance    DECIMAL(10, 2) NOT NULL DEFAULT 0,
    created_at     TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at     TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at     TIMESTAMP      NULL,
    PRIMARY KEY (member_id, share_group_id),
    FOREIGN KEY (member_id) REFERENCES members (id),
    FOREIGN KEY (share_group_id) REFERENCES share_groups (id)
);

CREATE TABLE IF NOT EXISTS oauth_clients
(
    id              INT AUTO_INCREMENT PRIMARY KEY,
    user_id         INT,
    name            VARCHAR(255) NOT NULL,
    secret          VARCHAR(100) NOT NULL,
    redirect        VARCHAR(255),
    password_client BOOLEAN               DEFAULT FALSE,
    revoked         BOOLEAN               DEFAULT FALSE,
    created_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at      TIMESTAMP    NULL,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS oauth_access_tokens
(
    id         VARCHAR(100) PRIMARY KEY,
    user_id    INT,
    client_id  INT       NOT NULL,
    scopes     JSON,
    revoked    BOOLEAN            DEFAULT FALSE,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (client_id) REFERENCES oauth_clients (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS oauth_refresh_tokens
(
    id              VARCHAR(100) PRIMARY KEY,
    access_token_id VARCHAR(100) NOT NULL,
    revoked         BOOLEAN               DEFAULT FALSE,
    expires_at      TIMESTAMP    NOT NULL,
    created_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at      TIMESTAMP    NULL,
    FOREIGN KEY (access_token_id) REFERENCES oauth_access_tokens (id) ON DELETE CASCADE
);