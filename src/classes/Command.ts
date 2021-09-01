import {Interaction} from '../../typings'
class Command {
    constructor(options:Command){
        this.execute = options.execute;
    };
    execute(interaction:Interaction){}
}
export default Command;