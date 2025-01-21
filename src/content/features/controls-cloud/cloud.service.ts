import { CloudApi, type MemberDto } from "@/api";
import { loggerFactory } from "@/content/core/logger/loggerFactory.interface";
import { ApiService } from "@/content/services/api/api.service";
import { type skribblImage } from "@/content/services/image-finished/image-finished.service";
import { inject, injectable } from "inversify";

@injectable()
export class CloudService{
  @inject(ApiService) private readonly _apiService!: ApiService;

  private readonly _logger;
  private _pendingAwardInventoryIds = new Set<number>();

  constructor(
    @inject(loggerFactory) loggerFactory: loggerFactory
  ) {
    this._logger = loggerFactory(this);
  }

  public async uploadToCloud(image: skribblImage, member: MemberDto, linkWithPendingAwards = false) {

    /* upload new image to cloud */
    const api =this._apiService.getApi(CloudApi);
    const uploaded = await api.uploadToUserCloud({
      login: Number(member.userLogin),
      cloudUploadDto: {
        name: image.name,
        author: image.artist,
        inPrivate: image.private,
        isOwn: image.isOwn,
        language: image.language,
        commands: image.commands,
        imageBase64: image.image.base64ApiTruncated,
      }
    });
    this._logger.debug("Image saved to cloud");

    if(linkWithPendingAwards && this._pendingAwardInventoryIds.size > 0){
      const ids = Array.from(this._pendingAwardInventoryIds);
      this._pendingAwardInventoryIds.clear();
      const linked = await Promise.all(
        ids.map(id =>
          api.linkImageToAward({login: Number(member.userLogin), token: id, id: uploaded.id}))
      );

      this._logger.info("Linked image to pending awards", linked.length);
    }
  }

  public addPendingAwardInventoryId(inventoryId: number){
    this._logger.debug("Adding pending award inventory id", inventoryId);

    this._pendingAwardInventoryIds.add(inventoryId);
  }

  public clearPendingAwardInventoryIds(){
    this._logger.debug("Clearing pending award inventory ids");

    this._pendingAwardInventoryIds.clear();
  }
}