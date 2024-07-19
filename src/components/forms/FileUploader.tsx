import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '../ui/button';
import Compressor from 'compressorjs';

type FileWithPath = File & { path?: string };
interface FileUploaderProps {
  fieldChange: (files: FileWithPath[]) => void;
  mediaURL: string;
}

interface State {
  fileURL: string;
  file: FileWithPath[];
}

const FileUploader: React.FC<FileUploaderProps> = ({ fieldChange, mediaURL }) => {
    const [state, setState] = useState<State>({ fileURL: mediaURL, file: [] });

    const onDrop = useCallback(async (acceptedFiles: FileWithPath[]) => {
        // Clear existing files state
        setState(prevState => ({
            ...prevState,
            file: [],
        }));
        
        // Process each accepted file
        for (let file of acceptedFiles) {
            try {
                // Create a new Compressor instance
                await new Compressor(file, {
                    quality: 0.35, // Set the desired compression quality
                    success(blobResult) {
                        // Convert Blob to File
                        const fileResult = new File(
                            [blobResult], // content
                            file.name, // name
                            { type: blobResult.type, lastModified: Date.now() } // options
                        ) as FileWithPath;

                        // After successful compression, update the state
                        setState(prevState => ({
                            ...prevState,
                            file: [fileResult],
                            fileURL: URL.createObjectURL(fileResult),
                        }));
                        fieldChange([fileResult]);
                    },
                    error(err) {
                        console.error('Failed to compress image:', err);
                    },
                });
            } catch (error) {
                console.error('Error processing file:', error);
            }
        }
    }, []);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.png', '.jpeg', '.jpg', '.svg', '.webp','.gif'],
            'video/*': ['.mp4', '.mpeg', '.webm']
        }
    });
  return (
    <div {...getRootProps()} className='flex flex-center flex-col bg-dark-3 rounded-xl cursor-pointer'>
      <input {...getInputProps()} className='cursor-pointer' />
      {
        state.fileURL ? (
            <>
            <div className='flex flex-1 justify-center w-full p-5 lg:p-10'>
                <img src={state.fileURL} alt="image" className='file_uploader-img' />
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