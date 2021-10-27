import Command from "../classes/Command";
import { config } from "../../config";
import fetch from "node-fetch";

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

const message_channel_id = "703302552594284594"
const message_message_id = "809485735060307990"

export default new Command({
    execute(interaction){
        interaction.ack({ephemeral:false}).then(() => {
            getMessage(message_channel_id, message_message_id).then((m) => {
                interaction.reply({
                    content:`${(m as any).content}\n\n[Jump to Message](https://discord.com/channels/703301751171973190/${message_channel_id}/${message_message_id})`
                })
            })  
        })
    }
})
