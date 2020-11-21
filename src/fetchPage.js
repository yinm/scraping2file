const pRetry = require("p-retry");
const puppeteer = require("puppeteer");

async function fetchPage(page, url) {
  try {
    await page.goto(url, { waitUntil: "domcontentloaded" });
  } catch (e) {
    if (!(e instanceof puppeteer.errors.TimeoutError)) {
      if (e.message.includes("Cannot navigate to invalid URL")) {
        e.message += ` (URL: ${url})`;
      }
      throw new pRetry.AbortError(e);
    }

    throw e;
  }
}

module.exports = {
  fetchPage,
};
