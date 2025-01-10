'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, X } from 'lucide-react';
import type React from 'react';
import { useRef, useState } from 'react';

interface VideoFile extends File {
  preview?: string;
}
const mbDataSize: number = 100;

export default function VideoUploadView() {
  const [selectedFile, setSelectedFile] = useState<VideoFile | null>(null);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setError('');

    if (file) {
      if (!file.type.startsWith('video/')) {
        setError('動画ファイルのみアップロード可能です');
        return;
      }

      if (file.size > mbDataSize * 1024 * 1024) {
        setError(
          `ファイルサイズが大きすぎます。${mbDataSize}MB以下のファイルを選択してください`,
        );
        return;
      }

      const videoFile: VideoFile = file;
      videoFile.preview = URL.createObjectURL(file);
      setSelectedFile(videoFile);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const file = event.dataTransfer.files[0];
    if (file) {
      const input = fileInputRef.current;
      if (input) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        input.files = dataTransfer.files;
        const changeEvent = new Event('change', { bubbles: true });
        input.dispatchEvent(changeEvent);
      }
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const removeFile = () => {
    if (selectedFile?.preview) {
      URL.revokeObjectURL(selectedFile.preview);
    }
    setSelectedFile(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card className='w-full max-w-2xl mx-auto'>
      <CardContent className='p-6'>
        <div
          className='border-2 border-dashed border-gray-300 rounded-lg p-6 text-center'
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          {!selectedFile ? (
            <_VideoUploadSection
              fileInputRef={fileInputRef}
              mbDataSize={mbDataSize}
            />
          ) : (
            <_VideoPreviewSection
              selectedFile={selectedFile}
              onRemove={removeFile}
            />
          )}
          <input
            ref={fileInputRef}
            type='file'
            accept='video/*'
            onChange={handleFileSelect}
            className='hidden'
          />
        </div>
        {error && <AlertMessage error={error} />}
      </CardContent>
    </Card>
  );
}

interface VideoPreviewSectionProps {
  selectedFile: VideoFile;
  onRemove: () => void;
}

const _VideoPreviewSection: React.FC<VideoPreviewSectionProps> = ({
  selectedFile,
  onRemove,
}) => {
  return (
    <div className='space-y-4'>
      <div className='relative aspect-video'>
        <video
          src={selectedFile.preview}
          controls
          className='w-full h-full rounded'
        >
          <track
            kind='captions'
            srcLang='en'
            label='English captions'
            src='/path/to/captions.vtt'
            default
          />
        </video>
        <Button
          variant='destructive'
          size='icon'
          className='absolute top-2 right-2'
          onClick={onRemove}
        >
          <X className='h-4 w-4' />
        </Button>
      </div>
      <p className='text-sm text-gray-500'>
        {selectedFile.name} ({(selectedFile.size / (1024 * 1024)).toFixed(2)}{' '}
        MB)
      </p>
    </div>
  );
};

interface VideoUploadSectionProps {
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  mbDataSize: number;
}

const _VideoUploadSection: React.FC<VideoUploadSectionProps> = ({
  fileInputRef,
  mbDataSize,
}) => {
  return (
    <div className='space-y-4'>
      <div className='flex justify-center'>
        <Upload className='h-12 w-12 text-gray-400' />
      </div>
      <div>
        <p className='text-lg font-medium'>ここに動画をドラッグ＆ドロップ</p>
        <p className='text-sm text-gray-500'>または</p>
        <Button
          onClick={() => fileInputRef.current?.click()}
          variant='outline'
          className='mt-2'
        >
          ファイルを選択
        </Button>
      </div>
      <p className='text-sm text-gray-500'>{mbDataSize}MB以下の動画ファイル</p>
    </div>
  );
};

interface errorMessageProps {
  error: string;
}

const AlertMessage: React.FC<errorMessageProps> = ({ error }) => {
  return (
    <div>
      <Alert variant='destructive' className='mt-4'>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    </div>
  );
};
