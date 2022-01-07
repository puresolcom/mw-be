import { Injectable } from '@nestjs/common';

@Injectable()
export class UploaderService {
  // take multer file and return url
  async uploadFile(file: Express.Multer.File): Promise<any> {
    const appBaseUrl = process.env.APP_URL || 'http://localhost:3000';
    // return uploaded file url and name
    return {
      url: `${appBaseUrl}/uploader/assets/${file.filename}`,
    };
  }
}
