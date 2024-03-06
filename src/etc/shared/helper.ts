export class Helper {
    static customFileName(req, file, cb) {
      let customFile = file.originalname.split('.')[0];
      customFile =
        customFile + Date.now() + '-' + Math.round(Math.random() * 1e9);
      let fileExtenstion = '';
      if (file.mimetype.indexOf('jpeg') > -1) {
        fileExtenstion = '.jpg';
      } else if (file.mimetype.indexOf('png') > -1) {
        fileExtenstion = '.png';
      }
  
      customFile = customFile + fileExtenstion;
      cb(null, customFile);
    }
    static filePath(req, file, cb) {
      cb(null, './asset/');
    }
  }