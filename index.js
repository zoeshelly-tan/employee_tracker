const inquirer = require('inquirer');
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,

    user: 'root',

    password: 'root',
    database: 'employee_trackerDB',
});

connection.connect((err) => {
    if (err) throw err;
    runQuestion();
});

const runQuestion = () =>
    inquirer
        .prompt({
            type: 'list',
            message: 'What would you like to do?',
            name: 'action',
            choices: [
                "View All Employees",
                "View All Employees by Department",
                "View All Roles",
                "Add Employees",
                "Add Department",
                "Add Role",
                ]
        }
        )
        .then((answer) => {
            switch (answer.action) {
                case 'View All Employees':
                    viewAll();
                    break;

                case 'View All Employees by Department':
                    viewAllDepartment();
                    break;

                case 'View All Roles':
                    viewAllRole();
                    break;

                case 'Add Employees':
                    addEmployee();
                    break;

                case 'Add Department':
                    addDepartment();
                    break;

                    case 'Add Role':
                    addRole();
                    break;

              
            }

        })







function viewAll() {
    let query = "SELECT * FROM employee";
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log("employee list");
        console.table(res);
        runQuestion();
    });
}

function viewAllDepartment() {
    let query = "SELECT * FROM department";
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log("Department list")
        console.table(res);
        runQuestion();
    });
}

function viewAllRole() {
    let query = "SELECT * FROM roles";
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log("roles list")
        console.table(res);
        runQuestion();
    });
}

const addEmployee = () => {
    connection.query("SELECT * FROM roles", (err, res) => {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: "firstName",
                    type: "input",
                    message: "What is the employee's first name?",
                },
                {
                    name: "lastName",
                    type: "input",
                    message: "What is the employee's last name?",
                },
                {
                    name: "managerId",
                    type: "input",
                    message: "What is the employee's manager's ID?",
                },
                {
                    name: "roleId",
                    type: "list",
                    choices: function () {
                        var roleArray = [];
                        for (let i = 0; i < res.length; i++) {
                            roleArray.push(res[i].title);
                        }
                        return roleArray;
                    },
                    message: "What is this employee's role?",
                },
            ])
            .then(function (answer) {
                let role_id;
                for (let a = 0; a < res.length; a++) {
                    if (res[a].title == answer.roleId) {
                        role_id = res[a].id;
                        console.log(role_id);
                    }
                }
                console.log(answer)
                connection.query("INSERT INTO employee SET?",
                    {
                        firstName: answer.firstName,
                        lastName: answer.lastName,
                        manager_id: answer.managerId,
                        role_id: role_id,
                    },
                    function (err) {
                        if (err) throw err;
                        console.log("Your employee has been added!");
                        runQuestion();
                    }
                )
            });
    });

};

function addDepartment() {
    connection.query('SELECT deptname FROM department;', (err, res) => {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: "deptname",
                    type: "input",
                    message: "What is the New department name?",
                },
            ])
            .then(function (answer) {
                console.log(answer)
                connection.query("INSERT INTO department SET?",
                    {
                        deptname: answer.deptname,
                    },
                    function (err) {
                        if (err) throw err;
                        console.log("Your new department has been added!");
                        runQuestion();
                    }
                )
            });
    });
}

function addRole() {
    connection.query('SELECT * FROM roles;', (err, res) => {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: "title",
                    type: "input",
                    message: "What is the New title name?",
                },
                {
                    name: 'salary',
                    type: 'input',
                    message: 'What would you like the role salary to be?'
                  },
                  {
                      name: 'departmentId',
                    type: 'input',
                    message: 'Enter department id you want the role to belong to'
                  }
            ])
            .then(function (answer) {
                console.log(answer)
                connection.query("INSERT INTO roles SET?",
                    {
                        title: answer.title,
                        salary: answer.salary,
                        department_id: answer.departmentId
                    },
                    function (err) {
                        if (err) throw err;
                        console.log("Your new roles has been added!");
                        runQuestion();
                    }
                )
            });
    });
}




