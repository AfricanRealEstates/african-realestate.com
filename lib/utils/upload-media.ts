import firebaseApp from "../firebase";
import { getDownloadURL, getStorage, ref, uploadBytes, deleteObject } from "firebase/storage";
import heic2any from "heic2any";

const convertHEICToJPG = async (file: File): Promise<File> => {
  if (file.type === "image/heic" || file.type === "image/heif") {
    const convertedBlobOrBlobs = await heic2any({ blob: file, toType: "image/jpeg" });

    // Check if the result is a single Blob or an array of Blobs
    const convertedBlob = Array.isArray(convertedBlobOrBlobs)
      ? convertedBlobOrBlobs[0] // Take the first blob if it's an array
      : convertedBlobOrBlobs; // Otherwise, it's a single blob

    // Create a new File object from the Blob
    const newFileName = file.name.replace(/\.[^/.]+$/, ".jpg"); // Change extension to .jpg
    const convertedFile = new File([convertedBlob], newFileName, {
      type: "image/jpeg",
      lastModified: file.lastModified,
    });

    return convertedFile;
  }

  // If not HEIC/HEIF, return the original file
  return file;
};

export const uploadFilesToFirebase = async (files: File[]) => {
  try {
    const storage = getStorage(firebaseApp);

    // Convert HEIC files to JPG before upload
    const convertedFiles = await Promise.all(
      files?.map(async (file: File) => {
        const convertedFile = await convertHEICToJPG(file);
        return convertedFile;
      }) || []
    );

    const uploadedFilesRefs = await Promise.all(
      convertedFiles.map((file: File) => {
        const storageRef = ref(storage, `/images/${file.name}`);
        return uploadBytes(storageRef, file);
      })
    );

    const uploadedFilesDownloadedUrls = await Promise.all(
      uploadedFilesRefs.map((res) => {
        return getDownloadURL(res.ref);
      })
    );

    return uploadedFilesDownloadedUrls;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const uploadSingleFileToFirebase = async (file: File) => {
  try {
    const storage = getStorage(firebaseApp);

    // Convert HEIC to JPG if necessary
    const convertedFile = await convertHEICToJPG(file);

    const storageRef = ref(storage, `/images/${convertedFile.name}`);
    const snapshot = await uploadBytes(storageRef, convertedFile);
    const downloadURL = await getDownloadURL(snapshot.ref);

    return downloadURL;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const deleteFileFromFirebase = async (fileUrl: string) => {
  try {
    const storage = getStorage(firebaseApp);
    const fileRef = ref(storage, fileUrl);
    await deleteObject(fileRef);
  } catch (error: any) {
    throw new Error(`Failed to delete file: ${error.message}`);
  }
};