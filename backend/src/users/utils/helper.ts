import { ForbiddenException, Req } from '@nestjs/common';
import * as fs from 'fs';

export class Helper {
  static customFileName(@Req() req, file, cb) {
    if (file.originalname.length > 100) {
      return cb(
        new ForbiddenException(
          'File Name Should Contain Only Letters, Numbers, Underscore, Dash and Dot',
        ),
        false,
      );
    }
    let fileExtension = '';
    if (file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
      fileExtension = file.mimetype.split('/')[1];
    } else {
      return cb(
        new ForbiddenException(
          'We Support This types : [jpg, jpeg, png] for now!',
        ),
        false,
      );
    }
    const originalName = file.originalname.split('.')[0];
    cb(null, req.user['login'] + '.' + fileExtension);
  }

  static destinationPath(req, file, cb) {
    if (!fs.existsSync('./uploads')) {
      fs.mkdirSync('./uploads');
    }
    if (
      fs.existsSync(
        './uploads/' + req.user['login'] + '.' + file.mimetype.split('/')[1],
      )
    ) {
      fs.unlink(
        './uploads/' + req.user['login'] + '.' + file.mimetype.split('/')[1],
        (err) => {
          if (err) {
            // console.log(err);
            throw new ForbiddenException('Error While Uploading File!');
          }
        },
      );
    }
    cb(null, 'uploads/');
  }

  static async checkFile(filename) {
    try {
      await fs.promises.access('./uploads/' + filename);
      return true;
    } catch (error) {
      return false;
    }
  }
}
