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


import * as runtime from '../runtime';
import type {
  SpriteComboDto,
  SpriteInventoryDto,
  SpriteSlotCountDto,
  SpriteSlotDto,
} from '../models/index';
import {
    SpriteComboDtoFromJSON,
    SpriteComboDtoToJSON,
    SpriteInventoryDtoFromJSON,
    SpriteInventoryDtoToJSON,
    SpriteSlotCountDtoFromJSON,
    SpriteSlotCountDtoToJSON,
    SpriteSlotDtoFromJSON,
    SpriteSlotDtoToJSON,
} from '../models/index';

export interface GetMemberSpriteInventoryRequest {
    login: number;
}

export interface GetMemberSpriteSlotCountRequest {
    login: number;
}

export interface SetMemberSpriteComboRequest {
    login: number;
    spriteComboDto: SpriteComboDto;
}

export interface SetMemberSpriteSlotRequest {
    login: number;
    spriteSlotDto: SpriteSlotDto;
}

/**
 * 
 */
export class InventoryApi extends runtime.BaseAPI {

    /**
     *   Required Roles: Moderator - Role override if {login} matches the client login.  Rate limit default: 30 Requests / 60000 ms TTL
     * Get all sprites in the inventory of a member
     */
    async getMemberSpriteInventoryRaw(requestParameters: GetMemberSpriteInventoryRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Array<SpriteInventoryDto>>> {
        if (requestParameters['login'] == null) {
            throw new runtime.RequiredError(
                'login',
                'Required parameter "login" was null or undefined when calling getMemberSpriteInventory().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("bearer", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/member/{login}/inventory/sprites`.replace(`{${"login"}}`, encodeURIComponent(String(requestParameters['login']))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(SpriteInventoryDtoFromJSON));
    }

    /**
     *   Required Roles: Moderator - Role override if {login} matches the client login.  Rate limit default: 30 Requests / 60000 ms TTL
     * Get all sprites in the inventory of a member
     */
    async getMemberSpriteInventory(requestParameters: GetMemberSpriteInventoryRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Array<SpriteInventoryDto>> {
        const response = await this.getMemberSpriteInventoryRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     *   Required Roles: Moderator - Role override if {login} matches the client login.  Rate limit default: 30 Requests / 60000 ms TTL
     * Get the amount of unlocked sprite slots of a member
     */
    async getMemberSpriteSlotCountRaw(requestParameters: GetMemberSpriteSlotCountRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<SpriteSlotCountDto>> {
        if (requestParameters['login'] == null) {
            throw new runtime.RequiredError(
                'login',
                'Required parameter "login" was null or undefined when calling getMemberSpriteSlotCount().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("bearer", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/member/{login}/inventory/sprites/slots`.replace(`{${"login"}}`, encodeURIComponent(String(requestParameters['login']))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => SpriteSlotCountDtoFromJSON(jsonValue));
    }

    /**
     *   Required Roles: Moderator - Role override if {login} matches the client login.  Rate limit default: 30 Requests / 60000 ms TTL
     * Get the amount of unlocked sprite slots of a member
     */
    async getMemberSpriteSlotCount(requestParameters: GetMemberSpriteSlotCountRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<SpriteSlotCountDto> {
        const response = await this.getMemberSpriteSlotCountRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     *   Required Roles: Moderator - Role override if {login} matches the client login.  Rate limit default: 30 Requests / 60000 ms TTL
     * Set the sprite combo of a member
     */
    async setMemberSpriteComboRaw(requestParameters: SetMemberSpriteComboRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters['login'] == null) {
            throw new runtime.RequiredError(
                'login',
                'Required parameter "login" was null or undefined when calling setMemberSpriteCombo().'
            );
        }

        if (requestParameters['spriteComboDto'] == null) {
            throw new runtime.RequiredError(
                'spriteComboDto',
                'Required parameter "spriteComboDto" was null or undefined when calling setMemberSpriteCombo().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("bearer", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/member/{login}/inventory/sprites/combo`.replace(`{${"login"}}`, encodeURIComponent(String(requestParameters['login']))),
            method: 'PATCH',
            headers: headerParameters,
            query: queryParameters,
            body: SpriteComboDtoToJSON(requestParameters['spriteComboDto']),
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     *   Required Roles: Moderator - Role override if {login} matches the client login.  Rate limit default: 30 Requests / 60000 ms TTL
     * Set the sprite combo of a member
     */
    async setMemberSpriteCombo(requestParameters: SetMemberSpriteComboRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.setMemberSpriteComboRaw(requestParameters, initOverrides);
    }

    /**
     *   Required Roles: Moderator - Role override if {login} matches the client login.  Rate limit default: 30 Requests / 60000 ms TTL
     * Set a sprite slot of a member
     */
    async setMemberSpriteSlotRaw(requestParameters: SetMemberSpriteSlotRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters['login'] == null) {
            throw new runtime.RequiredError(
                'login',
                'Required parameter "login" was null or undefined when calling setMemberSpriteSlot().'
            );
        }

        if (requestParameters['spriteSlotDto'] == null) {
            throw new runtime.RequiredError(
                'spriteSlotDto',
                'Required parameter "spriteSlotDto" was null or undefined when calling setMemberSpriteSlot().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("bearer", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/member/{login}/inventory/sprites/slot`.replace(`{${"login"}}`, encodeURIComponent(String(requestParameters['login']))),
            method: 'PATCH',
            headers: headerParameters,
            query: queryParameters,
            body: SpriteSlotDtoToJSON(requestParameters['spriteSlotDto']),
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     *   Required Roles: Moderator - Role override if {login} matches the client login.  Rate limit default: 30 Requests / 60000 ms TTL
     * Set a sprite slot of a member
     */
    async setMemberSpriteSlot(requestParameters: SetMemberSpriteSlotRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.setMemberSpriteSlotRaw(requestParameters, initOverrides);
    }

}
