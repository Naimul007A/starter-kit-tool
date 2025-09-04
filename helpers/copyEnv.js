import fs from 'fs';
import path from 'path';
import { execSync } from "child_process"

async function checkEnv(targetPath = process.cwd()) {
    const filePath = path.join(targetPath, '.env.example');
    try {
        fs.accessSync(filePath, fs.constants.F_OK);
        return true;
    } catch (err) {
        return false;
    }
}

async function copyEnv(targetPath = process.cwd()) {
    const check = await checkEnv(targetPath);
    if (check) {
        const envExamplePath = path.join(targetPath, '.env.example');
        const envPath = path.join(targetPath, '.env');
        execSync(`cp "${envExamplePath}" "${envPath}"`, (error, stdout, stderr) => {
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
