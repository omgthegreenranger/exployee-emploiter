SELECT 
department.id AS "ID", 
department.name AS "Department", 
role.salary AS "Salary",
employee.role_id AS "Employee"
FROM department 
JOIN role
ON role.department_id = department.id
JOIN employee
ON employee.role_id = role.id
GROUP BY role.salary
;
