-- Demo seed (OVERWRITES existing data in contacts/tasks/subtasks/assignments)
USE `join_app`;

SET FOREIGN_KEY_CHECKS = 0;
DELETE FROM `task_assignments`;
DELETE FROM `subtasks`;
DELETE FROM `tasks`;
DELETE FROM `contacts`;
ALTER TABLE `task_assignments` AUTO_INCREMENT = 1;
ALTER TABLE `subtasks` AUTO_INCREMENT = 1;
ALTER TABLE `tasks` AUTO_INCREMENT = 1;
ALTER TABLE `contacts` AUTO_INCREMENT = 1;
SET FOREIGN_KEY_CHECKS = 1;

INSERT INTO `contacts` (`id`, `name`, `email`, `phone`) VALUES
(1, 'Ava Muller', 'ava.mueller@archer-systems.example', '+49 30 1234 5678'),
(2, 'Noah Richter', 'noah.richter@archer-systems.example', '+49 30 2345 6789'),
(3, 'Lina Berg', 'lina.berg@archer-systems.example', '+49 30 3456 7890'),
(4, 'Jonas Keller', 'jonas.keller@archer-systems.example', '+49 30 4567 8901'),
(5, 'Sofia Weber', 'sofia.weber@archer-systems.example', '+49 30 5678 9012'),
(6, 'Elias Braun', 'elias.braun@archer-systems.example', '+49 30 6789 0123'),
(7, 'Mila Koenig', 'mila.koenig@archer-systems.example', '+49 30 7890 1234'),
(8, 'Leo Hartmann', 'leo.hartmann@archer-systems.example', '+49 30 8901 2345'),
(9, 'Hanna Wolf', 'hanna.wolf@archer-systems.example', '+49 30 9012 3456'),
(10, 'Paul Neumann', 'paul.neumann@archer-systems.example', '+49 30 0123 4567'),
(11, 'Lara Fischer', 'lara.fischer@archer-systems.example', '+49 30 1122 3344'),
(12, 'Tom Schneider', 'tom.schneider@archer-systems.example', '+49 30 2233 4455');

INSERT INTO `tasks` (`id`, `title`, `description`, `category`, `due_date`, `priority`, `status`) VALUES
(1, 'Onboard new sales team', 'Create onboarding checklist and access package for Q1 hires.', 'User Story', '2026-02-12', 'urgent', 'to-do'),
(2, 'Q1 analytics dashboard', 'Build management dashboard with KPIs and export feature.', 'Technical Task', '2026-02-18', 'medium', 'in-progress'),
(3, 'Customer feedback pipeline', 'Collect and tag feedback from email and chat channels.', 'Technical Task', '2026-02-22', 'low', 'await-feedback'),
(4, 'Prepare investor demo', 'Create story flow and visuals for Archer Systems pitch.', 'User Story', '2026-02-14', 'urgent', 'in-progress'),
(5, 'Security review', 'Review auth flows and update password policy.', 'Technical Task', '2026-02-20', 'medium', 'to-do'),
(6, 'Website content refresh', 'Rewrite homepage copy and update customer logos.', 'User Story', '2026-03-01', 'low', 'to-do'),
(7, 'Partner API integration', 'Sync project data with external partner CRM.', 'Technical Task', '2026-03-05', 'urgent', 'await-feedback'),
(8, 'Customer success playbook', 'Document onboarding, training, and renewal playbook.', 'User Story', '2026-02-26', 'medium', 'done');

INSERT INTO `task_assignments` (`task_id`, `contact_id`) VALUES
(1, 1), (1, 5),
(2, 3), (2, 6),
(3, 4),
(4, 1), (4, 7),
(5, 6), (5, 10),
(6, 2), (6, 5),
(7, 3), (7, 9),
(8, 7), (8, 8);

INSERT INTO `subtasks` (`task_id`, `title`, `is_done`) VALUES
(1, 'Prepare access credentials', 0),
(1, 'Welcome call schedule', 0),
(2, 'Define KPI set', 1),
(2, 'Connect data sources', 0),
(2, 'Add export button', 0),
(3, 'Define tags', 1),
(3, 'Route chat feedback', 0),
(4, 'Narrative outline', 1),
(4, 'Slide mockups', 0),
(4, 'Demo data polish', 0),
(5, 'Threat model', 0),
(5, 'Policy update', 0),
(6, 'New copy draft', 0),
(6, 'Logo approvals', 0),
(7, 'Auth handshake', 1),
(7, 'Data mapping', 1),
(7, 'Error handling', 0),
(8, 'Draft outline', 1),
(8, 'Review with team', 1);
