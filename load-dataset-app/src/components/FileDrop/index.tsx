"use client";

import React, { useState, useRef } from "react";

interface FileDropProps {}

const FileDrop: React.FC<FileDropProps> = () => {
  const [dragging, setDragging] = useState<boolean>(false);
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const allowedFormats = ["csv", "tsv", "xls", "xlsx", "parquet"];

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);

    const newFiles = [...e.dataTransfer.files];
    const validFiles = Array.from(newFiles).filter((file) =>
      allowedFormats.some((format) => file.name.toLowerCase().endsWith(format))
    );

    setFiles(validFiles);
    simulateUpload(validFiles);
  };

  const simulateUpload = (filesToUpload: File[]) => {
    setUploading(true);

    console.log("filesToUpload", filesToUpload);
    const totalSize = filesToUpload.reduce((acc, file) => acc + file.size, 0);
    let uploadedSize = 0;

    const uploadInterval = setInterval(() => {
      if (uploadedSize >= totalSize) {
        clearInterval(uploadInterval);
        setUploading(false);
        setUploadProgress(0);
      } else {
        const increment = Math.random() * 10;
        uploadedSize += increment;
        setUploadProgress((uploadedSize / totalSize) * 100);
      }
    }, 50);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = e.target.files;
    if (newFiles) {
      const validFiles = Array.from(newFiles).filter((file) =>
        allowedFormats.some((format) =>
          file.name.toLowerCase().endsWith(format)
        )
      );

      setFiles([...files, ...validFiles]);
      simulateUpload(validFiles);
    }
  };

  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="container mx-auto p-4">
      <p className="text-lg text-gray-700 font-bold mb-2">
        Load File
        <span className="text-xs text-gray-500 font-normal">
          {"(csv, tsv, xls, xlsx, parquet)* "}
        </span>
      </p>
      <div
        className={`bg-gray-100 border-dashed border-2 p-4 rounded-lg ${
          dragging ? "border-blue-500" : "border-gray-400"
        }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <div className="text-center">
          <input
            type="file"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileInputChange}
            multiple
            accept=".csv, .tsv, .xls, .xlsx, .parquet"
          />
          {files.length === 0 ? (
            <p className="text-gray-500">
              Drag data files here to upload, or click to select files
            </p>
          ) : uploading ? (
            <div>
              <p className="text-blue-500">Uploading files...</p>
              <div className="mt-4">
                <div className="bg-white h-2 w-full">
                  <div
                    className="bg-blue-500 h-2"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="mt-2">{`${uploadProgress.toFixed(2)}%`}</p>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-blue-500">Selected files:</p>
              <ul>
                {files.map((file, index) => (
                  <li key={index}>{file.name}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileDrop;
