"use client";
import { DATASET_URLS } from "@/utils/constants";
import React from "react";

interface DatasetFetcherProps {}

const DatasetFetcher: React.FC<DatasetFetcherProps> = () => {
  function downloadAndSaveCSV(url: string, filename: string) {
    fetch(url)
      .then((response) => response.text())
      .then((data) => {
        const blob = new Blob([data], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => {
        console.error("Error downloading CSV:", error);
      });
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-lg font-semibold mb-4">Sample Dataset</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        {DATASET_URLS.map(({ url, name }, index) => (
          <div key={index}>
            <button
              className="bg-blue-500 w-full hover:bg-blue-700 text-white font-bold p-4 rounded"
              onClick={() => downloadAndSaveCSV(url, name + ".csv")}
            >
              {name}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DatasetFetcher;
