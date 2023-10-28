const sharp = require('sharp');
const fs = require('fs');

const imageProcessingMiddleware = (req, res, next) => {
  if (req.file) {
    const imageBuffer = req.file.buffer; // Accédez au tampon (buffer) de l'image

    sharp(imageBuffer)
      .resize({ width: 500 })
      .webp({ quality: 80 })
      .toBuffer()
      .then((outputBuffer) => {
  const timestamp = Date.now(); 
  const originalName = req.file.originalname.split('.').slice(0, -1).join('.');
  const imagePath = `images/${originalName}_${timestamp}.webp`; 
  fs.writeFile(imagePath, outputBuffer, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Une erreur est survenue lors de l\'enregistrement de l\'image.' });
    }
    req.imagePath = imagePath; // Définissez correctement req.imagePath avec le chemin de l'image enregistrée
    next();
  });
})
.catch((err) => {
  console.error(err);
  return res.status(500).json({ error: 'Une erreur est survenue lors du traitement de l\'image.' });
});
  } else {
    next();
  }
};

module.exports = imageProcessingMiddleware;



