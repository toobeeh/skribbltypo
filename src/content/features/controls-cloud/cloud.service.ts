import { CloudApi, type MemberDto } from "@/api";
import { loggerFactory } from "@/content/core/logger/loggerFactory.interface";
import { ApiService } from "@/content/services/api/api.service";
import { type skribblImage } from "@/content/services/image-finished/image-finished.service";
import { inject, injectable } from "inversify";

@injectable()
export class CloudService{
  @inject(ApiService) private readonly _apiService!: ApiService;

  private readonly _logger;

  constructor(
    @inject(loggerFactory) loggerFactory: loggerFactory
  ) {
    this._logger = loggerFactory(this);
  }

  public async uploadToCloud(image: skribblImage,member: MemberDto) {

    /* upload new image to cloud */
    await this._apiService.getApi(CloudApi).uploadToUserCloud({
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
  }
}