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
 * @interface SpriteSlotCountDto
 */
export interface SpriteSlotCountDto {
    /**
     * The amount of unlocked srite slots
     * @type {number}
     * @memberof SpriteSlotCountDto
     */
    unlockedSlots: number;
}

/**
 * Check if a given object implements the SpriteSlotCountDto interface.
 */
export function instanceOfSpriteSlotCountDto(value: object): value is SpriteSlotCountDto {
    if (!('unlockedSlots' in value) || value['unlockedSlots'] === undefined) return false;
    return true;
}

export function SpriteSlotCountDtoFromJSON(json: any): SpriteSlotCountDto {
    return SpriteSlotCountDtoFromJSONTyped(json, false);
}

export function SpriteSlotCountDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): SpriteSlotCountDto {
    if (json == null) {
        return json;
    }
    return {
        
        'unlockedSlots': json['unlockedSlots'],
    };
}

export function SpriteSlotCountDtoToJSON(value?: SpriteSlotCountDto | null): any {
    if (value == null) {
        return value;
    }
    return {
        
        'unlockedSlots': value['unlockedSlots'],
    };
}
