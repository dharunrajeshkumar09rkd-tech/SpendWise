INSERT INTO category (id, name, type) VALUES (1, 'Salary', 'INCOME') ON DUPLICATE KEY UPDATE name=name;
INSERT INTO category (id, name, type) VALUES (2, 'Freelance', 'INCOME') ON DUPLICATE KEY UPDATE name=name;
INSERT INTO category (id, name, type) VALUES (3, 'Groceries', 'EXPENSE') ON DUPLICATE KEY UPDATE name=name;
INSERT INTO category (id, name, type) VALUES (4, 'Rent', 'EXPENSE') ON DUPLICATE KEY UPDATE name=name;
INSERT INTO category (id, name, type) VALUES (5, 'Utilities', 'EXPENSE') ON DUPLICATE KEY UPDATE name=name;