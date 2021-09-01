import {Interaction} from '../../typings'
type CustomIdCheckType = "STARTS_WITH" | "EQUALS"
class ButtonCommand {
    checkType:CustomIdCheckType
    constructor(options:ButtonCommand){
        this.checkType = options.checkType;
        this.execute = options.execute;
    };
    execute(interaction:Interaction){}
}
export default ButtonCommand;