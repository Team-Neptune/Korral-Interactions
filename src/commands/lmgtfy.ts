import Command from "../classes/Command";

export default new Command({
    execute(interaction){
        if(!interaction.internalBot.config.bitly_token)
          return interaction.reply({
              content:"`config#bitly_token` is not provided in the config."
          })
        const searchTerm:string = interaction.data.options[0].value
        const target = interaction.data.options[1]
        let searchURL:string = `https://letmegooglethat.com/?${new URLSearchParams(`q=${searchTerm}`)}`
        fetch("https://api-ssl.bitly.com/v4/shorten", {
          "method":"POST",
          "headers":{
            "Content-Type":"application/json",
            "authorization":`Bearer ${interaction.internalBot.config.bitly_token}`
          },
          "body":JSON.stringify({
            "long_url": searchURL
          })
        })
        .then(r => {
          if(r.status == 201 || r.status == 200){
            r.json().then(j => {
              interaction.reply({
                  content:`${target?`*Target: <@${target.value}>*\n`:``}<${j.link}>`,
                  allowed_mentions:target ? { users: [target.value] } : undefined
              })
            })
          }else{
            interaction.reply({
                content:`Failed to create link. Open an issue on [GitHub](https://github.com/Team-Neptune/Korral-Interactions) if the issue persists.`
            })
            console.log(r.status)
            r.json().then(console.error)
          }
        })
    }
})