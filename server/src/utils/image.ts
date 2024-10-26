import { bucket } from "../config";
export const getFile = async (fileName: string,) => {
  try {
    const file = bucket.file(fileName);

    // Check if the file exists
    const [exists] = await file.exists();
    if (!exists) {
      return null;
    }

    // Generate a signed URL for the file
    const [url] = await file.getSignedUrl({
      action: "read",
      expires: Date.now() + 1000 * 60 * 3, // 15 minutes
      responseDisposition: "inline"
    });

    // Send the signed URL to the frontend
    return url;
  } catch (error) {
    console.error(error);
    return null;
  }
};
