import Command from "../classes/Command";

export default new Command({
    execute(interaction){
        interaction.reply({
            "content":`Ready to open tickets from <#${interaction.internalBot.config.supportChannelId}>`,
            "ephemeral":true
        }).then(() => {
            interaction.sendMessage(interaction.internalBot.config.supportChannelId, {
                content:"**Ticket System**\n\nBefore opening a ticket, use the Discord search bar and add the `in: support` filter to look for your issue + answer.\nIf you cant find the solution to your problem, click the **Open Ticket** button below.\n\n**Want to help others?**\nClick the \"*View Open Tickets*\" button below and look under the **Public** :unlock: tickets. Feel free to view any thread, but please only join a thread if you intend to provide support.",
                components:[
                    {
                        type:1,
                        components:[
                            {
                                "custom_id":`open_ticket`,
                                "label":"Open Ticket",
                                "type":2,
                                "style":2,
                                "emoji":{
                                    "name":"🎟"
                                }
                            },
                            // {
                            //     "custom_id":`open_private_ticket`,
                            //     "label":"Open Private Ticket",
                            //     "type":2,
                            //     "style":2,
                            //     "emoji":{
                            //         "name":"🔒"
                            //     }
                            // },
                            {
                                "custom_id":`view_open_tickets`,
                                "label":"View Open Tickets",
                                "type":2,
                                "style":1,
                                "emoji":{
                                    "name":"🗒️"
                                }
                            }
                        ]
                    }
                ]
            }).then(r => r.json()).then(console.log)
        })
    }
})
