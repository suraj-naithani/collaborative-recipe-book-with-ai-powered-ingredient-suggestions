import axios from 'axios';

const cloudinaryUpload = async (image) => {
  try {
    const formData = new FormData();
    formData.append('file', image);
    formData.append('upload_preset', process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET);
    const { data } = await axios.post(process.env.REACT_APP_CLOUDINARY_API_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    if (!data.secure_url) {
      throw new Error('Cloudinary upload failed.');
    }
    return data.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload image to Cloudinary.');
  }
};

export default cloudinaryUpload;