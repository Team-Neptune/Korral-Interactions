// Builder command - Build Package
import ButtonCommand from "../classes/ButtonCommand";

export default new ButtonCommand({
    checkType:"EQUALS",
    execute(interaction){
        let buildUrl = interaction.packageBuilder.store.generateBuildURL(interaction.member?interaction.member.user.id:interaction.user.id)
        return interaction.update({
          "content":`Custom DeepSea package created! This command was created by TechGeekGamer#7205.\n\nIf you ran into any issues with this command, open an issue on the [GitHub Repo](<https://github.com/Team-Neptune/Korral-Interactions>)`,
          "components":[
            {
              "type":1,
              "components":[
                {
                  "type":2,
                  "style":5,
                  "url":buildUrl,
                  "label":"Download Package"
                }
              ]
            }
          ]
        })
    }
})