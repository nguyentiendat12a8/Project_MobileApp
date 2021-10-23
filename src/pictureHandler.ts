import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';


export async function takePicture() {
  try {
    const cameraPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Prompt,
      quality: 100
    })
    return cameraPhoto.webPath!
  } catch (error) {
    return ''
  }
  }

