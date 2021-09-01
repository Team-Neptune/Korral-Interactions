import Command from "../classes/Command";

export default new Command({
    execute(interaction){
        let builderData = interaction.packageBuilder.builderData
        let categories = []
        Object.keys(builderData.modules).forEach(mn => {
          if(!categories.includes(builderData.modules[mn].category))
            categories.push(builderData.modules[mn].category)
        })
        let options = Object.keys(builderData.modules).filter(mn => {
          return builderData.modules[mn].category == interaction.data.values[0].split("viewcat_")[1]
        }).map(v => {
          return v
        })
        interaction.packageBuilder.store.menuInteraction(interaction.member?interaction.member.user.id:interaction.user.id)
        interaction.update({
          "content":`**${interaction.data.values[0].split("viewcat_")[1]}**`,
          "components":[
            {
              "type":1,
              "components":[
                {
                  "type":3,
                  "custom_id":"select",
                  "options":options.map(moduleName => {
                    return {
                      "label":builderData.modules[moduleName].displayName,
                      "style":1,
                      "value":`viewmore_${moduleName}`,
                      "description":`${builderData.modules[moduleName].description.length > 50?builderData.modules[moduleName].description.substr(0, 47)+"...":builderData.modules[moduleName].description}`,
                      "type":2
                    }
                  }),
                  "placeholder":"Select a module to view more info"
                }
              ]
            },
            {
              'type':1,
              "components":[
                {
                  "type":2,
                  "custom_id":`viewcats`,
                  "style":2,
                  "label":`Return to category list`
                },
                {
                  "type":2,
                  "custom_id":`build`,
                  "style":1,
                  "label":`Build package`
                }
              ]
            }
          ],
          "flags":64
        })
    }
})