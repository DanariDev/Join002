<?php
require_once __DIR__ . '/../lib/db.php';
require_once __DIR__ . '/../lib/auth.php';
require_once __DIR__ . '/../lib/response.php';

function contacts_list() {
  require_auth();
  $stmt = db()->query("SELECT id, name, email, phone FROM contacts ORDER BY name ASC");
  $contacts = $stmt->fetchAll();
  json_response(['contacts' => $contacts]);
}

function contacts_create() {
  require_auth();
  $data = read_json();
  $name = trim($data['name'] ?? '');
  $email = trim($data['email'] ?? '');
  $phone = trim($data['phone'] ?? '');
  if (!$name) json_response(['error' => 'missing_name'], 400);
  $stmt = db()->prepare("INSERT INTO contacts (name, email, phone) VALUES (:name, :email, :phone)");
  $stmt->execute([':name' => $name, ':email' => $email, ':phone' => $phone]);
  json_response(['id' => db()->lastInsertId()], 201);
}

function contacts_update($id) {
  require_auth();
  $data = read_json();
  $name = trim($data['name'] ?? '');
  $email = trim($data['email'] ?? '');
  $phone = trim($data['phone'] ?? '');
  if (!$name) json_response(['error' => 'missing_name'], 400);
  $stmt = db()->prepare("UPDATE contacts SET name = :name, email = :email, phone = :phone WHERE id = :id");
  $stmt->execute([':name' => $name, ':email' => $email, ':phone' => $phone, ':id' => $id]);
  json_response(['ok' => true]);
}

function contacts_delete($id) {
  require_auth();
  $stmt = db()->prepare("DELETE FROM contacts WHERE id = :id");
  $stmt->execute([':id' => $id]);
  json_response(['ok' => true]);
}
