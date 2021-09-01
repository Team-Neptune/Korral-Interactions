import Command from "../classes/Command";

export default new Command({
    execute(interaction){
        const user = 
        (interaction.data.options
            && interaction.data.options.find((o) => o.name == "user")
            && interaction.data.resolved.users[ interaction.data.options.find((o) => o.name == "user").value ])
            || (interaction.member ? interaction.member.user : interaction.user)
      const size =
        (interaction.data.options
            && interaction.data.options.find((o) => o.name == "size")
            && interaction.data.options.find((o) => o.name == "size").value)
            || "512"
      const gif =
        (interaction.data.options
            && interaction.data.options.find((o) => o.name == "gif")
            && interaction.data.options.find((o) => o.name == "gif").value)
            || false
      const avatarURL = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${gif && user.avatar.startsWith("a_") ? "gif" : "webp"}?size=${size}`
      if (user.avatar == null) {
        return interaction.reply({
            content:"This user doesn't have an avatar."
        })
      }
      interaction.reply({
          content:avatarURL
      })
    }
})