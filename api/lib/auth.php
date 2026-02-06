<?php
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/response.php';
require_once __DIR__ . '/../config.php';

function auth_user() {
  $token = bearer_token();
  if (!$token) return null;
  $stmt = db()->prepare("SELECT s.user_id, u.email, u.name, u.initials
                         FROM sessions s
                         JOIN users u ON u.id = s.user_id
                         WHERE s.token = :token AND s.expires_at > NOW()");
  $stmt->execute([':token' => $token]);
  return $stmt->fetch() ?: null;
}

function require_auth() {
  $user = auth_user();
  if (!$user) json_response(['error' => 'unauthorized'], 401);
  return $user;
}

function bearer_token() {
  $headers = function_exists('getallheaders') ? getallheaders() : [];
  $auth = $headers['Authorization'] ?? $headers['authorization'] ?? '';
  if (preg_match('/Bearer\\s+(\\S+)/', $auth, $m)) return $m[1];
  return null;
}

function create_session($user_id) {
  $token = bin2hex(random_bytes(32));
  $expires = (new DateTime())->modify('+' . SESSION_TTL_HOURS . ' hours')->format('Y-m-d H:i:s');
  $stmt = db()->prepare("INSERT INTO sessions (user_id, token, expires_at) VALUES (:uid, :token, :exp)");
  $stmt->execute([':uid' => $user_id, ':token' => $token, ':exp' => $expires]);
  return $token;
}

function destroy_session() {
  $token = bearer_token();
  if (!$token) return;
  $stmt = db()->prepare("DELETE FROM sessions WHERE token = :token");
  $stmt->execute([':token' => $token]);
}

function get_or_create_guest_user() {
  $email = 'guest@join.local';
  $stmt = db()->prepare("SELECT id FROM users WHERE email = :email");
  $stmt->execute([':email' => $email]);
  $row = $stmt->fetch();
  if ($row) return $row['id'];
  $hash = password_hash(bin2hex(random_bytes(8)), PASSWORD_DEFAULT);
  $stmt = db()->prepare("INSERT INTO users (email, password_hash, name, initials) VALUES (:email, :hash, :name, :init)");
  $stmt->execute([
    ':email' => $email,
    ':hash' => $hash,
    ':name' => 'Guest User',
    ':init' => 'GU'
  ]);
  return db()->lastInsertId();
}
