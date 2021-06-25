import { readFileSync, existsSync, writeFileSync } from "fs";
import * as fetch from "node-fetch";
import { config } from "../config";
import {
  Interaction,
  Config,
  InteractionButton,
  InteractionResponse,
} from "../typings";
import express from "express";
import {
  verifyKeyMiddleware,
  InteractionType,
  InteractionResponseType,
} from "discord-interactions";
import DeepSea from "./deepsea";
const discord_api = "https://discord.com/api/v9";
const app = express();
const port = config.port || 3000;

app.use("/interactions", verifyKeyMiddleware(config.public_key));

app.post("/interactions", (req, res) => {
  const interaction: Interaction = req.body;
  if (interaction.type === InteractionType.APPLICATION_COMMAND) {
    let acked = false;

    const ack = () => {
      acked = true;
      return new Promise((resolve, reject) => {
        fetch(
          `${discord_api}/interactions/${interaction.id}/${interaction.token}/callback`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
            }),
          }
        )
          .then(resolve)
          .catch(reject);
      });
    };

    const sendMessage = (
      content: string,
      allowed_mentions?,
      components?: Array<InteractionButton>
    ) => {
      let payload: InteractionResponse = {
        content: content,
        allowed_mentions: {
          parse: [],
        },
      };
      if (components) payload.components = components;
      if (allowed_mentions) payload.allowed_mentions = allowed_mentions;
      if (acked == false){
        payload = {
          type: 4,
          data: {
            content: content,
            allowed_mentions: {
              parse: [],
            },
          },
        };
        if(allowed_mentions)
          payload.data.allowed_mentions = allowed_mentions;
      }else{
        if(allowed_mentions)
          payload.allowed_mentions = allowed_mentions;
      }
      return new Promise((resolve, reject) => {
        fetch(
          acked === true
            ? `${discord_api}/webhooks/${interaction.application_id}/${interaction.token}`
            : `${discord_api}/interactions/${interaction.id}/${interaction.token}/callback`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        )
          .then((r) => {
            acked = true;
            return r;
          })
          .then(resolve)
          .catch(reject);
      });
    };

    const sendMessageWithEmbeds = (msg, embeds) => {
      let payload: InteractionResponse = {
        content: msg,
        allowed_mentions: {
          parse: [],
        },
        embeds: embeds,
      };
      if (acked == false)
        payload = {
          type: 4,
          data: {
            content: msg,
            allowed_mentions: {
              parse: [],
            },
            embeds: embeds,
          },
        };
      console.log(payload);
      return new Promise((resolve, reject) => {
        fetch(
          acked === true
            ? `${discord_api}/webhooks/${interaction.application_id}/${interaction.token}`
            : `${discord_api}/interactions/${interaction.id}/${interaction.token}/callback`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        )
          .then((r) => {
            r.json().then((j) => console.log(JSON.stringify(j)));
            acked = true;
            return r;
          })
          .then(resolve)
          .catch(reject);
      });
    };
    const getMessage = (channel_id, message_id) => {
      return new Promise((resolve, reject) => {
        fetch(`${discord_api}/channels/${channel_id}/messages/${message_id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bot ${config.bot_token}`,
          },
        })
          .then((r) => r.json())
          .then(resolve)
          .catch(reject);
      });
    };
    switch (interaction.data.name) {
      case "dns":
        sendMessage(
          "**90DNS**:\n**1st IP**: `207.246.121.77`\n**2nd IP**: `163.172.141.219`\n\n**Aquaticdns**:\n**1st IP**: `209.182.219.167`\n**2nd IP**: `207.246.121.77`\n\n**Note**: You will need to setup the DNS IPs on each network you connect to."
        );
        break;
      case "exfat":
        sendMessage(
          "The standard exFAT driver is bad and shouldn't be used.\n\nIf your PC doesn't allow you to format your card to FAT32 you can do that in hekate:\nTools -> Arch bit · RCM · Touch · Partition -> Partition"
        );
        break;
      case "guide":
        sendMessage(
          `**Generic starter guides:**\n[Beginners Guide](https://switch.homebrew.guide/)\n\n**Specific guides:**\n[Manually Updating/Downgrading (with HOS)](https://switch.homebrew.guide/usingcfw/manualupgrade)\n[Manually Repairing/Downgrading (without HOS)](https://switch.homebrew.guide/usingcfw/manualchoiupgrade)\n[Creating an emuMMC](https://switch.homebrew.guide/emummc/emummc.html)`
        );
        break;
      case "nag":
        switch (interaction.data.options[0].value) {
          case "gl":
            sendMessage(
              "1. Open Goldleaf\n2. Select `Console and Goldleaf settings`\n3. Select on `Firmware and Updates`\n4. Select `Delete pending`"
            );
            break;
          case "mm":
            sendMessage(
              "1. Turn off your switch\n2. If you have autoRCM enabled you should push hekate and select a launch option before doing the next step\n3. Press and hold Volume down and then hold the power button\n4. Keep pressing the Power button, but let go of Volume Down and press and hold Volume Up\n5. Let go of the power button and keep holding Volume Up untill you see safemode appear on the screen.\nAfter you see Maintenance Mode pop up on your switch screen. Don't select anything and turn your switch off again"
            );
            break;
          default:
            sendMessage(
              "😬 An invalid option was provided. Please contact TechGeekGamer#7205 if the issue persists."
            );
            break;
        }
        break;
      case "patches":
        sendMessage(
          `For pirated eshop-games, forwarders and other unofficial stuff you need signature patches. You can download them seperatly via the included "Switch AIO updater" homebrew. As their general purpose is to allow piracy we're not providing any help with installation or problems of said patches or pirated games afterwards.`
        );
        break;
      case "sd":
        sendMessage(
          "If you are getting an error in hekate such as: Missing lp0 lib, Missing or old minerva lib or Update bootloader \nPlease check and make sure that you **extracted the contents of the SD folder onto your SD card**\n\nCorrect: [This](https://cdn.discordapp.com/attachments/649724928542900264/830211676355559424/correct_sd.png)\nIncorrect: [This](https://cdn.discordapp.com/attachments/649724928542900264/830211690813063208/incorrect_sd.png)"
        );
        break;
      case "deepsea":
        ack().then(() => {
          let deepsea = new DeepSea();
          let releases = deepsea.get();
          sendMessageWithEmbeds(
            `**Latest version**: [${
              releases[0].latestTag
            }](<https://github.com/Team-Neptune/DeepSea/releases/tag/${
              releases[0].latestTag
            }>)\n**Released**: ${new Date(
              releases[0].releaseDate
            ).toString()}\n\n${releases
              .map((e) => {
                return `**[${
                  e.name.split(".")[0]
                }](<https://github.com/Team-Neptune/DeepSea/releases/download/${
                  e.latestTag
                }/${e.name}>)**\n**📥 Download count**: ${e.downloadCount}\n`;
              })
              .join(
                "\n"
              )}\n\n**🌐 Total downloads**: ${deepsea.getTotalDownloads()}`,
            [
              {
                footer: {
                  text: "Last cached ",
                },
                timestamp: new Date(deepsea.getLastFetched()),
              },
            ]
          );
        });
        break;
      case "avatar":
        const user =
          (interaction.data.options &&
            interaction.data.options.find((o) => o.name == "user") &&
            interaction.data.resolved.users[
              interaction.data.options.find((o) => o.name == "user").value
            ]) ||
          (interaction.member ? interaction.member.user : interaction.user);
        const size =
          (interaction.data.options &&
            interaction.data.options.find((o) => o.name == "size") &&
            interaction.data.options.find((o) => o.name == "size").value) ||
          "512";
        const gif =
          (interaction.data.options &&
            interaction.data.options.find((o) => o.name == "gif") &&
            interaction.data.options.find((o) => o.name == "gif").value) ||
          false;
        const avatarURL = `https://cdn.discordapp.com/avatars/${user.id}/${
          user.avatar
        }.${gif && user.avatar.startsWith("a_") ? "gif" : "webp"}?size=${size}`;
        if (user.avatar == null) {
          sendMessage("This user doesn't have an avatar.");
          break;
        }
        sendMessage(avatarURL);
        break;
      case "rule":
        const ruleNum = interaction.data.options[0].value;
        const target = interaction.data.options[1]
          ? interaction.data.options[1].value
          : undefined;
        let rules = JSON.parse(readFileSync("./tn_rules.json").toString());
        if (!rules[`${ruleNum}`])
          return sendMessage(`**Invalid rule**\nRule not found.`);
        const rule = rules[`${ruleNum}`];
        sendMessage(
          `${target ? `*Target: <@${target}>*\n` : ``}**${rule.title}**\n${
            rule.content
          }`,
          target ? { users: [target] } : undefined
        );
        break;
      case "nogc":
        ack().then(() => {
          getMessage("703302552594284594", "809485735060307990").then((m) => {
            sendMessage(
              `${
                (m as any).content
              }\n\n[Jump to Message](https://discord.com/channels/703301751171973190/703302552594284594/809485735060307990)`
            );
          });
        });
        break;
      case "eta":
        const messages = [
          "Soon:tm:",
          "June 15th",
          "Germany",
          "jelbrek wil lunch tomorrr",
          ":egg:",
          "chese",
          "when hax learns vuejs",
          "when techgeekgamer learns stuff",
        ];
        const index = Math.floor(Math.random() * messages.length);
        const msg = messages[index];
        sendMessage(msg);
        break;
      default:
        sendMessage(
          `Uh oh, that interaction wasn't found! 😬\nContact TechGeekGamer#7205 if the issue persists.`
        );
        break;
    }
  }
});

function setupDeepsea() {
  let deepsea = new DeepSea();
  deepsea.update().then(() => console.log(`Deepsea data setup!`));
}
setInterval(() => {
  let deepsea = new DeepSea();
  deepsea.update();
}, 60 * 60 * 1000);

app.listen(port, () => {
  setupDeepsea();
  console.log(`Ready to listen for interactions on port: ${port}`);
});

