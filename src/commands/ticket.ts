import Command from "../classes/Command";

export default new Command({
    execute(interaction){
        // 1-90 char only
        let topic = interaction.data.options.find(o => o.name == "topic");
        let supportRoleOnly = interaction.data.options.find(o => o.name == "private") && interaction.data.options.find(o => o.name == "private").value || false;
        let threadStarter = interaction.member.user.id;
        if(topic.value.length > 90 || topic.value.length < 1)
            return interaction.reply({
                content:`Topic must be 1-90 characters`,
                ephemeral:true
            })
        interaction.ack({
            "ephemeral":true
        }).then(() => {
            interaction.createSupportThread(topic.value, threadStarter, supportRoleOnly)
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
                        `Hey <@${threadStarter}>,\n<@&${interaction.internalBot.config.supportRoleId}> will be here to support you shortly. In the meantime, to make it easier for us and others help you with your issue, please tell us a few things about your setup, like:\n\n- Firmware and CFW / Atmosphere / DeepSea version\n- Do you use hekate or fusee-primary?\n- If you have an error screen with ID or code, what does it say? A screenshot/picture could be helpful.\n- What, if anything, have you tried to fix the issue?\n\n*(Disclaimer: You may not receive an answer instantly. Many of us have lives outside of Discord and will respond whenever we're able to, whenever that is.)*\n${supportRoleOnly?"\n*This is a private ticket, so only staff may reply.*":""}`,
                        "components":[
                            {
                                "type":1,
                                "components":[
                                    {
                                        "type":2,
                                        "style":2,
                                        "custom_id":`close_ticket_${threadStarter}`,
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
            .catch(err => {
                if(typeof err == "string")
                  interaction.reply({
                      content:err,
                      ephemeral:true
                  })
            })
        })
    }
})