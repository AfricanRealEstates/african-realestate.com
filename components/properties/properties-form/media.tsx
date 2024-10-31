"use client";

import React, { useState, useEffect } from "react";
import { PropertiesFormStepProps } from "./index";
import { Button, Form, Input, Modal, Upload, Spin, Checkbox } from "antd";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { uploadFilesToFirebase } from "@/lib/utils/upload-media";
import { addProperty, editProperty } from "@/actions/properties";
import { toast } from "sonner";
import { Icons } from "@/components/globals/icons";
import { surroundingFeatures } from "@/constants";
import { EyeIcon, TrashIcon } from "lucide-react";

export default function Media({
  currentStep,
  setCurrentStep,
  finalValues,
  setFinalValues,
  loading,
  setLoading,
  isEdit = false,
}: PropertiesFormStepProps) {
  const [tempFiles, setTempFiles] = useState<any[]>([]);
  const [coverPhotos, setCoverPhotos] = useState<string[]>([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [coverPhotoLoading, setCoverPhotoLoading] = useState(false);
  const [otherPhotosLoading, setOtherPhotosLoading] = useState(false);

  const { id }: any = useParams();
  const router = useRouter();

  useEffect(() => {
    if (isEdit && id) {
      setCoverPhotos(finalValues.media?.coverPhotos || []);
      setTempFiles(
        (finalValues.media?.images || []).filter(
          (img: string) =>
            img !== "" && !finalValues.media?.coverPhotos.includes(img)
        )
      );
    } else if (finalValues.media) {
      setCoverPhotos(finalValues.media.coverPhotos || []);
      setTempFiles(
        (finalValues.media.images || []).filter(
          (img: string) =>
            img !== "" && !finalValues.media?.coverPhotos.includes(img)
        )
      );
    }
  }, [isEdit, id, finalValues]);

  const onSubmit = async (values: any) => {
    try {
      setLoading(true);

      const tempFinalValues = {
        ...finalValues,
        amenities: values,
        media: {
          newlyUploadFiles: tempFiles,
          coverPhotos: coverPhotos,
          images: finalValues.media.images,
        },
        surroundingFeatures: values.surroundingFeatures || [],
        videoLink: values.videoLink || "",
      };

      const tempMedia = tempFinalValues.media;
      const newImagesURLs = await uploadFilesToFirebase(
        tempMedia.newlyUploadFiles
      );
      tempMedia.images = [
        ...new Set([...tempMedia.images, ...newImagesURLs]),
      ].filter((img) => img !== "" && !tempMedia.coverPhotos.includes(img));

      const newCoverPhotosURLs = await uploadFilesToFirebase(
        tempMedia.coverPhotos.filter(
          (photo: string) => typeof photo !== "string"
        )
      );
      tempMedia.coverPhotos = [
        ...new Set([
          ...tempMedia.coverPhotos.filter(
            (photo: string) => typeof photo === "string"
          ),
          ...newCoverPhotosURLs,
        ]),
      ].slice(0, 1);

      tempFinalValues.media = tempMedia;

      const savedValues = {
        ...tempFinalValues.basicInfo,
        images: tempFinalValues.media.images,
        coverPhotos: tempFinalValues.media.coverPhotos,
        surroundingFeatures: tempFinalValues.surroundingFeatures,
        videoLink: tempFinalValues.videoLink,
      };

      let res = null;
      if (isEdit) {
        res = await editProperty(id, savedValues);
      } else {
        res = await addProperty(savedValues);
      }
      if (res.error) throw new Error(res.error);

      toast.success(
        isEdit ? "Edit saved successfully" : "Property added successfully"
      );
      router.push(`/agent/properties`);
    } catch (error: any) {
      toast.error("Failed to create property");
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => setPreviewVisible(false);

  const handlePreview = async (file: any) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };

  const getBase64 = (file: any) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const handleCoverPhotoRemove = () => {
    setCoverPhotos([]);
    setFinalValues({
      ...finalValues,
      media: {
        ...finalValues.media,
        coverPhotos: [],
      },
    });
  };

  const handleOtherPhotoRemove = (image: string) => {
    let tempMedia = { ...finalValues.media };
    tempMedia.images = tempMedia.images.filter((img: string) => img !== image);
    setFinalValues({
      ...finalValues,
      media: {
        ...tempMedia,
        newlyUploadedFiles: tempFiles,
      },
    });
  };

  return (
    <Form
      layout="vertical"
      onFinish={onSubmit}
      initialValues={{
        surroundingFeatures: finalValues.surroundingFeatures,
        videoLink: finalValues.videoLink,
        ...finalValues,
      }}
    >
      <h2 className="text-lg font-medium my-4 text-blue-600">
        Cover Photo (1 only)
      </h2>
      <div className="mb-4">
        {coverPhotos.length > 0 && (
          <div className="mb-4 relative">
            <Image
              src={coverPhotos[0]}
              alt="Cover Photo"
              width={200}
              height={150}
              className="object-cover rounded-md relative"
            />
            <button
              onClick={handleCoverPhotoRemove}
              className="absolute top-2 left-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors z-10"
            >
              <TrashIcon className="w-4 h-4 text-red-500" />
            </button>
          </div>
        )}
        <Upload
          listType="picture-card"
          fileList={[]}
          maxCount={1}
          onPreview={handlePreview}
          beforeUpload={(file: any) => {
            if (coverPhotos.length < 1) {
              setCoverPhotoLoading(true);
              getBase64(file).then((base64: string) => {
                setCoverPhotos([base64]);
                setCoverPhotoLoading(false);
              });
            } else {
              toast.error("You can only upload 1 cover photo");
            }
            return false;
          }}
        >
          {coverPhotoLoading ? (
            <Spin />
          ) : (
            coverPhotos.length === 0 && "Upload Cover Photo"
          )}
        </Upload>
      </div>

      <h2 className="text-lg font-medium my-4 text-blue-600">
        Other Photos (max. 29 photos)
      </h2>
      <section className="flex flex-wrap gap-5 mb-5">
        {finalValues.media.images.map((image: string) => (
          <div key={image} className="relative">
            <Image
              height={100}
              width={100}
              src={image}
              alt=""
              className="object-cover rounded-md"
            />
            <button
              onClick={() => handleOtherPhotoRemove(image)}
              className="absolute top-1 right-1 p-1 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
            >
              <TrashIcon className="w-3 h-3 text-red-500" />
            </button>
          </div>
        ))}
      </section>

      <Upload
        listType="picture-card"
        multiple
        onPreview={handlePreview}
        beforeUpload={(file: any) => {
          setOtherPhotosLoading(true);
          setTempFiles((prev) => [...new Set([...prev, file])]);
          setOtherPhotosLoading(false);
          return false;
        }}
      >
        {otherPhotosLoading ? <Spin /> : "Upload Property Photos"}
      </Upload>

      <Modal
        open={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <img alt="Photo Preview" style={{ width: "100%" }} src={previewImage} />
      </Modal>

      <h2 className="text-lg font-medium my-8 text-blue-600">
        Surrounding Features/Amenities (Within 2KM Radius)
      </h2>
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-x-4 gap-y-2">
        <Form.Item
          name="surroundingFeatures"
          label=""
          rules={[
            { required: true, message: "Surrounding Features are required" },
          ]}
          className="flex w-full items-center justify-start col-span-full gap-5"
        >
          <Checkbox.Group
            options={surroundingFeatures}
            className="w-full gap-5"
          />
        </Form.Item>
      </section>

      <h2 className="text-lg font-medium my-8 text-blue-600">
        Property Video Link (Optional)
      </h2>
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-x-4 gap-y-2">
        <Form.Item
          name="videoLink"
          label=""
          className="col-span-1"
          rules={[{ type: "url", message: "Please enter a valid URL" }]}
        >
          <Input
            placeholder="Video Link (optional)"
            type="url"
            className="border border-gray-300 rounded-md"
          />
        </Form.Item>
      </section>

      <section className="border-b border-neutral-200 w-full my-8"></section>

      <div className="flex items-center justify-end gap-5">
        <Button
          disabled={currentStep === 0}
          onClick={() => setCurrentStep(currentStep - 1)}
          className="px-6 py-3 text-center rounded-md flex items-center justify-center"
        >
          Back
        </Button>
        <button
          type="submit"
          className="inline-block cursor-pointer items-center rounded-md bg-blue-300 hover:bg-blue-400 transition-colors px-5 py-2.5 text-center font-semibold text-white"
        >
          {loading ? (
            <>
              {!isEdit ? (
                <div className="flex items-center">
                  <Icons.spinner className="size-4 animate-spin mr-2" />
                  Saving...
                </div>
              ) : (
                <div className="flex items-center">
                  <Icons.spinner className="size-4 animate-spin mr-2" />
                  Submitting...
                </div>
              )}
            </>
          ) : (
            <>{isEdit ? "Save Edited Property" : "Save Property"}</>
          )}
        </button>
      </div>
    </Form>
  );
}

// import React, { useState, useEffect } from "react";
// import { PropertiesFormStepProps } from "./index";
// import { Button, Form, Input, Modal, Upload, Spin, Checkbox } from "antd";
// import Image from "next/image";
// import { useParams, useRouter } from "next/navigation";
// import { uploadFilesToFirebase } from "@/lib/utils/upload-media";
// import { addProperty, editProperty } from "@/actions/properties";
// import { toast } from "sonner";
// import { Icons } from "@/components/globals/icons";
// import { surroundingFeatures } from "@/constants";

// export default function Media({
//   currentStep,
//   setCurrentStep,
//   finalValues,
//   setFinalValues,
//   loading,
//   setLoading,
//   isEdit = false,
// }: PropertiesFormStepProps) {
//   const [tempFiles, setTempFiles] = useState<any[]>([]);
//   const [coverPhotos, setCoverPhotos] = useState<any[]>([]);
//   const [previewVisible, setPreviewVisible] = useState(false);
//   const [previewImage, setPreviewImage] = useState("");
//   const [previewTitle, setPreviewTitle] = useState("");
//   const [coverPhotoLoading, setCoverPhotoLoading] = useState(false);
//   const [otherPhotosLoading, setOtherPhotosLoading] = useState(false);

//   const { id }: any = useParams();
//   const router = useRouter();

//   useEffect(() => {
//     if (isEdit && id) {
//       setCoverPhotos(finalValues.media.coverPhotos || []);
//       setTempFiles(finalValues.media.images || []);
//     } else if (finalValues.media) {
//       setCoverPhotos(finalValues.media.coverPhotos || []);
//       setTempFiles(finalValues.media.images || []);
//     }
//   }, [isEdit, id, finalValues]);

//   const onSubmit = async (values: any) => {
//     try {
//       setLoading(true);

//       const tempFinalValues = {
//         ...finalValues,
//         amenities: values,
//         media: {
//           newlyUploadFiles: tempFiles,
//           coverPhotos: coverPhotos,
//           images: finalValues.media.images,
//         },
//         surroundingFeatures: values.surroundingFeatures || [],
//         videoLink: values.videoLink || "",
//       };

//       const tempMedia = tempFinalValues.media;
//       const newImagesURLs = await uploadFilesToFirebase(
//         tempMedia.newlyUploadFiles
//       );
//       tempMedia.images = [...new Set([...tempMedia.images, ...newImagesURLs])]; // Prevent duplicates

//       const newCoverPhotosURLs = await uploadFilesToFirebase(
//         tempMedia.coverPhotos
//       );
//       tempMedia.coverPhotos = [...new Set(newCoverPhotosURLs)].slice(0, 3); // Prevent duplicates and limit

//       tempFinalValues.media = tempMedia;

//       const savedValues = {
//         ...tempFinalValues.basicInfo,
//         images: tempFinalValues.media.images,
//         coverPhotos: tempFinalValues.media.coverPhotos,
//         surroundingFeatures: tempFinalValues.surroundingFeatures,
//         videoLink: tempFinalValues.videoLink,
//       };

//       let res = null;
//       if (isEdit) {
//         res = await editProperty(id, savedValues);
//       } else {
//         res = await addProperty(savedValues);
//       }
//       if (res.error) throw new Error(res.error);

//       toast.success(
//         isEdit ? "Edit saved successfully" : "Property added successfully"
//       );
//       router.push(`/agent/properties`);
//     } catch (error: any) {
//       toast.error("Failed to create property");
//       console.error(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCancel = () => setPreviewVisible(false);
//   const handlePreview = async (file: any) => {
//     if (!file.url && !file.preview) {
//       file.preview = await getBase64(file.originFileObj);
//     }
//     setPreviewImage(file.url || file.preview);
//     setPreviewVisible(true);
//     setPreviewTitle(
//       file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
//     );
//   };

//   const getBase64 = (file: any) =>
//     new Promise<string>((resolve, reject) => {
//       const reader = new FileReader();
//       reader.readAsDataURL(file);
//       reader.onload = () => resolve(reader.result as string);
//       reader.onerror = (error) => reject(error);
//     });

//   const handleCoverPhotoRemove = (file: any) => {
//     const updatedCoverPhotos = coverPhotos.filter(
//       (photo) => photo.url !== file.url
//     );
//     setCoverPhotos(updatedCoverPhotos);
//     setFinalValues({
//       ...finalValues,
//       media: {
//         ...finalValues.media,
//         coverPhotos: updatedCoverPhotos,
//       },
//     });
//   };

//   const handleOtherPhotoRemove = (image: string) => {
//     let tempMedia = finalValues.media;
//     tempMedia.images = tempMedia.images.filter((img: string) => img !== image);
//     setFinalValues({
//       ...finalValues,
//       media: {
//         newlyUploadedFiles: tempFiles,
//         images: tempMedia.images,
//       },
//     });
//   };

//   return (
//     <Form
//       layout="vertical"
//       onFinish={onSubmit}
//       initialValues={{
//         surroundingFeatures: finalValues.surroundingFeatures,
//         videoLink: finalValues.videoLink,
//         ...finalValues,
//       }}
//     >
//       <h2 className="text-lg font-medium my-4 text-blue-600">
//         Cover Photo (1 only)
//       </h2>
//       <Upload
//         listType="picture-card"
//         fileList={coverPhotos.map((photo) => ({
//           ...photo,
//           uid: photo.uid || photo.url, // Ensure uid is present
//         }))}
//         maxCount={1}
//         onPreview={handlePreview}
//         onRemove={handleCoverPhotoRemove}
//         beforeUpload={(file: any) => {
//           if (coverPhotos.length < 1) {
//             setCoverPhotoLoading(true);
//             setCoverPhotos((prev) => [...prev, file]);
//             setCoverPhotoLoading(false);
//           } else {
//             toast.error("You can only upload 1 cover photo");
//           }
//           return false;
//         }}
//       >
//         {coverPhotoLoading ? <Spin /> : "Upload Cover Photo"}
//       </Upload>

//       <h2 className="text-lg font-medium my-4 text-blue-600">
//         Other Photos (max. 29 photos)
//       </h2>
//       <section className="flex flex-wrap gap-5 mb-5">
//         {finalValues.media.images.map((image: string) => (
//           <div
//             key={image}
//             className="flex flex-col gap-1 border border-dashed border-gray-400 p-2 rounded justify-center items-center"
//           >
//             <Image
//               height={70}
//               width={70}
//               src={image}
//               alt=""
//               className="object-cover"
//             />
//             <span
//               className="text-red-500 underline text-sm cursor-pointer"
//               onClick={() => handleOtherPhotoRemove(image)}
//             >
//               Delete
//             </span>
//           </div>
//         ))}
//       </section>

//       <Upload
//         listType="picture-card"
//         multiple
//         onPreview={handlePreview}
//         beforeUpload={(file: any) => {
//           setOtherPhotosLoading(true);
//           setTempFiles((prev) => [...new Set([...prev, file])]); // Prevent duplicates
//           setOtherPhotosLoading(false);
//           return false;
//         }}
//       >
//         {otherPhotosLoading ? <Spin /> : "Upload Property Photos"}
//       </Upload>

//       <Modal
//         open={previewVisible}
//         title={previewTitle}
//         footer={null}
//         onCancel={handleCancel}
//       >
//         <img alt="Cover Photo" style={{ width: "100%" }} src={previewImage} />
//       </Modal>

//       <h2 className="text-lg font-medium my-8 text-blue-600">
//         Surrounding Features/Amenities (Within 2KM Radius)
//       </h2>
//       <section className="grid grid-cols-1 lg:grid-cols-3 gap-x-4 gap-y-2">
//         <Form.Item
//           name="surroundingFeatures"
//           label=""
//           rules={[
//             {
//               required: true,
//               message: "Surrounding Features are required",
//             },
//           ]}
//           className="flex w-full items-center justify-start col-span-full gap-5"
//         >
//           <Checkbox.Group
//             options={surroundingFeatures}
//             className="w-full gap-5"
//           />
//         </Form.Item>
//       </section>

//       <h2 className="text-lg font-medium my-8 text-blue-600">
//         Property Video Link (Optional)
//       </h2>
//       <section className="grid grid-cols-1 lg:grid-cols-3 gap-x-4 gap-y-2">
//         <Form.Item
//           name="videoLink"
//           label=""
//           className="col-span-1"
//           rules={[
//             {
//               type: "url",
//               message: "Please enter a valid URL",
//             },
//           ]}
//         >
//           <Input
//             placeholder="Video Link (optional)"
//             type="url"
//             className="border border-gray-300 rounded-md"
//           />
//         </Form.Item>
//       </section>

//       <section className="border-b border-neutral-200 w-full my-8"></section>

//       <div className="flex items-center justify-end gap-5">
//         <Button
//           disabled={currentStep === 0}
//           onClick={() => setCurrentStep(currentStep - 1)}
//           className="px-6 py-3 text-center rounded-md flex items-center justify-center"
//         >
//           Back
//         </Button>
//         <button
//           type="submit"
//           className="inline-block cursor-pointer items-center rounded-md bg-blue-300 hover:bg-blue-400 transition-colors px-5 py-2.5 text-center font-semibold text-white"
//         >
//           {loading ? (
//             <>
//               {!isEdit ? (
//                 <div className="flex items-center">
//                   <Icons.spinner className="size-4 animate-spin mr-2" />
//                   Saving...
//                 </div>
//               ) : (
//                 <div className="flex items-center">
//                   <Icons.spinner className="size-4 animate-spin mr-2" />
//                   Submitting...
//                 </div>
//               )}
//             </>
//           ) : (
//             <>{isEdit ? "Save Edited Property" : "Save Property"}</>
//           )}
//         </button>
//       </div>
//     </Form>
//   );
// }
