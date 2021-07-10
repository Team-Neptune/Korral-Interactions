import { Response } from "node-fetch"
import { readFileSync, existsSync, writeFileSync } from "fs"
import fetch from "node-fetch"
import { config } from "../config"
import Builder from './builder'
import {
  Interaction,
  Config,
  MessageComponent,
  InteractionResponse,
  BuilderApiJson,
} from "../typings"
import express from "express"
import {
  verifyKeyMiddleware,
  InteractionType,
  InteractionResponseType,
} from "discord-interactions"
import DeepSea from "./deepsea"
import BuilderStore from "./builderStore"
const discord_api = "https://discord.com/api/v9"
const app = express()
const port = process.env.PORT || config.port || 3000
const public_key = process.env.public_key || config.public_key

//Builder
let builder = new Builder()
let builderStore = new BuilderStore()

builder.on('new', (userID) => {
  builderStore.start(userID)
})

builder.on('clear', (userID) => {
  builderStore.cancel(userID)
})

builder.on('add', (userID, module) => {
  builderStore.addItem(userID, module)
})

builder.on('remove', (userID, module) => {
  builderStore.removeItem(userID, module)
})

builder.getCurrent = (userID:string) => {
  return builderStore.getCurrent(userID)
}

app.use("/interactions", verifyKeyMiddleware(public_key))

app.use("/interactions", (req, res, next) => {
  const interaction: Interaction = req.body
  req.body.ack = (ephemeral?:boolean) => {
    return new Promise((res, rej) => {
      fetch(`${discord_api}/interactions/${interaction.id}/${interaction.token}/callback`, {
        "method":"POST",
        "headers":{
          "Content-Type":"application/json"
        },
        "body":JSON.stringify({
          type:4,
          data:ephemeral?{flags:64}:undefined
        })
      })
      .then(res)
      .catch(rej)
    })
  }
  req.body.reply = (msg:InteractionResponse) => {
    return new Promise((res, rej) => {
      fetch(`${discord_api}/interactions/${interaction.id}/${interaction.token}/callback`, {
        "method":"POST",
        "headers":{
          "Content-Type":"application/json"
        },
        "body":JSON.stringify({
          type:4,
          data:msg
        })
      })
      .then(res)
      .then(rej)
    })
  }
  if(interaction.type == InteractionType.MESSAGE_COMPONENT){
    req.body.update = (msg:InteractionResponse) => {
      return new Promise((res, rej) => {
        fetch(`${discord_api}/interactions/${interaction.id}/${interaction.token}/callback`, {
          "method":"POST",
          "headers":{
            "Content-Type":"application/json"
          },
          "body":JSON.stringify({
            type:7,
            data:msg
          })
        })
        .then(res)
        .catch(rej)
      })
    }
  }
  next()
})

