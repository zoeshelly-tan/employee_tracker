use employee_trackerDB;

INSERT INTO department (name)
VALUES('Engineering'),('Finance'),('Legal'),('Sales');


INSERT INTO role(role,salary,department_id)
values('Lead Software Engineer', 240000,1),
('software Engineer'.190000,1),
('Accountant',170000,2),
('Lead Accountant',250000,2),
('Lead Lawyer',260000,3),
('Lawyer',210000,3),
('Lead Salesperson',210000,4),
('Salesperson',20000,4);


INSERT INTO employee(first_name, last_name, manager_id, role_id, id)
VALUES('Ben','Daniel',1,null,1),
('Geo','Wagner',1,0,2),
('Ash','Ley',2,1,3),
('Gary','Won',2,null,4),
('Mary','Mei',3,1,5),
('Kol','Ben',3,null,6);
