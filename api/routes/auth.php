<?php
require_once __DIR__ . '/../lib/db.php';
require_once __DIR__ . '/../lib/auth.php';
require_once __DIR__ . '/../lib/response.php';

function auth_login() {
  $data = read_json();
  $email = trim($data['email'] ?? '');
  $password = $data['password'] ?? '';
  if (!$email || !$password) json_response(['error' => 'missing_fields'], 400);

  $stmt = db()->prepare("SELECT id, password_hash, name, initials FROM users WHERE email = :email");
  $stmt->execute([':email' => $email]);
  $user = $stmt->fetch();
  if (!$user || !password_verify($password, $user['password_hash'])) {
    json_response(['error' => 'invalid_credentials'], 401);
  }

  $token = create_session($user['id']);
  json_response([
    'token' => $token,
    'user' => ['id' => $user['id'], 'email' => $email, 'name' => $user['name'], 'initials' => $user['initials']]
  ]);
}

function auth_register() {
  $data = read_json();
  $name = trim($data['name'] ?? '');
  $email = trim($data['email'] ?? '');
  $password = $data['password'] ?? '';
  if (!$name || !$email || !$password) json_response(['error' => 'missing_fields'], 400);

  $stmt = db()->prepare("SELECT id FROM users WHERE email = :email");
  $stmt->execute([':email' => $email]);
  if ($stmt->fetch()) json_response(['error' => 'email_exists'], 409);

  $hash = password_hash($password, PASSWORD_DEFAULT);
  $initials = get_initials($name);

  $pdo = db();
  $pdo->beginTransaction();
  try {
    $stmt = $pdo->prepare("INSERT INTO users (email, password_hash, name, initials) VALUES (:email, :hash, :name, :init)");
    $stmt->execute([':email' => $email, ':hash' => $hash, ':name' => $name, ':init' => $initials]);
    $user_id = $pdo->lastInsertId();

    $stmt = $pdo->prepare("INSERT INTO contacts (name, email) VALUES (:name, :email)");
    $stmt->execute([':name' => $name, ':email' => $email]);

    $pdo->commit();
  } catch (Exception $e) {
    $pdo->rollBack();
    json_response(['error' => 'register_failed'], 500);
  }

  $token = create_session($user_id);
  json_response([
    'token' => $token,
    'user' => ['id' => $user_id, 'email' => $email, 'name' => $name, 'initials' => $initials]
  ], 201);
}

function auth_guest() {
  $user_id = get_or_create_guest_user();
  $stmt = db()->prepare("SELECT email, name, initials FROM users WHERE id = :id");
  $stmt->execute([':id' => $user_id]);
  $user = $stmt->fetch();
  $token = create_session($user_id);
  json_response([
    'token' => $token,
    'user' => ['id' => $user_id, 'email' => $user['email'], 'name' => $user['name'], 'initials' => $user['initials']]
  ]);
}

function auth_me() {
  $user = require_auth();
  json_response(['user' => $user]);
}

function auth_logout() {
  destroy_session();
  json_response(['ok' => true]);
}

function get_initials($name) {
  $parts = preg_split('/\\s+/', trim($name));
  $chars = array_map(fn($p) => strtoupper(mb_substr($p, 0, 1)), $parts);
  return mb_substr(implode('', $chars), 0, 2);
}
