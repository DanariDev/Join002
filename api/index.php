<?php
require_once __DIR__ . '/lib/response.php';
require_once __DIR__ . '/routes/auth.php';
require_once __DIR__ . '/routes/contacts.php';
require_once __DIR__ . '/routes/tasks.php';

$method = $_SERVER['REQUEST_METHOD'];
$path = $_SERVER['PATH_INFO'] ?? parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Allow /api/index.php/... or /api/...
$path = preg_replace('#^/api(/index\\.php)?#', '', $path);
$path = rtrim($path, '/');

// Fallback for hosts without PATH_INFO support
if ($path === '' && isset($_GET['path'])) {
  $path = '/' . ltrim($_GET['path'], '/');
}

if ($method === 'OPTIONS') {
  header('Access-Control-Allow-Origin: *');
  header('Access-Control-Allow-Headers: Content-Type, Authorization');
  header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
  exit;
}

switch (true) {
  case $method === 'POST' && $path === '/auth/login':
    auth_login();
    break;
  case $method === 'POST' && $path === '/auth/register':
    auth_register();
    break;
  case $method === 'POST' && $path === '/auth/guest':
    auth_guest();
    break;
  case $method === 'GET' && $path === '/auth/me':
    auth_me();
    break;
  case $method === 'POST' && $path === '/auth/logout':
    auth_logout();
    break;
  case $method === 'GET' && $path === '/ping':
    json_response(['ok' => true, 'time' => date('c')]);
    break;
  case $method === 'GET' && $path === '/health':
    try {
      $pdo = db();
      $row = $pdo->query("SELECT 1 AS ok")->fetch();
      json_response(['ok' => true, 'db' => $row ? true : false, 'time' => date('c')]);
    } catch (Exception $e) {
      json_response(['ok' => false, 'db' => false, 'error' => $e->getMessage()], 500);
    }
    break;
  case $method === 'GET' && $path === '/contacts':
    contacts_list();
    break;
  case $method === 'POST' && $path === '/contacts':
    contacts_create();
    break;
  case preg_match('#^/contacts/(\\d+)$#', $path, $m) && $method === 'PUT':
    contacts_update($m[1]);
    break;
  case preg_match('#^/contacts/(\\d+)$#', $path, $m) && $method === 'DELETE':
    contacts_delete($m[1]);
    break;
  case $method === 'GET' && $path === '/tasks':
    tasks_list();
    break;
  case $method === 'POST' && $path === '/tasks':
    tasks_create();
    break;
  case preg_match('#^/tasks/(\\d+)$#', $path, $m) && $method === 'PUT':
    tasks_update($m[1]);
    break;
  case preg_match('#^/tasks/(\\d+)$#', $path, $m) && $method === 'DELETE':
    tasks_delete($m[1]);
    break;
  default:
    json_response(['error' => 'not_found', 'path' => $path, 'method' => $method], 404);
}
