const env = require("dotenv");
const Cuybot = require("./app/Cuybot");
env.config();

const token = process.env.TELE_TOKEN;
const options = {
  polling: true,
};

const cuybot = new Cuybot(token, options);
const main = () => {
  cuybot.getSticker();
  cuybot.sendHalo();
  cuybot.getQuotes();
  cuybot.getNews();
  cuybot.getGempa();
  cuybot.getHelp();
};

main();
