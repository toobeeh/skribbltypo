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
/**
 * 
 * @export
 * @interface EmojiDto
 */
export interface EmojiDto {
    /**
     * Emoji name
     * @type {string}
     * @memberof EmojiDto
     */
    name: string;
    /**
     * Emoji url
     * @type {string}
     * @memberof EmojiDto
     */
    url: string;
    /**
     * Whether emoji is animated or static
     * @type {boolean}
     * @memberof EmojiDto
     */
    animated: boolean;
    /**
     * Emoji name id appendix
     * @type {number}
     * @memberof EmojiDto
     */
    nameId: number;
}

/**
 * Check if a given object implements the EmojiDto interface.
 */
export function instanceOfEmojiDto(value: object): value is EmojiDto {
    if (!('name' in value) || value['name'] === undefined) return false;
    if (!('url' in value) || value['url'] === undefined) return false;
    if (!('animated' in value) || value['animated'] === undefined) return false;
    if (!('nameId' in value) || value['nameId'] === undefined) return false;
    return true;
}

export function EmojiDtoFromJSON(json: any): EmojiDto {
    return EmojiDtoFromJSONTyped(json, false);
}

export function EmojiDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): EmojiDto {
    if (json == null) {
        return json;
    }
    return {
        
        'name': json['name'],
        'url': json['url'],
        'animated': json['animated'],
        'nameId': json['nameId'],
    };
}

export function EmojiDtoToJSON(value?: EmojiDto | null): any {
    if (value == null) {
        return value;
    }
    return {
        
        'name': value['name'],
        'url': value['url'],
        'animated': value['animated'],
        'nameId': value['nameId'],
    };
}
