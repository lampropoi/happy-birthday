const settings = require("./settings");
const puppeteer = require("puppeteer");

const selectors = {
  username: "#email",
  password: "#pass",
  loginButton: "#loginbutton",
  birthdayTextareas: ".formWrapper textarea",
  tagArea: ".uiContextualLayerBelowLeft li"
};

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });
  const page = await browser.newPage();
  let login = async () => {
    // login
    await page.goto("https://facebook.com", {
      waitUntil: "networkidle2"
    });
    await page.waitForSelector(selectors.username);
    await page.type(selectors.username, settings.username);

    await page.type(selectors.password, settings.password);

    await page.click(selectors.loginButton);

    await page.waitForNavigation();
  };
  await login();

  // navigate to birthday page
  await page.goto("https://www.facebook.com/events/birthdays/");
  await page.waitForSelector(selectors.birthdayTextareas);

  const result = await page.evaluate(() => {
    try {
      const name = document.querySelector("#birthdays_today_card ~div a").title;
      return name;
    } catch (err) {
      console.log(err);
    }
  });
  await page.type(
    "#birthdays_today_card ~div textarea",
    `Happy Birthday ${result}!!! Wish you the best :)`
  );

  await page.keyboard.press("Enter");

  await browser.close();
})();
