import Command from "../classes/Command";

export default new Command({
    execute(interaction){
        const steps = [
            "1. Copy h2testw.exe from the h2testw .zip to your desktop",
            '2. Insert your SD card into your computer ',
            '3. Run h2testw.exe ',
            '4. Select “English” ',
            '5. Click “Select target” ',
            '6. Select your SD card’s drive letter ',
            '7. Ensure “all available space” is selected ',
            '8. Click “Write + Verify” ',
            '9. Wait until the process is completed"'
        ]
        const results = [
            '✅ = If the test shows the result Test finished without errors, your SD card is good and you can delete all .h2w files on your SD card ✅',
            '⛔ = If the test shows any other results, your SD card may be corrupted or damaged and you may have to replace it! ⛔`'
        ]
        interaction.reply({
            embeds:[
                {
                    "title":"Why should I test?",
                    "description":`It's highly suggested you test every card you use with the switch before getting overly involved with it. Why? You can't trust any namebrand or seller. Why? Because fakes can get returned to anywhere and quality control doesn't always catch them, and can simply repackage them. The only truth is test results. Don't think it's ok. Know.`
                },
                {
                    "title":"Ok then, how do I test?",
                    "description":`Download h2testw here: <https://www.heise.de/ct/Redaktion/bo/downloads/h2testw_1.4.zip>\n**Warning: Depending on the size of your SD card and the speed of your computer, this process can take up to several hours! Do it anyway.**\n\nInstructions:\n${steps.join(" - ")}\n\nResults:\n${results.join("\n")}`
                }
            ],
            // content:`**Why should I test?**\nIt's highly suggested you test every card you use with the switch before getting overly involved with it. Why? You can't trust any namebrand or seller. Why? Because fakes can get returned to anywhere and quality control doesn't always catch them, and can simply repackage them. The only truth is test results. Don't think it's ok. Know.\n\n**Ok then, how do I test?**\nDownload h2testw here: <https://www.heise.de/ct/Redaktion/bo/downloads/h2testw_1.4.zip>\n\nWarning: Depending on the size of your SD card and the speed of your computer, this process can take up to several hours! Do it anyway.\n\nInstructions:\n${steps.join("\n")}\n\nResults:\n${results.join("\n")}`
        })
    }
})