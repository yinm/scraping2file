const puppeteer = require("puppeteer");
const pRetry = require("p-retry");
const fs = require("fs/promises");
const { join } = require("path");
const { loadConfig } = require("./loadConfig");
const { fetchPage } = require("./fetchPage");
const formattedDate = require("./utils/formattedDate");

async function getTextContent(elementHandle, callback) {
  if (elementHandle === null) {
    return "";
  }

  const textContent = await elementHandle.evaluate((e) => e.textContent);
  return callback(textContent);
}

async function main() {
  let config;
  let urls;
  try {
    let input;
    [config, input] = await Promise.all([
      loadConfig(),
      fs.readFile("urls.txt", "utf-8"),
    ]);
    urls = input.split("\n").filter((v) => v);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }

  let browser;
  const rows = [];
  const skippedScrapingUrls = [];
  try {
    browser = await puppeteer.launch();
    const page = await browser.newPage();
    const { separator, hostname } = config;

    for (url of urls) {
      const fetchingHostname = new URL(url).hostname;
      if (!hostname[fetchingHostname]) {
        console.warn(
          `⚠️  Skip scraping "${url}" because a hostname is not found. Check your config file contains a hostname of "${fetchingHostname}".`
        );
        skippedScrapingUrls.push(url);
        continue;
      }

      console.log(`scraping: ${url}`);
      await pRetry(() => fetchPage(page, url), {
        retries: 5,
        onFailedAttempt({ retriesLeft }) {
          console.log(`retry fetching: ${url} (retries left: ${retriesLeft})`);
        },
      });

      const row = await Promise.all(
        hostname[fetchingHostname].map(async (setting) => {
          const { selector, all } = setting;
          const callback = setting.callback ?? ((v) => v);

          if (all) {
            const elementHandles = await page.$$(selector);
            const textContents = await Promise.all(
              elementHandles.map(async (elementHandle) => {
                return getTextContent(elementHandle, callback);
              })
            );
            return textContents.join("");
          } else {
            const elementHandle = await page.$(selector);
            return getTextContent(elementHandle, callback);
          }
        })
      );
      rows.push([...row, url].join(separator));

      await page.waitForTimeout(1000);
    }
  } catch (e) {
    console.error(e);
    await browser.close();
    process.exit(1);
  }
  await browser.close();

  if (rows.length) {
    const filename = `${formattedDate(new Date())}.txt`;
    const outputPath = join(process.cwd(), "output", filename);
    await fs.writeFile(outputPath, rows.join("\n"), "utf-8");
    console.log();
    console.log(`🎉 Created a file: ${outputPath} (${rows.length}rows)`);
  }

  if (skippedScrapingUrls.length) {
    console.log();
    console.log("🚨  skipped scraping urls -----------------------------");
    skippedScrapingUrls.forEach((url) => {
      console.log(url);
    });
  }
}

module.exports = {
  main,
};
