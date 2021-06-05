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
                "Add Employees",
                "Remove Employees",
                "Update Employee Role",
                "Update Employee Manager"]
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

                case 'Add Employees':
                    addEmployee();
                    break;

                case 'Remove Employees':
                    removeEmployee();
                    break;

                case 'Update Employee Role':
                    updateRole();
                    break;

                case 'Update Employee Manager':
                    updateManager();
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


function removeEmployee() {
    viewAll()
    inquirer
        .prompt({
            name: "employeeID",
            type: "input",
            message: "Please enter the ID of the employee that you want to delete."
        })
        .then((answer) => {
            console.log("deleting employee");
            connection.query("DELETE FROM employee WHERE?",
                    {
                        firstName: answer.firstName,
                        lastName: answer.lastName,
                        manager_id: answer.managerId,
                        role_id: role_id,
                    },
                    
                function (err) {
                    if (err) throw err;
                    console.log("deleted")
                    viewAll();
                    runQuestion();

                })
        })
        .catch(console.error("err"))
};

const updateRole = () => {
    viewAll();
    inquirer
        .prompt([
            {
                name: "employeeID",
                type: "input",
                message: "Please enter the ID of the employee that you want to update."
            },
            {
                name: "title",
                type: "input",
                message: "What is the role title?",
            },
            {
                name: "salary",
                type: "input",
                message: "What is this roles salary?",
                validate: function (value) {
                    let valid = !isNaN(value);
                    return valid || "Please enter a number";
                }
            },
            {
                name: "department",
                type: "input",
                message: "which department does it belong to?",
            }
        ])
        .then((answer) => {
            console.log("Adding a new role")
            connection.query(
                `INSERT INTO roles SET ?`, //update
                {
                    title: answer.title,
                    salary: answer.salary
                },
                function (err, res) {
                    if (err) throw err;
                    console.log("Added")
                    viewAll()
                }
            )
        })
};

