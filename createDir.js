import * as fs from 'fs';
const CURRENT_DIR = process.cwd();

const CreateDirectoryContents = (templatePath, newProjectPath) => {
    const filesToCreate = fs.readdirSync(templatePath);

    filesToCreate.forEach(file => {
        const origFilePath = `${templatePath}/${file}`;
        const stats = fs.statSync(origFilePath);

        if(stats.isFile()) {
            const contents = fs.readFileSync(origFilePath, 'utf8');
            if(file === '.npmignorte') file = '.gitignore';

            const writePath = `${CURRENT_DIR}/${newProjectPath}/${file}`;
            fs.writeFileSync(writePath, contents, 'utf8');
        } else if (stats.isDirectory()) {
            fs.mkdirSync(`${CURRENT_DIR}/${newProjectPath}/${file}`);

            CreateDirectoryContents(`${templatePath}/${file}`, `${newProjectPath}/${file}`);
        }
    });
};

export default CreateDirectoryContents;