import fs from 'fs';
import { execSync } from "child_process"
async function checkEnv() {
    const filePath = '.env.example';
    try {
        fs.accessSync(filePath, fs.constants.F_OK);
        return true;
    } catch (err) {
        return false;
    }

}

async function copyEnv() {
    const check = checkEnv();
    if (check) {
        execSync('cp .env.example .env', (error, stdout, stderr) => {
            if (error) {
                return;
            }
        })
        console.log(`Env File copy successfully.`);
    } else {
        return;
    }
}
export default copyEnv
