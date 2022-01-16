const inquirer = require('inquirer');
const connection = require('./connection');
const uuid = require('./helpers/uuid');
console.log(`
WEelscome to EMPLOYEE TRACKER
________________________
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
            "View all rolls",
            "Add role",
            "View all departments",
            "Add deparment",
            "Exit"
        ]
    }, ])
    .then(answers => {
        if (answers.todo === "Exit") {
            return console.log('To exit type Ctrl + C')
        };
        if (answers.todo === "View all employees") {
            connection.query(
                'SELECT * FROM employee',
                function(err, results) {
                    console.log(results);
                }
            );
            questions();
        };
    });
questions();