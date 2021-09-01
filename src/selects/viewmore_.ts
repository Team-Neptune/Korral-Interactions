import { readFileSync } from "fs";
import { BuilderApiJson } from "../../typings";
import ButtonCommand from "../classes/ButtonCommand";

export default new ButtonCommand({
    checkType:"STARTS_WITH",
    execute(interaction){
        let builderStore = interaction.packageBuilder.store
        if(!builderStore.sessionExists(interaction.member?interaction.member.user.id:interaction.user.id))
            return interaction.update({
            "content":`Your session wasn't found. It may have timed out due to no interaction after 15 minutes. Please run the /builder command to start a new session. If this is occurring multiple times, and it hasn't been 15 minutes, open an issue on the [GitHub Repo](<https://github.com/Team-Neptune/Korral-Interactions>).`,
            "components":[]
            })
        let builderData:BuilderApiJson = JSON.parse(readFileSync("./buildermeta.json").toString())
        let selectedModuleName = interaction.data.values[0].split("viewmore_")[1]
        let moduleAlreadyAdded = builderStore.getCurrent(interaction.member?interaction.member.user.id:interaction.user.id).find(m => m.key == selectedModuleName)
        let options = Object.keys(builderData.modules).filter(mn => {
            return builderData.modules[mn].category == builderData.modules[selectedModuleName].category
        }).map(v => {
            return v
        })
        builderStore.menuInteraction(interaction.member?interaction.member.user.id:interaction.user.id)
        interaction.update({
            "content":`**${builderData.modules[selectedModuleName].category}** | ${builderData.modules[selectedModuleName].displayName}\nBy: ${builderData.modules[selectedModuleName].repo.split("/")[0]}\n\n${builderData.modules[selectedModuleName].description}${builderData.modules[selectedModuleName].requires.length > 0?`\n\n**Module requirements**\nEven if not selected, the following modules are required and will be added:\n- ${builderData.modules[selectedModuleName].requires.map(moduleName => builderData.modules[moduleName].displayName).join("\n- ")}`:``}\n\n${builderData.modules[selectedModuleName].required?`*${builderData.modules[selectedModuleName].displayName} is required and cannot be removed.*`:``}`,
            "components":[
                {
                    "type":1,
                    "components":[
                        {
                            "type":2,
                            "custom_id":`${moduleAlreadyAdded?`remove`:`add`}_${selectedModuleName}`,
                            "style":moduleAlreadyAdded?4:3,
                            "label":`${moduleAlreadyAdded?`Remove`:`Add`} ${builderData.modules[selectedModuleName].displayName}`,
                            "disabled":builderData.modules[selectedModuleName].required
                        },
                        {
                            "type":2,
                            "style":5,
                            "label":`GitHub`,
                            "url":`https://github.com/${builderData.modules[selectedModuleName].repo}`
                        }
                    ]
                },
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
                            "type":2,
                            "description":`${builderData.modules[moduleName].description.substr(0, 47)+"..."}`
                        }
                        }),
                        "placeholder":"Select a module to view more info"
                    }
                    ]
                },
                {
                    "type":1,
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