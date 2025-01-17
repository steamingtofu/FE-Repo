const fs = require("fs").promises
const path = require('path');

const ROOT_DIR_SLUG = "Item Icons"
const ROOT_DIR = "./" + ROOT_DIR_SLUG
const REPO_URL = "https://github.com/Klokinator/FE-Repo/tree/main"
const ASSET_URL = "https://raw.githubusercontent.com/Klokinator/FE-Repo/main"
const README_FILENAME = "README.md"

/**
 * Parses the "Item Icons" dirs and gathers all the Icons in a flat list.
 *
 * @returns {Object[]}
 */
 const searchIcons = async () => {
	const itemIconFiles = await fs.readdir(ROOT_DIR, { withFileTypes: true })
	const categoryDirectories = itemIconFiles.reduce((accumulator, categoryFile) => {
		if (categoryFile.isDirectory()) accumulator.push(categoryFile.name)
		return accumulator
	}, [])

	let readMeContent = '# Item Icons\n\n';

	// just use first directories for now for testing
	//temp = [categoryDirectories[0], categoryDirectories[1]];
	var flag = true;
    for (const directory of categoryDirectories) {
		var directoryReadMe = '';		
        const files = await fs.readdir(ROOT_DIR + "/" + directory);
		//clean up the filenames
		const cleanFileNames = files.filter(x => !x.toLowerCase().includes('readme'));

		readMeContent += `## [${directory}](${encodeURI(directory)})\n\n`
		if (flag) {
			flag = false;
			readMeContent += `<details open>\n`
		}
		else {
			readMeContent += `<details>\n`
		}
		readMeContent += `<summary>click to expand</summary>\n\n`
		for (const file of cleanFileNames) {
			var fileName = file;
			let type = file.split('.').pop();
        	if (type === "jpg" || type === "jpeg" || type === "png") {
				var filepath= `${ROOT_DIR_SLUG}/${directory}/${fileName}`;
				var uri= encodeURI(`${ASSET_URL}/${filepath}`).replace("+", "%2B");

				directoryReadMe += `![${fileName}](${uri || directory + "/" + filepath} "${fileName}")`;
				readMeContent += `![${fileName}](${uri || directory + "/" + filepath} "${fileName}")`;
			}
		}
		readMeContent += `\n</details>\n\n`

		fs.writeFile(`${ROOT_DIR}/${directory}/${README_FILENAME}`, directoryReadMe);
    }

	fs.writeFile(`${ROOT_DIR}/${README_FILENAME}`, readMeContent);
}

searchIcons()