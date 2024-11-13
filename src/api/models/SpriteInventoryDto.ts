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
 * @interface SpriteInventoryDto
 */
export interface SpriteInventoryDto {
    /**
     * A sprite slot number, starting at 1, or undefined if sprite is not active
     * @type {number}
     * @memberof SpriteInventoryDto
     */
    slot?: number;
    /**
     * A sprite Id
     * @type {number}
     * @memberof SpriteInventoryDto
     */
    spriteId: number;
    /**
     * A rainbow sprite color shift
     * @type {number}
     * @memberof SpriteInventoryDto
     */
    colorShift?: number;
}

/**
 * Check if a given object implements the SpriteInventoryDto interface.
 */
export function instanceOfSpriteInventoryDto(value: object): value is SpriteInventoryDto {
    if (!('spriteId' in value) || value['spriteId'] === undefined) return false;
    return true;
}

export function SpriteInventoryDtoFromJSON(json: any): SpriteInventoryDto {
    return SpriteInventoryDtoFromJSONTyped(json, false);
}

export function SpriteInventoryDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): SpriteInventoryDto {
    if (json == null) {
        return json;
    }
    return {
        
        'slot': json['slot'] == null ? undefined : json['slot'],
        'spriteId': json['spriteId'],
        'colorShift': json['colorShift'] == null ? undefined : json['colorShift'],
    };
}

export function SpriteInventoryDtoToJSON(value?: SpriteInventoryDto | null): any {
    if (value == null) {
        return value;
    }
    return {
        
        'slot': value['slot'],
        'spriteId': value['spriteId'],
        'colorShift': value['colorShift'],
    };
}
