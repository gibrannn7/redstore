<?php

namespace App\Traits;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

trait FileUpload
{
    /**
     * Upload a file to storage.
     */
    protected function uploadFile(UploadedFile $file, string $directory = 'uploads', string $disk = 'public'): string
    {
        $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();
        $path = $file->storeAs($directory, $filename, $disk);
        
        return Storage::disk($disk)->url($path);
    }

    /**
     * Upload multiple files to storage.
     */
    protected function uploadMultipleFiles(array $files, string $directory = 'uploads', string $disk = 'public'): array
    {
        $uploadedFiles = [];

        foreach ($files as $file) {
            if ($file instanceof UploadedFile) {
                $uploadedFiles[] = $this->uploadFile($file, $directory, $disk);
            }
        }

        return $uploadedFiles;
    }

    /**
     * Delete a file from storage.
     */
    protected function deleteFile(string $url, string $disk = 'public'): bool
    {
        $path = str_replace(Storage::disk($disk)->url(''), '', $url);
        
        if (Storage::disk($disk)->exists($path)) {
            return Storage::disk($disk)->delete($path);
        }

        return false;
    }

    /**
     * Delete multiple files from storage.
     */
    protected function deleteMultipleFiles(array $urls, string $disk = 'public'): void
    {
        foreach ($urls as $url) {
            $this->deleteFile($url, $disk);
        }
    }
}
