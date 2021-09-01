// Builder command - Clear session
import ButtonCommand from "../classes/ButtonCommand"

export default new ButtonCommand({
    checkType:"EQUALS",
    execute(interaction){
        interaction.packageBuilder.store.cancel(interaction.member?interaction.member.user.id:interaction.user.id)
        return interaction.update({
          "content":`Session has been cleared. Run the /builder command to start a new session.`,
          "components":[]
        })
    }
})