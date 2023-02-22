INSERT INTO department (name)
VALUES ("Sales"),
("Accounting"),
("Engineering"),
("Technical Support"),
("Human Resources"),
("Executive");

INSERT INTO role (title, salary, department_id, management)
VALUES ("Salesperson", 80000, 1, 0),
    ("Purchaser", 150000, 2, 0),
    ("Senior Software Engineer", 76000, 3, 0),
    ("Technical Support Specialist", 60000, 4, 0),
    ("Disciplinarian", 300000, 5, 0),
    ("Sales Manager", 125000, 1, 1),
    ("Accounting Supervisor", 200000, 2, 1),
    ("Chief Engineer", 80000, 3, 1),
    ("Technical Support Supervisor", 70000, 4, 1),
    ("Crackwhip", 500000, 5, 1),
    ("Lord Emperor", 3800000, 6, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Paul", "Atreides", 11, 1),
    ("Jean-Luc", "Picard", 10, 1),
    ("Han", "Solo", 5, 2),
    ("Gonzo", "The Incredible", 9, 1),
    ("Peter", "Parker", 8, 1),
    ("Malcolm", "Reynolds", 7, 1),
    ("Eddard", "Stark", 6, 1),
    ("Inigo", "Montoya", 7, 2),
    ("Ronald", "McDonald", 4, 7),
    ("Stephen", "Cardie", 5, 6)
