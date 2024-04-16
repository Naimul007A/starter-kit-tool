import fs from 'fs';

function hasComposerJson() {
    const filePath = 'composer.json';
    try {
        // Check if the file exists
        fs.accessSync(filePath, fs.constants.F_OK);
        return true; // composer.json exists in the directory
    } catch (error) {
        return false; // composer.json does not exist in the directory
    }
}

export default hasComposerJson