import { readFileSync } from "fs";
import Command from "../classes/Command";

export default new Command({
    execute(interaction){
        const ruleNum = interaction.data.options[0].value;
        const target = interaction.data.options[1] ? interaction.data.options[1].value : undefined;
        let rules = JSON.parse(readFileSync("./tn_rules.json").toString());
        if (!rules[`${ruleNum}`])
          return interaction.reply({
              content:`**Invalid rule**\nRule not found.`
          });
        const rule = rules[`${ruleNum}`];
        interaction.reply({
            content:`${target ? `*Target: <@${target}>*\n` : ``}**${rule.title}**\n${rule.content}`,
            allowed_mentions:target ? { users: [target] } : undefined
        });
    }
})