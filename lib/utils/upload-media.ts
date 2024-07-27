import firebaseApp from "../firebase";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
export const uploadFilesToFirebase = async (files: []) => {
  try {
    const storage = getStorage(firebaseApp);
    const uploadedFilesRefs = await Promise.all(
      files?.map((file: any) => {
        const storageRef = ref(storage, `/images/${file.name}`);
        return uploadBytes(storageRef, file);
      }) || []
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

export const uploadSingleFileToFirebase = async (file: any) => {
  try {
    const storage = getStorage(firebaseApp);
    const storageRef = ref(storage, `/images/${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error: any) {
    throw new Error(error);
  }
};