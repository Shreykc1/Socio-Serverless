import React, { useCallback, useState } from 'react'
import { FileWithPath, useDropzone } from 'react-dropzone'
import { Button } from '../ui/button';


type FileUploaderProps = {
    fieldChange: (FILES: File[]) => void,
    mediaURL: string,
}

const FileUploader = ({ fieldChange, mediaURL }: FileUploaderProps) => {
    const [fileURL, setFileURL] = useState(mediaURL);
    const [file, setFile] = useState<File[]>([]);


    const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
        setFile(acceptedFiles);
        fieldChange(acceptedFiles);
        setFileURL(URL.createObjectURL(acceptedFiles[0]))
      }, [file])


      const {getRootProps, getInputProps} = useDropzone({
        onDrop,
        accept: {
            'image/*' : ['.png', '.jpeg', '.jpg','.svg','.webp'],
            'video/*' : [ '.mp4', '.mpeg', '.webm' ] 
        }
    })

  return (
    <div {...getRootProps()} className='flex flex-center flex-col bg-dark-3 rounded-xl cursor-pointer'>
      <input {...getInputProps()} className='cursor-pointer' />
      {
        fileURL ? (
            <>
            <div className='flex flex-1 justify-center w-full p-5 lg:p-10'>
                <img src={fileURL} alt="image" className='file_uploader-img' />
            </div>
                <p className='file_uploader-label'>Click or drag photo to replace</p>
            </>
        ) : ( 
            <div className='file_uploader-box'>
                <img src="/assets/icons/file-upload.svg" alt="logo" width={100} height={80} />
                <h3 className='base-medium text-light-2 mb-2 mt-6'>Drag photo's here</h3>
                <p className='text-light-4 small-regular mb-6'>PNG, JPG, SVG</p>

                <Button className="shad-button_dark_4">
                    Upload from device
                </Button>
            </div>
        )
          
      }
    </div>
  )
}

export default FileUploader