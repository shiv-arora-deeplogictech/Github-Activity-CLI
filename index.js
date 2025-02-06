#!/usr/bin/env node

import axios from "axios";
import chalk from "chalk";
import {Command} from "commander";
import ora from "ora";
import dotenv from "dotenv";

dotenv.config();

const BASE_URL = "https://api.github.com";

const fetchActivity = async (username) => {
    const spinner = ora(`Fetching the data for ${username}`).start();

    try{
        const response = await axios.get(`${BASE_URL}/users/${username}/events`,{
            headers:{
                Authorization :`token ${process.env.GITHUB_TOKEN}`,
                Accept : "application/vnd.github+json",
            },
        });

        spinner.stop(); 

        if(response.length===0){
            console.log(chalk.yellow("No recent activity Found !"));
            return;
        }
        console.log(chalk.green.bold(`Recent activity for ${username}`));
        response.data.slice(0,5).forEach((event,index) => {
            console.log(
                chalk.blue(`${index+1}. ${event.type} -> ${event.repo.name}`)
            );
        });
    } catch (error){
        spinner.stop();
        console.error(chalk.red("Error Fetching Activity !!"),error.message);
    }
}

const program = new Command();

program
    .version("1.0.0")
    .description("Github Activity Tracker CLI")
    .argument("<username>","Github Username")
    .action((username) => {
        fetchActivity(username);
    });

program.parse(process.argv);

