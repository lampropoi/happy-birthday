const settings = require("./settings");
const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--window-size=1280,800"]
  });
  const page = await browser.newPage();
  await page.setViewport({
    width: 1280,
    height: 800
  });
  let login = async () => {
    // login
    await page.goto("https://facebook.com", {
      waitUntil: "networkidle2"
    });
    await page.waitForSelector("#email");
    await page.type("#email", settings.username, {
      delay: 100
    });

    await page.type("#pass", settings.password, {
      delay: 100
    });

    await page.click("#loginbutton");

    await page.waitForNavigation();
  };
  await login();

  await page.goto("https://www.facebook.com/events/birthdays/");
  await page.waitForSelector(".formWrapper textarea");

  const elements = await page.$$("#birthdays_today_card ~div li");
  for (const element of elements) {
    const name = await element.$("a");
    const nameText = await page.evaluate(name => name.innerText, name);
    const textarea = await element.$("textarea");
    if (textarea) {
      await textarea.type(`Happy Birthday @${nameText}`, {
        delay: 100
      });
      await page.keyboard.press("ArrowDown");
      await page.keyboard.press("Enter");
      await textarea.type("!!! Wish you the best :)", {
        delay: 100
      });
    }
  }

  // await page.keyboard.press("Enter");
  //
  // await browser.close();
})();
