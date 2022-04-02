import server from 'express';
import multer, {diskStorage} from 'multer';
import { storeGet } from '@src/fileio/store';

export const expressStartApp = () => {
  const storage = diskStorage({
    destination: function (req, file, cb) {
      const workingAt = storeGet('workingAbsoluteDirectory') as string;
      cb(null, workingAt);
    },
    filename: function (req, file, cb) {
      (req as any).imagePath = Date.now() + file.originalname;
      cb(null, (req as any).imagePath);
    }
  });

  const upload = multer({ storage });

  const app = server();

  app.post('/upload',upload.single('image'),(req,res) => {
    res.send({
      data: {
        filePath: (req as any).imagePath,
      },
    });
  });

  const port = 12348;
  app.listen(port, () => {
    console.log(`app listening on port ${port}`);
  });
};

