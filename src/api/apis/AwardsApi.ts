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
  AwardDto,
} from '../models/index';
import {
    AwardDtoFromJSON,
    AwardDtoToJSON,
} from '../models/index';

/**
 * 
 */
export class AwardsApi extends runtime.BaseAPI {

    /**
     *   Required Roles: None  Rate limit default: 10 Requests / 60000 ms TTL
     * Get all awards
     */
    async getAllAwardsRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Array<AwardDto>>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/awards`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(AwardDtoFromJSON));
    }

    /**
     *   Required Roles: None  Rate limit default: 10 Requests / 60000 ms TTL
     * Get all awards
     */
    async getAllAwards(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Array<AwardDto>> {
        const response = await this.getAllAwardsRaw(initOverrides);
        return await response.value();
    }

}
