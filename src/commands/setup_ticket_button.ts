import Command from "../classes/Command";

export default new Command({
    execute(interaction){
        interaction.reply({
            "content":`Ready to open tickets from <#${interaction.internalBot.config.supportChannelId}>`,
            "ephemeral":true
        }).then(() => {
            interaction.sendMessage(interaction.internalBot.config.supportChannelId, {
                content:"**Check for your issue**\nBefore opening a ticket, check the thread menu <:threadmenu:894295426176520283> and search/scroll through the __**Archived**__ tab/button at the top of the thread menu.\n\n**If you can't find your issue**\nClick the button below **or** run `/ticket` slash command in any other channel to open a support ticket.\n\n**Want to help others?**\nOpen the thread menu <:threadmenu:894295426176520283> and search/scroll through the __**Active**__ threads for people needing help. Please only join a thread if you intend to provide support.",
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