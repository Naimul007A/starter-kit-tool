import { spawn, execSync } from "child_process"
import colors from 'colors';
import remove from "remove";
import kits from "../kits.js"
import isYarnInstalled from "../helpers/checkYarn.js";
import hasComposerJson from "../helpers/hasComposer.js";
import copyEnv from "../helpers/copyEnv.js";
import message from "../helpers/message.js";
async function clone(kit) {
    console.log('Fetching kit [%s]...'.green, kit);
    if (kit == null) {
        console.log('Kit not found.'.red);
        return;
    }
    const repo = kits[kit];
    let clone = null;
    let dependency = null;
    clone = spawn('git', ['clone', repo, process.cwd()]);
    // Clones the repo down.
    clone.stdout.on('end', async function success() {
        console.log('Kit cloned! Removing .git folder...'.green);
        // Removes the existing .git folder, which should give us a clean repo.
        remove.removeSync(process.cwd() + '/.git');
        console.log('.git folder removed! Working on bootstrapping the project...this could take a grip.'.green);
        console.log('node dependency installing....'.green);
        //install node dependency
        const isYarn = isYarnInstalled();
        if (isYarn) {
            console.log("package installing via Yarn".red)
            dependency = spawn("yarn", ["install"])
        } else {
            console.log("package installing via Npm".red)
            dependency = spawn("npm", ["install"])
        }
        dependency.stdout.on("end", async function complete() {
            console.log('all package installed.'.green);
            // Check which type of project
            const hasComposer = hasComposerJson();
            if (hasComposer) {
                console.log('composer dependency installing....'.green);
                const composerInstall = spawn('composer', ["install"]);
                composerInstall.stdout.on("end", async function complete() {
                    console.log('composer dependency installed'.green);
                    await copyEnv()
                    console.log('key generating....'.green);
                    const generateKey = spawn("php", ["artisan", "key:generate"]);
                    generateKey.stdout.on("end", async function complete() {
                        await message();
                    })
                })
            } else {
                await copyEnv();
                await message()
            }
        })
    })
}
export default clone