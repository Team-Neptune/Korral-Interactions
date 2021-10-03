// Builder command - Build Package
import ButtonCommand from "../classes/ButtonCommand";

export default new ButtonCommand({
    checkType:"EQUALS",
    execute(interaction){
      let topic = {
        value:`${interaction.member.user.username}#${interaction.member.user.discriminator}`
      }
      if(topic.value.length > 90 || topic.value.length < 1)
          return interaction.reply({
              content:`Topic must be 1-90 characters`,
              ephemeral:true
            })

      interaction.ack({
        "ephemeral":true
      }).then(() => {
          interaction.createSupportThread(topic.value, interaction.member.user.id)
          .then(channel => {
                //   Error
              if(typeof channel == 'string')
                return interaction.reply({
                    content:channel,
                    ephemeral:true
                }).catch(console.log)
              interaction.joinThread(channel.id).then(res => {
                  interaction.sendMessage(channel.id, {
                      "content":
                      `Hey <@${interaction.member.user.id}>,\n<@&${interaction.internalBot.config.supportRoleId}> will be here to support you shortly. In the meantime, to make it easier for us and others help you with your issue, please tell us a few things about your setup, like:\n\n- Firmware and CFW / Atmosphere / DeepSea version\n- Do you use hekate or fusee-primary?\n- If you have an error screen with ID or code, what does it say? A screenshot/picture could be helpful.\n- What, if anything, have you tried to fix the issue?\n\n*(Disclaimer: You may not receive an answer instantly. Many of us have lives outside of Discord and will respond whenever we're able to, whenever that is.)*`,
                      "components":[
                        {
                            "type":1,
                            "components":[
                                {
                                    "type":2,
                                    "style":2,
                                    "custom_id":`close_ticket_${interaction.member.user.id}`,
                                    "label":"Close Ticket",
                                    "emoji":{
                                        "name":"🔒"
                                    }
                                }
                            ]
                        }
                    ]
                  }).then(r => {
                      interaction.reply({
                          content:`Ticket is ready in <#${channel.id}>`,
                          ephemeral:true
                      })
                  })
                })
            })
      })
    }
})