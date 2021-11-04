import Command from "../classes/Command";
import { config } from "../../config";
import fetch from "node-fetch";
import { Message } from "../../typings";

const discord_api = "https://discord.com/api/v9"

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

const message_guild_id = "703301751171973190"
const message_channel_id = "703302552594284594"
const message_id = "824322420529823764"

export default new Command({
    execute(interaction){
        interaction.ack({ephemeral:false}).then(() => {
            getMessage(message_channel_id, message_id).then((m) => {
                interaction.reply({
                    content:`${(m as Message).content}\n\n[Jump to Message](https://discord.com/channels/${message_guild_id}/${message_channel_id}/${message_id})`
                })
            })  
        })
    }
})
