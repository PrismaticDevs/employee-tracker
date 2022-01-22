const inquirer = require('inquirer');
const connection = require('./connection');
const uuid = require('./helpers/uuid');
console.log(`Welcome to Employee Tracker - Brought to you by PrismaticDevs`);
// Options to choose from 
console.log(`
 ____________________________________________________________________________________
|                Welcome to
|                ________  _                   _
|               |  ______|| |__________ __ __ | | ___   _    _  ___  ___
|               |   _|    |  __   __  ||  ‘_ \\| |/ _ \\ | |  | |/ _ \\/ _ \\
|               |  |_____ | |  |_|  | ||  |_||| | (_) || |__| |  __/  __/
|               |________||_|       |_|| ’___/|_|\\___/ \\__    |\\___/\\___/
|                                      |_|             |_____/
|               __________                     _
|              |___   ___|___    ___     ___  | | _    __    _____
|                  | |  |  __|  / _ '|  / __\\ | |/ /  / _ \\ |  ___|
|                  | |  | |    | (_) | | (___ |   /  (  __/ | |
|                  |_|  |_|     \\__,_|  \\___/ |_|\\_\\  \\___/ |_|
|_____________________________________________________________________________________
Brought to you by PrismaticDevs
`);
const questions = () => inquirer.prompt([{
        type: "list",
        name: "todo",
        message: "What would you like to do?",
        choices: [
            "View all employees",
            "Add employee",
            "Update employee role",
            "View all roles",
            "Add role",
            "View all departments",
            "Add department",
            "Exit"
        ]
    }, ])
    .then(answers => {
        // Functions in response to prompt
        if (answers.todo === "View all employees") {
            getEmployees();
        } else if (answers.todo === "Add employee") {
            addEmployee();
        } else if (answers.todo === "Update employee role") {
            updateRole();
        } else if (answers.todo === "Add role") {
            addRole();
        } else if (answers.todo === "View all roles") {
            getRoles();
        } else if (answers.todo === "View all departments") {
            getDepartments();
        } else if (answers.todo === "Add department") {
            addDepartment();
        } else if (answers.todo === "Exit") {
            connection.end();
        }
        // view all employees
        async function getEmployees() {
            // INNER JOIN role ON employee.role_id = role.id
            connection.query('SELECT employee.id, employee.first_name, employee.last_name, employee.manager_id, role.id AS "roleId", role.title FROM employee LEFT JOIN role ON employee.role_id = role.id', (err, results) => {
                console.log("Employees:");
                console.table(results);
                questions();
            });
        }; // END View all employees
        // Add employee
        function addEmployee() {
            let managers = [];
            connection.promise().query('SELECT id FROM employee;')
                .then(results => {
                    results[0].map(
                        (result) => {
                            managers.push(result.id);
                        }
                    )
                });
            inquirer.prompt([{
                        type: "input",
                        name: "first_name",
                        message: "First name?",
                    },
                    {
                        type: "input",
                        name: "last_name",
                        message: "Last name?",
                    },
                    {
                        type: 'list',
                        name: 'manager',
                        message: `Choose the employee's manager`,
                        choices: managers
                    }
                ])
                .then(answers => {
                    let first_name = answers.first_name;
                    let last_name = answers.last_name;
                    let manager_id = answers.manager;
                    let newId = uuid();
                    connection.promise().query(`INSERT INTO employee (id, first_name, last_name, manager_id) VALUES (?, ?, ?, ?);`, [newId, first_name, last_name, manager_id])
                        .then(results => {
                            getEmployees();
                            questions();
                        });
                    console.log(`Inserted ${first_name}`);
                });
        } // END Add employee
        // Update employee role
        function updateRole() {
            connection.promise().query('SELECT * FROM employee')
                .then(results => {
                    let updates = [];
                    results[0].map(
                        (result) => {
                            updates.push(result.id + ' ' + result.first_name);
                        }
                    );
                    // Selects the employee
                    inquirer.prompt([{
                            type: "list",
                            name: 'employee',
                            message: 'Choose the employee',
                            choices: updates
                        }])
                        .then(answers => {
                            // Targets the selected employee's ID
                            let id = answers.employee.substr(0, 4);
                            // Selects role titles from database
                            connection.promise().query('SELECT * FROM role')
                                .then(results => {
                                    let updates = [];
                                    results[0].map(
                                        (result) => {
                                            updates.push(result.id + ' ' + result.title);
                                        }
                                    );
                                    // Selects the new role
                                    inquirer.prompt([{
                                            type: 'list',
                                            name: 'role',
                                            message: 'Select the new role',
                                            choices: updates
                                        }])
                                        .then(answers => {
                                            // Updates the new role in the database using the selected roles id
                                            let role_id = answers.role.substr(0, 4);
                                            connection.promise().query('UPDATE employee SET role_id = ? WHERE id=?', [role_id, id]);
                                            getEmployees();
                                            questions();
                                        });
                                });
                        });
                });
        } // END Update employee role
        // Add roles
        function addRole() {
            let departments = [];
            connection.promise().query('SELECT id FROM department')
                .then(results => {
                    results[0].map(
                        (result) => {
                            departments.push(result.name);
                        }
                    );
                });
            inquirer.prompt([{
                        type: 'input',
                        name: 'title',
                        message: 'Enter the new role'
                    },
                    {
                        type: 'input',
                        name: 'salary',
                        message: `Enter the role's salary`
                    },
                    {
                        type: 'list',
                        name: 'department_id',
                        message: 'Which department is it part of?',
                        choices: departments
                    }
                ])
                .then(answers => {
                    let id = uuid();
                    let title = answers.title;
                    let salary = answers.salary;
                    let department_id = answers.department_id;
                    connection.promise().query(`INSERT INTO role (id, title, salary, department_id) VALUES (?, ?, ?, ?)`, [id, title, salary, department_id]);
                    questions();
                });
        } // END Add roles
        // View all roles
        function getRoles() {
            connection.promise().query('SELECT * FROM role')
                .then(results => {
                    console.table(results[0]);
                    questions();
                });
        } // END View all roles
        // View all departments
        function getDepartments() {
            connection.promise().query('SELECT * FROM department')
                .then(results => {
                    console.table(results[0])
                    questions();
                });
        } // END View all departments
        // Add department
        function addDepartment() {
            inquirer.prompt([{
                    type: 'input',
                    name: 'name',
                    message: 'Enter the new department'
                }, ])
                .then(answers => {
                    let id = uuid();
                    let name = answers.name;
                    connection.promise().query(`INSERT INTO department (id, name) VALUES (?, ?)`, [id, name]);
                    getDepartments();
                    questions();
                });
        } // END Add department

    });
// Initial evocation to run the prompts
questions();