app.post("/interactions", (req, res) => {
  const interaction: Interaction = req.body
  if (interaction.type === InteractionType.APPLICATION_COMMAND) {
    let acked = false
    const ack = (hidden?:boolean) => {
      acked = true
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
              data:hidden?{
                flags:64
              }:undefined
            }),
          }
        )
          .then(resolve)
          .catch(reject)
      })
    }

    const sendMessage = (
      content: string,
      allowed_mentions?,
      components?: Array<MessageComponent>,
      hidden?:boolean
    ) => {
      let payload: InteractionResponse = {
        content: content,
        allowed_mentions: {
          parse: [],
        },
      }
      if (components) payload.components = components
      if (allowed_mentions) payload.allowed_mentions = allowed_mentions
      if (acked == false){
        payload = {
          type: 4,
          data: {
            content: content,
            allowed_mentions: {
              parse: [],
            }
          },
        }
        if(allowed_mentions) payload.data.allowed_mentions = allowed_mentions
        if (components) payload.data.components = components
        if(hidden) payload.data.flags = 64
      }else{
        if(allowed_mentions)
          payload.allowed_mentions = allowed_mentions
        if(hidden) payload.data.flags = 64
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
            acked = true
            return r
          })
          .then(resolve)
          .catch(reject)
      })
    }

    const sendMessageWithEmbeds = (msg, embeds) => {
      let payload: InteractionResponse = {
        content: msg,
        allowed_mentions: {
          parse: [],
        },
        embeds: embeds,
      }
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
        }
      console.log(payload)
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
            r.json().then((j) => console.log(JSON.stringify(j)))
            acked = true
            return r
          })
          .then(resolve)
          .catch(reject)
      })
    }
    const getMessage = (channel_id, message_id) => {
      return new Promise((resolve, reject) => {
        fetch(`${discord_api}/channels/${channel_id}/messages/${message_id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bot ${process.env.bot_token || config.bot_token}`,
          },
        })
          .then((r) => r.json())
          .then(resolve)
          .catch(reject)
      })
    }
    switch (interaction.data.name) {
      case "dns":
        sendMessage(
          "**90DNS**:\n**1st IP**: `207.246.121.77`\n**2nd IP**: `163.172.141.219`\n\n**Aquaticdns**:\n**1st IP**: `209.182.219.167`\n**2nd IP**: `207.246.121.77`\n\n**Note**: You will need to setup the DNS IPs on each network you connect to."
        )
        break
      case "exfat":
        sendMessage(
          "The standard exFAT driver is bad and shouldn't be used.\n\nIf your PC doesn't allow you to format your card to FAT32 you can do that in hekate:\nTools -> Arch bit · RCM · Touch · Partition -> Partition"
        )
        break
      case "guide":
        sendMessage(
          `**Generic starter guides:**\n[Beginners Guide](https://switch.homebrew.guide/)\n\n**Specific guides:**\n[Manually Updating/Downgrading (with HOS)](https://switch.homebrew.guide/usingcfw/manualupgrade)\n[Manually Repairing/Downgrading (without HOS)](https://switch.homebrew.guide/usingcfw/manualchoiupgrade)\n[Creating an emuMMC](https://switch.homebrew.guide/emummc/emummc.html)`
        )
        break
      case "nag":
        switch (interaction.data.options[0].value) {
          case "gl":
            sendMessage(
              "1. Open Goldleaf\n2. Select `Console and Goldleaf settings`\n3. Select on `Firmware and Updates`\n4. Select `Delete pending`"
            )
            break
          case "mm":
            sendMessage(
              "1. Turn off your switch\n2. If you have autoRCM enabled you should push hekate and select a launch option before doing the next step\n3. Press and hold Volume down and then hold the power button\n4. Keep pressing the Power button, but let go of Volume Down and press and hold Volume Up\n5. Let go of the power button and keep holding Volume Up untill you see safemode appear on the screen.\nAfter you see Maintenance Mode pop up on your switch screen. Don't select anything and turn your switch off again"
            )
            break
          default:
            sendMessage(
              "😬 An invalid option was provided. Please open an issue on [GitHub](https://github.com/Team-Neptune/Korral-Interactions) if the issue persists."
            )
            break
        }
        break
      case "patches":
        sendMessage(
          `For pirated eshop-games, forwarders and other unofficial stuff you need signature patches. You can download them seperatly via the included "Switch AIO updater" homebrew. As their general purpose is to allow piracy we're not providing any help with installation or problems of said patches or pirated games afterwards.`
        )
        break
      case "sd":
        sendMessage(
          "If you are getting an error in hekate such as: Missing lp0 lib, Missing or old minerva lib or Update bootloader \nPlease check and make sure that you **extracted the contents of the SD folder onto your SD card**\n\nCorrect: [This](https://cdn.discordapp.com/attachments/649724928542900264/830211676355559424/correct_sd.png)\nIncorrect: [This](https://cdn.discordapp.com/attachments/649724928542900264/830211690813063208/incorrect_sd.png)"
        )
        break
      case "deepsea":
        ack().then(() => {
          let deepsea = new DeepSea()
          let releases = deepsea.get()
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
                }/${e.name}>)**\n**📥 Download count**: ${e.downloadCount}\n`
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
          )
        })
        break
      case "avatar":
        const user =
          (interaction.data.options &&
            interaction.data.options.find((o) => o.name == "user") &&
            interaction.data.resolved.users[
              interaction.data.options.find((o) => o.name == "user").value
            ]) ||
          (interaction.member ? interaction.member.user : interaction.user)
        const size =
          (interaction.data.options &&
            interaction.data.options.find((o) => o.name == "size") &&
            interaction.data.options.find((o) => o.name == "size").value) ||
          "512"
        const gif =
          (interaction.data.options &&
            interaction.data.options.find((o) => o.name == "gif") &&
            interaction.data.options.find((o) => o.name == "gif").value) ||
          false
        const avatarURL = `https://cdn.discordapp.com/avatars/${user.id}/${
          user.avatar
        }.${gif && user.avatar.startsWith("a_") ? "gif" : "webp"}?size=${size}`
        if (user.avatar == null) {
          sendMessage("This user doesn't have an avatar.")
          break
        }
        sendMessage(avatarURL)
        break
      case "rule":{
        const ruleNum = interaction.data.options[0].value
        const target = interaction.data.options[1]
          ? interaction.data.options[1].value
          : undefined
        let rules = JSON.parse(readFileSync("./tn_rules.json").toString())
        if (!rules[`${ruleNum}`])
          return sendMessage(`**Invalid rule**\nRule not found.`)
        const rule = rules[`${ruleNum}`]
        sendMessage(
          `${target ? `*Target: <@${target}>*\n` : ``}**${rule.title}**\n${
            rule.content
          }`,
          target ? { users: [target] } : undefined
        )
        break
      }
      case "nogc":
        ack().then(() => {
          getMessage("703302552594284594", "809485735060307990").then((m) => {
            sendMessage(
              `${
                (m as any).content
              }\n\n[Jump to Message](https://discord.com/channels/703301751171973190/703302552594284594/809485735060307990)`
            )
          })
        })
        break
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
        ]
        const index = Math.floor(Math.random() * messages.length)
        const msg = messages[index]
        sendMessage(msg)
        break
      case "cpr":{
        let target = interaction.data.options && interaction.data.options[0]?interaction.data.options[0].value:undefined
        sendMessage(
          `${target ? `*Target: <@${target}>*\n` : ``}\nTeam Neptune has developed a payload (CommonProblemResolver) that can fix a few of the common issues you can encounter with your switch.`,
          target ? { users: [target] } : undefined, [
            {
              "type":1,
              "components":[
                {
                  "type":2,
                  "style":5,
                  "url":"https://gbatemp.net/threads/payload-cpr-fix-your-switch-without-a-pc.590341/",
                  "label":"Learn more"
                },
                {
                  "type":2,
                  "style":5,
                  "url":"https://github.com/Team-Neptune/CommonProblemResolver",
                  "label":"Source Code"
                },
                {
                  "type":2,
                  "style":5,
                  "url":"https://github.com/Team-Neptune/CommonProblemResolver/releases/latest",
                  "label":"Latest Release"
                }
              ]
            }
          ]
        )
        break
      }
      case "builder":{
        const buildCategories = [
          "CFW & Bootloaders",
          "Homebrew Apps",
          "Sysmodules",
          "Overlays",
          "Payloads",
          "Addons"
        ]
        builder.emit("new", interaction.member?interaction.member.user.id:interaction.user.id)
        sendMessage(`**DeepSea Custom Package Builder**\nSelect a category below to view a list of packages you can add to your custom deepsea package.`, undefined, [
          {
            "type":1,
            "components":[
              {
                "type":3,
                "custom_id":"select",
                "options":[
                  {
                    "label":buildCategories[0],
                    "style":1,
                    "value":`viewcat_${buildCategories[0]}`,
                    "type":2,
                    "emoji":{
                      "name":"💿"
                    }
                  },
                  {
                    "label":buildCategories[1],
                    "style":1,
                    "value":`viewcat_${buildCategories[1]}`,
                    "type":2,
                    "emoji":{
                      "name":"📱"
                    }
                  },
                  {
                    "label":buildCategories[2],
                    "style":1,
                    "value":`viewcat_${buildCategories[2]}`,
                    "type":2,
                    "emoji":{
                      "name":"⚙️"
                    }
                  },
                  {
                    "label":buildCategories[3],
                    "style":1,
                    "value":`viewcat_${buildCategories[3]}`,
                    "type":2,
                    "emoji":{
                      "name":"🎛"
                    }
                  },
                  {
                    "label":buildCategories[4],
                    "style":1,
                    "value":`viewcat_${buildCategories[4]}`,
                    "type":2,
                    "emoji":{
                      "name":"🔌"
                    }
                  },
                  {
                    "label":buildCategories[5],
                    "style":1,
                    "value":`viewcat_${buildCategories[5]}`,
                    "type":2,
                    "emoji":{
                      "name":"➕"
                    }
                  }
                ],
                "placeholder":"Select a category"
              }
            ]
          },
          {
            "type":1,
            "components":[
              {
                "type":2,
                "custom_id":`build`,
                "style":1,
                "label":`Build package`
              }
            ]
          }
        ], true)
        break
      }
      default:
        sendMessage(
          `Uh oh, that interaction wasn't found! 😬\nOpen an issue on [GitHub](https://github.com/Team-Neptune/Korral-Interactions) if the issue persists.`
        )
        break
    }
  }

  //Buttons

  //Add item
  if(interaction.type == InteractionType.MESSAGE_COMPONENT && interaction.data && interaction.data.component_type == 2 && interaction.data.custom_id.startsWith("add_")){
    let builderData:BuilderApiJson = /* Temp */ JSON.parse(readFileSync("./buildermeta.json").toString())
    let selectedModuleName = interaction.data.custom_id.split("add_")[1]
    let options = Object.keys(builderData.modules).filter(mn => {
      return builderData.modules[mn].category == builderData.modules[selectedModuleName].category
    }).map(v => {
      return v
    })
    builder.emit("add", interaction.member?interaction.member.user.id:interaction.user.id, builderData.modules[selectedModuleName])
    interaction.update({
      "components":[
        {
          "type":1,
          "components":[
            {
              "type":2,
              "custom_id":`remove_${selectedModuleName}`,
              "style":4,
              "label":`Remove ${builderData.modules[selectedModuleName].displayName}`,
              "disabled":builderData.modules[selectedModuleName].required
            },
            {
              "type":2,
              "style":5,
              "label":`GitHub`,
              "url":`https://github.com/${builderData.modules[selectedModuleName].repo}`
            }
          ]
        },
        {
          "type":1,
          "components":[
            {
              "type":3,
              "custom_id":"select",
              "options":options.map(moduleName => {
                return {
                  "label":builderData.modules[moduleName].displayName,
                  "style":1,
                  "value":`viewmore_${moduleName}`,
                  "type":2,
                  "description":`${builderData.modules[moduleName].description.substr(0, 47)+"..."}`
                }
              }),
              "placeholder":"Select a module to view more info"
            }
          ]
        },
        {
          "type":1,
          "components":[
            {
              "type":2,
              "custom_id":`viewcats`,
              "style":2,
              "label":`Return to category list`
            },
            {
              "type":2,
              "custom_id":`build`,
              "style":1,
              "label":`Build package`
            }
          ]
        }
      ]
    })
  }

  //Remove item
  if(interaction.type == InteractionType.MESSAGE_COMPONENT && interaction.data && interaction.data.component_type == 2 && interaction.data.custom_id.startsWith("remove_")){
    let builderData:BuilderApiJson = /* Temp */ JSON.parse(readFileSync("./buildermeta.json").toString())
    let selectedModuleName = interaction.data.custom_id.split("remove_")[1]
    let options = Object.keys(builderData.modules).filter(mn => {
      return builderData.modules[mn].category == builderData.modules[selectedModuleName].category
    }).map(v => {
      return v
    })
    builder.emit("remove", interaction.member?interaction.member.user.id:interaction.user.id, builderData.modules[selectedModuleName])
    interaction.update({
      "components":[
        {
          "type":1,
          "components":[
            {
              "type":2,
              "custom_id":`add_${selectedModuleName}`,
              "style":3,
              "label":`Add ${builderData.modules[selectedModuleName].displayName}`,
              "disabled":builderData.modules[selectedModuleName].required
            },
            {
              "type":2,
              "style":5,
              "label":`GitHub`,
              "url":`https://github.com/${builderData.modules[selectedModuleName].repo}`
            }
          ]
        },
        {
          "type":1,
          "components":[
            {
              "type":3,
              "custom_id":"select",
              "options":options.map(moduleName => {
                return {
                  "label":builderData.modules[moduleName].displayName,
                  "style":1,
                  "value":`viewmore_${moduleName}`,
                  "type":2,
                  "description":`${builderData.modules[moduleName].description.substr(0, 47)+"..."}`
                }
              }),
              "placeholder":"Select a module to view more info"
            }
          ]
        },
        {
          "type":1,
          "components":[
            {
              "type":2,
              "custom_id":`viewcats`,
              "style":2,
              "label":`Return to category list`
            },
            {
              "type":2,
              "custom_id":`build`,
              "style":1,
              "label":`Build package`
            }
          ]
        }
      ]
    })
  }

  //Category
  if(interaction.type == InteractionType.MESSAGE_COMPONENT && interaction.data && interaction.data.component_type == 2 && interaction.data.custom_id == "viewcats"){
    const buildCategories = [
      "CFW & Bootloaders",
      "Homebrew Apps",
      "Sysmodules",
      "Overlays",
      "Payloads",
      "Addons"
    ]
    interaction.update({
      "content":`**DeepSea Custom Package Builder**\nSelect a category below to view a list of packages you can add to your custom deepsea package.`,
      "components":[
        {
          "type":1,
          "components":[
            {
              "type":3,
              "custom_id":"select",
              "options":[
                {
                  "label":buildCategories[0],
                  "style":1,
                  "value":`viewcat_${buildCategories[0]}`,
                  "type":2,
                  "emoji":{
                    "name":"💿"
                  }
                },
                {
                  "label":buildCategories[1],
                  "style":1,
                  "value":`viewcat_${buildCategories[1]}`,
                  "type":2,
                  "emoji":{
                    "name":"📱"
                  }
                },
                {
                  "label":buildCategories[2],
                  "style":1,
                  "value":`viewcat_${buildCategories[2]}`,
                  "type":2,
                  "emoji":{
                    "name":"⚙️"
                  }
                },
                {
                  "label":buildCategories[3],
                  "style":1,
                  "value":`viewcat_${buildCategories[3]}`,
                  "type":2,
                  "emoji":{
                    "name":"🎛"
                  }
                },
                {
                  "label":buildCategories[4],
                  "style":1,
                  "value":`viewcat_${buildCategories[4]}`,
                  "type":2,
                  "emoji":{
                    "name":"🔌"
                  }
                },
                {
                  "label":buildCategories[5],
                  "style":1,
                  "value":`viewcat_${buildCategories[5]}`,
                  "type":2,
                  "emoji":{
                    "name":"➕"
                  }
                }
              ],
              "placeholder":"Select a category"
            }
          ]
        },
        {
          "type":1,
          "components":[
            {
              "type":2,
              "custom_id":`build`,
              "style":1,
              "label":`Build package`
            }
          ]
        }
      ]
    })
  }

  //Selects
  if(interaction.type == InteractionType.MESSAGE_COMPONENT && interaction.data && interaction.data.component_type == 3){
    let builderData:BuilderApiJson = /* Temp */ JSON.parse(readFileSync("./buildermeta.json").toString())
    if(interaction.data.values[0].startsWith("viewcat_")){
      let categories = []
      Object.keys(builderData.modules).forEach(mn => {
        if(!categories.includes(builderData.modules[mn].category))
          categories.push(builderData.modules[mn].category)
      })
      let options = Object.keys(builderData.modules).filter(mn => {
        return builderData.modules[mn].category == interaction.data.values[0].split("viewcat_")[1]
      }).map(v => {
        return v
      })
      interaction.update({
        "content":`**${interaction.data.values[0].split("viewcat_")[1]}**`,
        "components":[
          {
            "type":1,
            "components":[
              {
                "type":3,
                "custom_id":"select",
                "options":options.map(moduleName => {
                  return {
                    "label":builderData.modules[moduleName].displayName,
                    "style":1,
                    "value":`viewmore_${moduleName}`,
                    "description":`${builderData.modules[moduleName].description.length > 50?builderData.modules[moduleName].description.substr(0, 47)+"...":builderData.modules[moduleName].description}`,
                    "type":2
                  }
                }),
                "placeholder":"Select a module to view more info"
              }
            ]
          },
          {
            'type':1,
            "components":[
              {
                "type":2,
                "custom_id":`viewcats`,
                "style":2,
                "label":`Return to category list`
              },
              {
                "type":2,
                "custom_id":`build`,
                "style":1,
                "label":`Build package`
              }
            ]
          }
        ],
        "flags":64
      })
    }

    if(interaction.data.values[0].startsWith("viewmore_")){
      let builderData:BuilderApiJson = /* Temp */ JSON.parse(readFileSync("./buildermeta.json").toString())
      let selectedModuleName = interaction.data.values[0].split("viewmore_")[1]
      console.log(builderStore.getCurrent(interaction.member?interaction.member.user.id:interaction.user.id))
      let moduleAlreadyAdded = builderData.modules[selectedModuleName].required || builderStore.getCurrent(interaction.member?interaction.member.user.id:interaction.user.id).find(m => m.repo == builderData.modules[selectedModuleName].repo)
      let options = Object.keys(builderData.modules).filter(mn => {
        return builderData.modules[mn].category == builderData.modules[selectedModuleName].category
      }).map(v => {
        return v
      })
      interaction.update({
        "content":`**${builderData.modules[selectedModuleName].category}** | ${builderData.modules[selectedModuleName].displayName}\nBy: ${builderData.modules[selectedModuleName].repo.split("/")[0]}\n\n${builderData.modules[selectedModuleName].description}\n\n${builderData.modules[selectedModuleName].required?`*${builderData.modules[selectedModuleName].displayName} is required and cannot be removed.*`:``}`,
        "components":[
          {
            "type":1,
            "components":[
              {
                "type":2,
                "custom_id":`add_${selectedModuleName}`,
                "style":moduleAlreadyAdded?4:3,
                "label":`${moduleAlreadyAdded?`Remove`:`Add`} ${builderData.modules[selectedModuleName].displayName}`,
                "disabled":builderData.modules[selectedModuleName].required
              },
              {
                "type":2,
                "style":5,
                "label":`GitHub`,
                "url":`https://github.com/${builderData.modules[selectedModuleName].repo}`
              }
            ]
          },
          {
            "type":1,
            "components":[
              {
                "type":3,
                "custom_id":"select",
                "options":options.map(moduleName => {
                  return {
                    "label":builderData.modules[moduleName].displayName,
                    "style":1,
                    "value":`viewmore_${moduleName}`,
                    "type":2,
                    "description":`${builderData.modules[moduleName].description.substr(0, 47)+"..."}`
                  }
                }),
                "placeholder":"Select a module to view more info"
              }
            ]
          },
          {
            "type":1,
            "components":[
              {
                "type":2,
                "custom_id":`viewcats`,
                "style":2,
                "label":`Return to category list`
              },
              {
                "type":2,
                "custom_id":`build`,
                "style":1,
                "label":`Build package`
              }
            ]
          }
        ],
        "flags":64
      })
    }
  }
})

function setupDeepsea() {
  let deepsea = new DeepSea()
  deepsea.update().then(() => console.log(`Deepsea data setup!`))
}
setInterval(() => {
  let deepsea = new DeepSea()
  deepsea.update()
}, 60 * 60 * 1000)

app.listen(port, () => {
  setupDeepsea()
  console.log(`Ready to listen for interactions on port: ${port}`)
})

