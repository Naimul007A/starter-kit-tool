import { spawn } from "child_process"
async function message(path) {
    spawn('git', ['init']);
    console.log('This project has been thoroughly startered. Enjoy!'.green);
    console.log("Thank You so much for using our package.".red.bold)
    if (path) {
        console.log(`cd ${path}`.green);
    }
}
export default message
