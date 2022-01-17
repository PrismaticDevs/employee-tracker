const inquirer = require('inquirer');
const connection = require('./connection');
const uuid = require('./helpers/uuid');
console.log(`
 ____________________________________________________________________________________
|                Welcome to                                                                                                                               |                ________  _                   _                                                                                                        
|               |  ______|| |_________  __ __ | | ___   _    _  ___  ___                                                                               
|               |   _|    |  __   __  ||  '_ \| |/ _ \ | |  | |/ _ \/ _ \                                                                                
|               |  |_____ | |  |_|  | ||  |_||| | (_) || |__| |  __/  __/                                                                                
|               |________||_|       |_|| '___/|_|\___/  \__   |\___/\___/                                                                                
|                                      |_|             |_____/                                                                                            
|                                                                                                                                                          |
|
|                                                                 
|_____________________________________________________________________________________
Brought to you by PrismaticDevs 
`);
// Options to choose from 
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
            "Add department",
            "Exit"
        ]
    }, ])
    .then(answers => {
        // Functions in reponse to prompt
        if (answers.todo === "Exit") {
            return console.log('To exit type Ctrl + C')
        };
        // view all employees
        if (answers.todo === "View all employees") {
            try {
                connection.query('SELECT * FROM employee', (err, results) => {
                    console.log("All employees");
                    for (let i = 0; i < results.length; i++) {
                        console.log("_____________");
                        console.log('Id:', results[i].id);
                        console.log('First name:', results[i].first_name);
                        console.log('Last name:', results[i].last_name);
                        console.log("_____________");
                    }
                    questions();
                });
            } catch (error) {
                console.error('Failed to fetch Data');
            }
        }; // END View all employees
        // Add employee
        if (answers.todo === "Add employee") {
            inquirer.prompt([{
                    type: "input",
                    name: "first_name",
                    message: "First name?",
                }, ])
                .then(answers => {
                    let first_name = answers.first_name;
                    try {
                        connection.query(`INSERT INTO employee (id, first_name) VALUES ("${uuid()}","${first_name}");`, (err, results) => {
                            if (err) throw err;
                            questions();
                        });
                        console.log(`Inserted ${first_name}`);
                    } catch (error) {
                        console.error('Failed to fetch Data');
                    }
                });
        }

    });
// Initial evocation to run the prompts
questions();