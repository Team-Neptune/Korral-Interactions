import Command from "../classes/Command";

export default new Command({
    execute(interaction){
        let builder = interaction.packageBuilder.builder
        let builderStore = interaction.packageBuilder.store
        let sessionExists = builderStore.sessionExists(interaction.member?interaction.member.user.id:interaction.user.id)
        if(!sessionExists)
          builder.emit("new", interaction.member?interaction.member.user.id:interaction.user.id)
        builderStore.menuInteraction(interaction.member?interaction.member.user.id:interaction.user.id)
        interaction.packageBuilder.checkForLatestBuildApi()
        interaction.reply({
          content:`**DeepSea Custom Package Builder**\n${sessionExists?`*Your previous session has been loaded.*\n`:'*This session will expire after 15 minutes of no interaction.*\n'}Select a category below to view a list of packages you can add to your custom deepsea package.`,
          components:[
              {
                "type":1,
                "components":[
                  {
                    "type":3,
                    "custom_id":"select",
                    "options":interaction.packageBuilder.buildCategories.map(catName => {
                      return {
                        "label":catName,
                        "style":1,
                        "value":`viewcat_${catName}`,
                        "type":2
                      }
                    }),
                    "placeholder":"Select a category"
                  }
                ]
              },
              {
                "type":1,
                "components":[
                  {
                    "type":2,
                    "custom_id":`build`,
                    "style":1,
                    "label":`Build package`
                  },
                  {
                    "type":2,
                    "custom_id":`clear`,
                    "style":4,
                    "label":`Cancel session`
                  }
                ]
              }
          ],
          ephemeral:true
      })
    }
})