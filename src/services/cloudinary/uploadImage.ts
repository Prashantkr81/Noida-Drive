import Constants from 'expo-constants';

const CLOUDINARY_CLOUD_NAME =
  "bookrental-81";

const CLOUDINARY_UPLOAD_PRESET =
  "my_bookapp_preset";

export const uploadImage = async (
  imageUri: string,
): Promise<string> => {
  if (
    !CLOUDINARY_CLOUD_NAME ||
    !CLOUDINARY_UPLOAD_PRESET
  ) {
    throw new Error(
      'Cloudinary configuration is missing.',
    );
  }

  const formData = new FormData();

  formData.append('file', {
    uri: imageUri,
    type: 'image/jpeg',
    name: `car-${Date.now()}.jpg`,
  } as any);

  formData.append(
    'upload_preset',
    CLOUDINARY_UPLOAD_PRESET,
  );

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/bookrental-81/image/upload`,
    {
      method: 'POST',
      body: formData,
    },
  );

  if (!response.ok) {
    const errorText =
      await response.text();

    console.error(
      'CLOUDINARY ERROR:',
      errorText,
    );

    throw new Error(
      'Image upload failed.',
    );
  }

  const data = await response.json();

  if (!data.secure_url) {
    throw new Error(
      'Cloudinary did not return an image URL.',
    );
  }

  return data.secure_url;
};