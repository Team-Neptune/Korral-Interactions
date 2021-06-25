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
    options?:Array<ApplicationCommandInteractionDataOption>,
    custom_id?:string,
    component_type:1 | 2
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
    roles:Array<string>,
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
    message?:""
}

export interface InteractionResponse {
    type?:number,
    data?:InteractionResponse,
    content?: string,
    components?: Array<InteractionButton>,
    allowed_mentions?: {
      parse: Array<string>
    },
    embeds?:Array<any>
}

interface ButtonConfig {
    label:string,
    message:string,
    custom_id:string,
    alreadyVotedMessage:string
}

interface InteractionButton {
    type:1 | 2,
    style?: 1 | 2 | 3 | 4 |5,
    label?:string,
    emoji?:{},
    custom_id?:string,
    url?:string,
    disabled?:boolean,
    components?:Array<InteractionButton>
}

export interface Config {
    public_key:string,
    port?:number,
    bot_token:string
}

export interface GitHubRelease {
    tag_name:string,
    published_at:Date,
    assets:any
}


export interface DeepseaDb {
    lastFetchDate:number,
    releaseApi:Array<GitHubRelease>
}