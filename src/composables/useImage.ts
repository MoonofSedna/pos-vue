import { ref } from "vue";
import { useFirebaseStorage } from "vuefire";
import { uid } from "uid";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "@firebase/storage";

export default function useImage() {
  const storage = useFirebaseStorage();
  const imagePreview = ref("");

  const compressImage = async (
    file: File,
    { quality = 1, type = file.type }
  ) => {
    const imageBitmap = await createImageBitmap(file);

    const canvas = document.createElement("canvas");
    canvas.width = imageBitmap.width;
    canvas.height = imageBitmap.height;
    const ctx = canvas.getContext("2d");
    ctx?.drawImage(imageBitmap, 0, 0);

    const blob = (await new Promise((resolve: BlobCallback) =>
      canvas.toBlob(resolve, type, quality)
    )) as BlobPart;

    return new File([blob], file.name, {
      type: file.type,
    });
  };

  const onPreview = (e: Event) => {
    const files = (e.target as HTMLInputElement).files as FileList;
    const [file] = files;
    if (file) {
      imagePreview.value = URL.createObjectURL(file);
    }
  };

  const uploadImage = async (file: File) => {
    const compressedFile = await compressImage(file, {
      quality: 0.4,
      type: "image/webp",
    });

    const fileRef = storageRef(storage, `/products/${uid()}.webp`);

    return await uploadBytes(fileRef, compressedFile)
      .then(() => {
        return getDownloadURL(fileRef);
      })
      .catch(e => {
        console.log(e);
      });
  };

  return { uploadImage, onPreview, imagePreview };
}
