import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export const uploadToCloudinary = async (file, folder = 'couple-album') => {
  try {
    console.log('Cloudinary upload attempt:', {
      filePath: file.path,
      folder: folder,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME ? 'SET' : 'MISSING',
      apiKey: process.env.CLOUDINARY_API_KEY ? 'SET' : 'MISSING',
      apiSecret: process.env.CLOUDINARY_API_SECRET ? 'SET' : 'MISSING'
    });

    const result = await cloudinary.uploader.upload(file.path, {
      folder: folder,
      resource_type: 'auto'
    });

    console.log('Cloudinary upload success:', {
      publicId: result.public_id,
      url: result.secure_url
    });

    return {
      url: result.secure_url,
      publicId: result.public_id
    };
  } catch (error) {
    console.error('=== CLOUDINARY UPLOAD ERROR ===');
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('Error stack:', error.stack);
    console.error('HTTP code:', error.http_code);
    console.error('===============================');
    throw new Error('Cloudinary upload failed: ' + error.message);
  }
};

export const deleteFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
    return true;
  } catch (error) {
    throw new Error('Cloudinary delete failed: ' + error.message);
  }
};

export default cloudinary;
