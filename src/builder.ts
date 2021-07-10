import { BuilderApiModule } from "../typings"
import {EventEmitter} from 'events'

interface BuilderEmitterEvents {
    'new': (userID: string) => void;
    'add':(userID: string, module: BuilderApiModule) => void;
    'remove':(userID: string, module: BuilderApiModule) => void;
    'clear': (userID: string) => void;
}

class BuilderEmitter extends EventEmitter {
    constructor() {
        super();
    }
}

declare interface BuilderEmitter {
    on<U extends keyof BuilderEmitterEvents>(
      event: U, listener: BuilderEmitterEvents[U]
    ): this;
  
    emit<U extends keyof BuilderEmitterEvents>(
      event: U, ...args: Parameters<BuilderEmitterEvents[U]>
    ): boolean;
    
    /** Get currently selected modules */
    getCurrent(userID:string)
}

/** plz work (Remove before push) */
export default BuilderEmitter