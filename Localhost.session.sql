SELECT 
t1.id AS "Employee ID", 
CONCAT(t1.first_name, " ", t1.last_name) AS "Employee Name", 
role.title AS "Position", 
role.salary AS "Salary", 
department.name AS "Department", 
CONCAT(t2.first_name, " ", t2.last_name) AS "Manager"
FROM  employee AS t1 
LEFT JOIN employee AS t2 
ON t1.manager_id = t2.id 
JOIN role 
ON t1.role_id = role.id
JOIN department
ON role.department_id = department.id;