import Command from "../classes/Command";

export default new Command({
    execute(interaction){
        interaction.reply({
            "content":`Ready to open tickets from <#${interaction.channel_id}>`,
            "ephemeral":true
        }).then(() => {
            interaction.sendMessage(interaction.internalBot.config.supportChannelId, {
                content:"**Check for your issue**\nBefore opening a ticket, check the thread menu <:thread:893969529212928080>, and check the archived tab.\n\n**If you can't find your issue**\nClick the button below **or** run `/ticket` slash command in any other channel to open a support ticket.\n\n**Want to help others?**\nOpen the thread menu <:thread:893969529212928080> and search/go through the Active threads for people needing help. Please only join a thread if you intend to provide support.",
                components:[
                    {
                        type:1,
                        components:[
                            {
                                "custom_id":`open_ticket`,
                                "label":"Open Support Ticket",
                                "type":2,
                                "style":2
                            }
                        ]
                    }
                ]
            }).then(r => r.json()).then(console.log)
        })
    }
})