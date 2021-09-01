import ButtonCommand from "../classes/ButtonCommand";

export default new ButtonCommand({
    checkType:"EQUALS",
    execute(interaction){
        let builder = interaction.packageBuilder.store
        if(!builder.sessionExists(interaction.member?interaction.member.user.id:interaction.user.id))
            return interaction.update({
            "content":`Your session wasn't found. It may have timed out due to no interaction after 15 minutes. Please run the /builder command to start a new session. If this is occurring multiple times, and it hasn't been 15 minutes, open an issue on the [GitHub Repo](<https://github.com/Team-Neptune/Korral-Interactions>).`,
            "components":[]
            })
        builder.menuInteraction(interaction.member?interaction.member.user.id:interaction.user.id)
        interaction.update({
            "content":`**DeepSea Custom Package Builder**\nSelect a category below to view a list of packages you can add to your custom deepsea package.`,
            "components":[
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
            ]
        })
    }
})