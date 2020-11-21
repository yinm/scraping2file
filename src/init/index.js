const {
  promises: { copyFile, mkdir },
  constants: { COPYFILE_EXCL },
} = require("fs");
const { join } = require("path");

async function init() {
  const configFileName = "config.yml";
  const urlsFileName = "urls.txt";
  const outputDirectoryName = "output";

  const templateDir = join(__dirname, "templates");
  try {
    await copyFile(
      join(templateDir, "config.yml"),
      configFileName,
      COPYFILE_EXCL
    );

    await copyFile(join(templateDir, "urls.txt"), urlsFileName, COPYFILE_EXCL);

    await mkdir(outputDirectoryName);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

module.exports = {
  init,
};
