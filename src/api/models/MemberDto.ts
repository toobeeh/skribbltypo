/* tslint:disable */
/* eslint-disable */
/**
 * Skribbl Typo API
 * Skribbl Typo API for resources, admin tools and authentification.
 *
 * The version of the OpenAPI document: 1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { mapValues } from '../runtime';
import type { GuildDto } from './GuildDto';
import {
    GuildDtoFromJSON,
    GuildDtoFromJSONTyped,
    GuildDtoToJSON,
    GuildDtoToJSONTyped,
} from './GuildDto';

/**
 * 
 * @export
 * @interface MemberDto
 */
export interface MemberDto {
    /**
     * The member's plain bubbles
     * @type {number}
     * @memberof MemberDto
     */
    bubbles: number;
    /**
     * The member's regular drops
     * @type {number}
     * @memberof MemberDto
     */
    drops: number;
    /**
     * The member's sprite inventory
     * @type {string}
     * @memberof MemberDto
     */
    sprites: string;
    /**
     * The member's scene inventory
     * @type {string}
     * @memberof MemberDto
     */
    scenes: string;
    /**
     * The member's flag config
     * @type {number}
     * @memberof MemberDto
     */
    flags: number;
    /**
     * The member's rainbow sprite config
     * @type {string}
     * @memberof MemberDto
     */
    rainbowSprites: string;
    /**
     * The member's connected discord account id
     * @type {string}
     * @memberof MemberDto
     */
    discordID: string;
    /**
     * The member's palantir accunt user name
     * @type {string}
     * @memberof MemberDto
     */
    userName: string;
    /**
     * The member's palantir identification
     * @type {string}
     * @memberof MemberDto
     */
    userLogin: string;
    /**
     * The member's palantir identification
     * @type {Array<GuildDto>}
     * @memberof MemberDto
     */
    guilds: Array<GuildDto>;
    /**
     * The raw database member result
     * @type {object}
     * @memberof MemberDto
     */
    rawMember: object;
    /**
     * Enum array containing the flags of the member
     * @type {Array<string>}
     * @memberof MemberDto
     */
    memberFlags: Array<MemberDtoMemberFlagsEnum>;
}


/**
 * @export
 */
export const MemberDtoMemberFlagsEnum = {
    Admin: 'Admin',
    Moderator: 'Moderator',
    Patron: 'Patron',
    Patronizer: 'Patronizer',
    Booster: 'Booster',
    DropBan: 'DropBan',
    PermaBan: 'PermaBan',
    Beta: 'Beta',
    BubbleFarming: 'BubbleFarming',
    UnlimitedCloud: 'UnlimitedCloud',
    ContentModerator: 'ContentModerator',
    EmojiManagement: 'EmojiManagement'
} as const;
export type MemberDtoMemberFlagsEnum = typeof MemberDtoMemberFlagsEnum[keyof typeof MemberDtoMemberFlagsEnum];


/**
 * Check if a given object implements the MemberDto interface.
 */
export function instanceOfMemberDto(value: object): value is MemberDto {
    if (!('bubbles' in value) || value['bubbles'] === undefined) return false;
    if (!('drops' in value) || value['drops'] === undefined) return false;
    if (!('sprites' in value) || value['sprites'] === undefined) return false;
    if (!('scenes' in value) || value['scenes'] === undefined) return false;
    if (!('flags' in value) || value['flags'] === undefined) return false;
    if (!('rainbowSprites' in value) || value['rainbowSprites'] === undefined) return false;
    if (!('discordID' in value) || value['discordID'] === undefined) return false;
    if (!('userName' in value) || value['userName'] === undefined) return false;
    if (!('userLogin' in value) || value['userLogin'] === undefined) return false;
    if (!('guilds' in value) || value['guilds'] === undefined) return false;
    if (!('rawMember' in value) || value['rawMember'] === undefined) return false;
    if (!('memberFlags' in value) || value['memberFlags'] === undefined) return false;
    return true;
}

export function MemberDtoFromJSON(json: any): MemberDto {
    return MemberDtoFromJSONTyped(json, false);
}

export function MemberDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): MemberDto {
    if (json == null) {
        return json;
    }
    return {
        
        'bubbles': json['bubbles'],
        'drops': json['drops'],
        'sprites': json['sprites'],
        'scenes': json['scenes'],
        'flags': json['flags'],
        'rainbowSprites': json['rainbowSprites'],
        'discordID': json['discordID'],
        'userName': json['userName'],
        'userLogin': json['userLogin'],
        'guilds': ((json['guilds'] as Array<any>).map(GuildDtoFromJSON)),
        'rawMember': json['rawMember'],
        'memberFlags': json['memberFlags'],
    };
}

export function MemberDtoToJSON(json: any): MemberDto {
    return MemberDtoToJSONTyped(json, false);
}

export function MemberDtoToJSONTyped(value?: MemberDto | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'bubbles': value['bubbles'],
        'drops': value['drops'],
        'sprites': value['sprites'],
        'scenes': value['scenes'],
        'flags': value['flags'],
        'rainbowSprites': value['rainbowSprites'],
        'discordID': value['discordID'],
        'userName': value['userName'],
        'userLogin': value['userLogin'],
        'guilds': ((value['guilds'] as Array<any>).map(GuildDtoToJSON)),
        'rawMember': value['rawMember'],
        'memberFlags': value['memberFlags'],
    };
}

