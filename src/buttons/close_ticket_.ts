import ButtonCommand from "../classes/ButtonCommand";

export default new ButtonCommand({
    checkType:"STARTS_WITH",
    execute(interaction){
        let ticketUserId = interaction.data.custom_id.split("close_ticket_")[1];
        let currentUserId = interaction.member.user.id;
        let threadChannelId = interaction.message.channel_id;
        if(currentUserId != ticketUserId && !interaction.member.roles.includes(interaction.internalBot.config.supportRoleId))
            return interaction.reply({
                content:`You can't close a ticket that isn't yours.`,
                ephemeral:true
            })
        interaction.reply({
            content:`<#${threadChannelId}> will be locked soon.`,
            ephemeral:true
        })
        .then(() => {
            interaction.sendMessage(threadChannelId, {
                embeds:[
                    {
                        "description":`🔒 Ticket has been closed by <@${currentUserId}>`,
                        "color":16711680
                    }
                ]
            })
            .then(() => {
                return interaction.closeSupportThread(threadChannelId, ticketUserId)
            })
        })
    }
})