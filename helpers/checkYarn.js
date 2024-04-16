import { execSync } from 'child_process';
function isYarnInstalled() {
    try {
        // Run 'yarn --version' command and capture output
        execSync('yarn --version');
        return true; // Yarn is installed
    } catch (error) {
        return false; // Yarn is not installed or not found
    }
}
export default isYarnInstalled