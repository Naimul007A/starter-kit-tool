import { spawn, execSync } from "child_process"
import colors from 'colors';
import remove from "remove";
import kits from "../kits.js"
import isYarnInstalled from "../helpers/checkYarn.js";
import hasComposerJson from "../helpers/hasComposer.js";
import copyEnv from "../helpers/copyEnv.js";
import message from "../helpers/message.js";
async function clone(kit, targetPath = process.cwd()) {
    console.log('Fetching kit [%s] to [%s]...'.green, kit, targetPath);
    if (kit == null) {
        console.log('Kit not found.'.red);
        return;
    }
    const repo = kits[kit];
    let clone = null;
    let dependency = null;
    clone = spawn('git', ['clone', repo, targetPath]);
    // Clones the repo down.
    clone.stdout.on('end', async function success() {
        console.log('Kit cloned! Removing .git folder...'.green);
        // Removes the existing .git folder, which should give us a clean repo.
        remove.removeSync(targetPath + '/.git');
        console.log('.git folder removed! Working on bootstrapping the project...this could take a grip.'.green);
        console.log('node dependency installing....'.green);
        //install node dependency
        const isYarn = isYarnInstalled();
        if (isYarn) {
            console.log("package installing via Yarn".red)
            dependency = spawn("yarn", ["install"], { cwd: targetPath })
        } else {
            console.log("package installing via Npm".red)
            dependency = spawn("npm", ["install"], { cwd: targetPath })
        }
        dependency.stdout.on("end", async function complete() {
            console.log('all package installed.'.green);
            // Check which type of project
            const hasComposer = hasComposerJson(targetPath);
            if (hasComposer) {
                console.log('composer dependency installing....'.green);
                const composerInstall = spawn('composer', ["install"], { cwd: targetPath });
                composerInstall.stdout.on("end", async function complete() {
                    console.log('composer dependency installed'.green);
                    await copyEnv(targetPath)
                    console.log('key generating....'.green);
                    const generateKey = spawn("php", ["artisan", "key:generate"], { cwd: targetPath });
                    generateKey.stdout.on("end", async function complete() {
                        await message(targetPath);
                    })
                })
            } else {
                await copyEnv(targetPath);
                await message(targetPath);
            }
        })
    })
}
export default clone
