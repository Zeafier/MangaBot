const fs = require('fs');
const path = require('path')

//export all of the files name
module.exports = (dir, folderOnly = false) => {
    let fileNames = [];

    const files = fs.readdirSync(dir, { withFileTypes: true });

    for (const file of files) {
        const filePath = path.join(dir, file.name);

        if (folderOnly) {
            if (file.isDirectory()) {
                fileNames.push(filePath);
            }
        } else {
            if (file.isFile()) {
                fileNames.push(filePath)
            }
        }
    }

    return fileNames
}