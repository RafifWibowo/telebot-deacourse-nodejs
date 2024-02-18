const TelegramBot = require("node-telegram-bot-api");
const commands = require("../libs/commands");
const helpText = require("../libs/constant");

class Cuybot extends TelegramBot {
  constructor(token, options) {
    super(token, options);
    this.on("message", (data) => {
      // console.log(data);
      const isInCommands = Object.values(commands).some((keyword) => keyword.test(data.text));
      if (!isInCommands) {
        this.sendMessage(data.from.id, "Gak ada cuy, cek commandnya dibawah", {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "Command",
                  callback_data: "go_to_help",
                },
              ],
            ],
          },
        });
      }
    });
    this.on("callback_query", (callback) => {
      const callbackName = callback.data;
      if (callbackName == "go_to_help") {
        this.sendMessage(callback.from.id, helpText);
      }
    });
  }
  getSticker() {
    this.on("sticker", (data) => {
      console.log("Kiriman stiker by " + data.from.username + " at " + new Date(data.date * 1000));
      this.sendMessage(data.from.id, data.sticker.emoji);
    });
  }
  sendHalo() {
    this.onText(commands.halo, (data) => {
      console.log("Command !halo by " + data.from.username + " at " + new Date(data.date * 1000));
      this.sendMessage(data.from.id, `Halo kak ${data.from.first_name}\n\nMau ngapain hari ini?`);
    });
  }
  getQuotes() {
    this.onText(commands.quotes, async (data) => {
      console.log("Command !quotes by " + data.from.username + " at " + new Date(data.date * 1000));
      const quoteEndpoint = "https://api.kanye.rest/";
      const wait_message = await this.sendMessage(data.from.id, "Chotto...");
      this.deleteMessage(data.chat.id, wait_message.message_id);
      try {
        const apicall = await fetch(quoteEndpoint);
        const { quote } = await apicall.json();
        this.sendMessage(data.from.id, quote);
      } catch (error) {
        console.error(error);
        this.sendMessage(data.from.id, "Sorry gagal bang, ulang lagi bang👍");
      }
    });
  }
  getNews() {
    this.onText(commands.news, async (data) => {
      console.log("Command !news by " + data.from.username + " at " + new Date(data.date * 1000));
      const newsEndpoint = "https://jakpost.vercel.app/api/category/indonesia";
      const wait_message = await this.sendMessage(data.from.id, "Chotto...");
      this.deleteMessage(data.chat.id, wait_message.message_id);
      try {
        const apicall = await fetch(newsEndpoint);
        const response = await apicall.json();
        const max = 1;
        for (let i = 0; i < max; i++) {
          const news = response.posts[i];
          const { title, image, headline, link } = news;
          this.sendPhoto(data.from.id, image, {
            caption: `Judul: ${title}\n\n${headline}\n\n${link}`,
          });
        }
      } catch (error) {
        console.error(error);
        this.sendMessage(data.from.id, "Sorry gagal bang, ulang lagi bang👍");
      }
    });
  }
  getGempa() {
    this.onText(commands.gempa, async (data) => {
      console.log("Command !gempa by " + data.from.username + " at " + new Date(data.date * 1000));
      const endpoint = "https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json";
      const wait_message = await this.sendMessage(data.from.id, "Chotto...");
      this.deleteMessage(data.chat.id, wait_message.message_id);
      try {
        const apicall = await fetch(endpoint);
        const response = await apicall.json();
        // console.log(response.Infogempa);
        const { gempa } = response.Infogempa;
        const { Tanggal, Jam, Coordinates, Lintang, Bujur, Magnitude, Kedalaman, Wilayah, Potensi, Shakemap } = gempa;
        const image = "https://data.bmkg.go.id/DataMKG/TEWS/" + Shakemap;
        this.sendPhoto(data.from.id, image, {
          caption: `Info gempa nih\n\nTanggal = ${Tanggal}\nJam = ${Jam}\nKoordinat = ${Coordinates}\nLintang-Bujur = ${Lintang} ${Bujur}\nMagnitude = ${Magnitude}\nKedalaman = ${Kedalaman}\nWilayah = ${Wilayah}\nPotensi = ${Potensi}`,
        });
      } catch (error) {
        console.error(error);
        this.sendMessage(data.from.id, "Ulangin bang");
      }
    });
  }
  getHelp() {
    this.onText(commands.help, async (data) => {
      console.log("Command !help by " + data.from.username + " at " + new Date(data.date * 1000));
      this.sendMessage(data.from.id, helpText);
    });
  }
}

module.exports = Cuybot;
