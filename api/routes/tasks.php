<?php
require_once __DIR__ . '/../lib/db.php';
require_once __DIR__ . '/../lib/auth.php';
require_once __DIR__ . '/../lib/response.php';

function tasks_list() {
  require_auth();
  $pdo = db();
  $tasks = $pdo->query("SELECT * FROM tasks ORDER BY created_at DESC")->fetchAll();
  $taskIds = array_column($tasks, 'id');
  $assignments = [];
  $subtasks = [];

  if ($taskIds) {
    $in = implode(',', array_fill(0, count($taskIds), '?'));
    $stmt = $pdo->prepare("SELECT task_id, contact_id FROM task_assignments WHERE task_id IN ($in)");
    $stmt->execute($taskIds);
    foreach ($stmt->fetchAll() as $row) {
      $assignments[$row['task_id']][] = $row['contact_id'];
    }

    $stmt = $pdo->prepare("SELECT task_id, title, is_done FROM subtasks WHERE task_id IN ($in)");
    $stmt->execute($taskIds);
    foreach ($stmt->fetchAll() as $row) {
      $subtasks[$row['task_id']][] = [
        'task' => $row['title'],
        'checked' => $row['is_done'] ? 'true' : 'false'
      ];
    }
  }

  $out = [];
  foreach ($tasks as $t) {
    $out[] = [
      'id' => $t['id'],
      'title' => $t['title'],
      'description' => $t['description'],
      'category' => $t['category'],
      'dueDate' => $t['due_date'],
      'priority' => $t['priority'],
      'status' => $t['status'],
      'createdAt' => strtotime($t['created_at']) * 1000,
      'assignedTo' => $assignments[$t['id']] ?? [],
      'subtasks' => $subtasks[$t['id']] ?? []
    ];
  }
  json_response(['tasks' => $out]);
}

function tasks_create() {
  require_auth();
  $data = read_json();
  $title = trim($data['title'] ?? '');
  $category = $data['category'] ?? '';
  if (!$title || !$category) json_response(['error' => 'missing_fields'], 400);
  $pdo = db();
  $pdo->beginTransaction();
  try {
    $stmt = $pdo->prepare("INSERT INTO tasks (title, description, category, due_date, priority, status) VALUES (:t, :d, :c, :due, :p, :s)");
    $stmt->execute([
      ':t' => $title,
      ':d' => $data['description'] ?? '',
      ':c' => $category,
      ':due' => $data['dueDate'] ?? null,
      ':p' => $data['priority'] ?? 'medium',
      ':s' => $data['status'] ?? 'to-do'
    ]);
    $taskId = $pdo->lastInsertId();
    sync_assignments($pdo, $taskId, $data['assignedTo'] ?? []);
    sync_subtasks($pdo, $taskId, $data['subtasks'] ?? []);
    $pdo->commit();
  } catch (Exception $e) {
    $pdo->rollBack();
    json_response(['error' => 'create_failed'], 500);
  }
  json_response(['id' => $taskId], 201);
}

function tasks_update($id) {
  require_auth();
  $data = read_json();
  $title = trim($data['title'] ?? '');
  $category = $data['category'] ?? '';
  if (!$title || !$category) json_response(['error' => 'missing_fields'], 400);
  $pdo = db();
  $pdo->beginTransaction();
  try {
    $stmt = $pdo->prepare("UPDATE tasks SET title=:t, description=:d, category=:c, due_date=:due, priority=:p, status=:s WHERE id=:id");
    $stmt->execute([
      ':t' => $title,
      ':d' => $data['description'] ?? '',
      ':c' => $category,
      ':due' => $data['dueDate'] ?? null,
      ':p' => $data['priority'] ?? 'medium',
      ':s' => $data['status'] ?? 'to-do',
      ':id' => $id
    ]);
    sync_assignments($pdo, $id, $data['assignedTo'] ?? []);
    sync_subtasks($pdo, $id, $data['subtasks'] ?? []);
    $pdo->commit();
  } catch (Exception $e) {
    $pdo->rollBack();
    json_response(['error' => 'update_failed'], 500);
  }
  json_response(['ok' => true]);
}

function tasks_delete($id) {
  require_auth();
  $stmt = db()->prepare("DELETE FROM tasks WHERE id = :id");
  $stmt->execute([':id' => $id]);
  json_response(['ok' => true]);
}

function sync_assignments($pdo, $taskId, $assignedTo) {
  $pdo->prepare("DELETE FROM task_assignments WHERE task_id = :id")->execute([':id' => $taskId]);
  $stmt = $pdo->prepare("INSERT INTO task_assignments (task_id, contact_id) VALUES (:task, :contact)");
  foreach ($assignedTo as $cid) {
    $stmt->execute([':task' => $taskId, ':contact' => $cid]);
  }
}

function sync_subtasks($pdo, $taskId, $subtasks) {
  $pdo->prepare("DELETE FROM subtasks WHERE task_id = :id")->execute([':id' => $taskId]);
  $stmt = $pdo->prepare("INSERT INTO subtasks (task_id, title, is_done) VALUES (:task, :title, :done)");
  foreach ($subtasks as $st) {
    $done = ($st['checked'] ?? false) === true || ($st['checked'] ?? '') === 'true';
    $stmt->execute([':task' => $taskId, ':title' => $st['task'] ?? '', ':done' => $done ? 1 : 0]);
  }
}
