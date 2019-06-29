const settings = require("./settings");
const puppeteer = require("puppeteer");

const selectors = {
  username: "#email",
  password: "#pass",
  birthdayTextareas: ".formWrapper textarea",
  loginButton: "#loginbutton"
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

  await browser.close();
})();
