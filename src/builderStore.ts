import {readFileSync} from 'fs'
import { BuilderApiJson, BuilderApiModule, BuilderCategory } from "../typings";

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
    start(userID:string, starterModules:BuilderApiModule[]){
        this.store[userID] = {
            "modules":starterModules || [],
            "timer":setTimeout(() => {
                this.store[userID] = undefined;
            }, 900000)
        }
    }
    /** Reset the 15 minute timeout for data storing */
    resetTimer(userID:string){
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
    menuInteraction(userID:string){
        this.resetTimer(userID)
    }
    sessionExists(userID:string){
        return this.store[userID]?true:false
    }
    generateBuildURL(userID:string){
        //Add module required modules
        this.store[userID].modules.forEach(m => {
            m.requires.forEach(mn => {
                if(!this.store[userID].modules.find(module => module.key == mn)){
                    let builderData:BuilderApiJson = /* Temp */ JSON.parse(readFileSync("./buildermeta.json").toString())
                    builderData.modules[mn].key = mn
                    this.store[userID].modules.push(builderData.modules[mn])
                }
            })
        })
        let url = "https://builder.teamneptune.net/build/";
        url = url + this.store[userID].modules.map(m => m.key).join(";");
        this.cancel(userID)
        return url;
    }
    /** Delete the current user's builder store */
    cancel(userID:string){
        clearTimeout(this.store[userID].timer)
        this.store[userID] = undefined;
    };
};

export default BuilderStore;