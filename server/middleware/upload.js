import multer from 'multer';

const storage = multer.diskStorage({
  destination: 'uploads/', // save to uploads/ folder
  filename: (_, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); //1720524909035-orders.csv
  }
});

const upload = multer({ storage }); //multer instance, use disk storage, upload.single('csv)

export default upload;