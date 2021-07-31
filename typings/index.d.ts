interface ApplicationCommandInteractionDataOption {
    name:string,
    type:number,
    value: number | string | boolean | any,
    options?:ApplicationCommandInteractionDataOption
}

interface InteractionData {
    id:string,
    name:string,
    resolved?:any,
    options?:ApplicationCommandInteractionDataOption[],
    custom_id?:string,
    component_type:1 | 2 | 3,
    values:string[]
}

interface User {
    id:string,
    username:string,
    discriminator:string,
    avatar:string,
    bot?:boolean,
    system?:boolean,
    mfa_enabled:boolean,
    locale?:boolean,
    verified:boolean,
    email?:string,
    flags?:string
    premium_type?:number,
    public_flags?:number
}


interface InteractionMember {
    user?:User,
    nick?:string,
    roles:string[],
    joined_at:string,
    premium_since?:string,
    deaf:boolean,
    mute:boolean,
    pending?:boolean,
    permissions?:string
}

type InteractionType = 1 | 2 | 3;

export interface Interaction {
    id:string,
    application_id:string,
    type:InteractionType,
    data?:InteractionData,
    guild_id:string,
    channel_id:string,
    member?:InteractionMember,
    user?:User,
    token:string,
    version:number,
    message?:any,
    update(msg:InteractionResponse):Promise<Response>,
    reply(msg:InteractionResponse):Promise<Response>,
    ack(msg:InteractionResponse):Promise<Response>
}

export interface InteractionResponse {
    type?:number,
    data?:InteractionResponse,
    content?: string,
    components?: MessageComponent[],
    allowed_mentions?: {
      parse: string[]
    },
    embeds?:any[],
    flags?:number
}

interface ButtonConfig {
    label:string,
    message:string,
    custom_id:string,
    alreadyVotedMessage:string
}

interface MessageComponent {
    type:1 | 2 | 3,
    style?: 1 | 2 | 3 | 4 |5,
    label?:string,
    emoji?:{},
    custom_id?:string,
    url?:string,
    disabled?:boolean,
    components?:MessageComponent[],
    placeholder?:string,
    options?:MessageComponent[],
    value?:string
}

export interface Config {
    public_key:string,
    port?:number,
    bot_token:string,
    bitly_token?:string
}

export interface GitHubRelease {
    tag_name:string,
    published_at:Date,
    assets:any
}


export interface DeepseaDb {
    lastFetchDate:number,
    releaseApi:GitHubRelease[]
}

interface BuilderApiModule {
    repo:string,
    displayName:string,
    category:BuilderCategory,
    description:string,
    required:boolean,
    requires:string[],
    /** Internal string used within bot */
    key?:string
}

interface BuilderApiModules {
    [moduleName:string]:BuilderApiModule
}

interface BuilderApiJson {
    lastUpdated:number,
    modules:BuilderApiModules
}

type BuilderCategory = "CFW & Bootloaders" | "Homebrew Apps" | "Sysmodules" | "Overlays" | "Payloads" | "Addons"