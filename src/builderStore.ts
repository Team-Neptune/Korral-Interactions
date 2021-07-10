import { BuilderApiModule, BuilderCategory } from "../typings";

interface UserBuildStore {
    timer:any,
    modules:BuilderApiModule[]
};

interface BuilderUserStore {
    [userID:string]:UserBuildStore
};

class BuilderStore {
    store:BuilderUserStore;
    constructor(){
        this.store = {};
    };
    /** Create a store */
    start(userID:string){
        this.store[userID] = {
            "modules":[],
            "timer":setTimeout(() => {
                this.store[userID] = undefined;
            }, 900000)
        }
    }
    /** Reset the 15 minute timeout for data storing */
    resetTimer(userID:string){
        console.log(this.store)
        clearTimeout(this.store[userID].timer)
        this.store[userID].timer = setTimeout(() => {
            this.store[userID] = undefined;
        }, 900000)
    }
    addItem(userID:string, item:BuilderApiModule){
        this.resetTimer(userID)
        this.store[userID].modules.push(item)
    }
    removeItem(userID:string, item:BuilderApiModule){
        this.resetTimer(userID)
        this.store[userID].modules = this.store[userID].modules.filter(i => i != item)
    }
    getCurrent(userID:string){
        return this.store[userID].modules
    }
    /** Delete the current user's builder store */
    cancel(userID:string){
        clearTimeout(this.store[userID].timer)
        this.store[userID] = undefined;
    };
};

export default BuilderStore;