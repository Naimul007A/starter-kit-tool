import { spawn } from "child_process"
import copyEnv from "../helpers/copyEnv.js";
async function message() {
    spawn('git', ['init']);
    console.log('This project has been thoroughly startered. Enjoy!'.green);
    console.log("Thank You so much for using our package.".red.bold)
}
export default message