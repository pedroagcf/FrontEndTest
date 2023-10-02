"use client";
import React, { useState, useEffect, ChangeEvent } from "react";

interface FileFetcherProps {}

const FileFetcher: React.FC<FileFetcherProps> = () => {
  const [dataType, setDataType] = useState<string>("");
  const [fileURL, setFileURL] = useState<string>("");
  const [fileProxy, setFileProxy] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  function onDownloadFile(blob: Blob, filename: string) {
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(blobUrl);
  }

  useEffect(() => {
    setError(null);
  }, [dataType]);

  const fetchFile = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(fileURL);
      if (!response.ok) {
        throw new Error(`Failed to fetch file (${response.status})`);
      }

      let data;
      switch (dataType) {
        case "tsv":
          let tsv = await response.text();
          let tsvBlob = new Blob([tsv], { type: "text/tab-separated-values" });

          onDownloadFile(tsvBlob, "tsv-dataset");

          break;

        case "csv":
          let csv = await response.text();
          let csvBlob = new Blob([csv], {
            type: "text/csv",
          });

          onDownloadFile(csvBlob, "csv-dataset");

          break;
        case "json":
          data = await response.text();
          const JsonBlob = new Blob([JSON.stringify(data)], {
            type: "application/json",
          });

          onDownloadFile(JsonBlob, "json-dataset");

          break;

        default:
          throw new Error("Invalid data type selected");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="container mx-auto p-4">
      <h2 className="text-lg font-semibold mb-6">Load From The Web</h2>

      <div className="mb-4">
        <label
          className="block text-gray-700 font-bold mb-2"
          htmlFor="dataType"
        >
          Data Type
        </label>
        <div className="flex">
          <label className="mr-4">
            <input
              type="radio"
              name="dataType"
              value="tsv"
              checked={dataType === "tsv"}
              onChange={() => setDataType("tsv")}
            />{" "}
            TSV
          </label>
          <label className="mr-4">
            <input
              type="radio"
              name="dataType"
              value="csv"
              checked={dataType === "csv"}
              onChange={() => setDataType("csv")}
            />{" "}
            CSV
          </label>
          <label className="mr-4">
            <input
              type="radio"
              name="dataType"
              value="json"
              checked={dataType === "json"}
              onChange={() => setDataType("json")}
            />{" "}
            JSON
          </label>
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2" htmlFor="fileURL">
          URL
        </label>
        <input
          type="text"
          id="fileURL"
          className="border rounded w-full py-2 px-3"
          value={fileURL}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setFileURL(e.target.value)
          }
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2" htmlFor="fileURL">
          PROXY
          <span className="text-xs text-gray-500 font-normal">
            {"(opcional)"}
          </span>
        </label>
        <input
          type="text"
          id="fileProxy"
          className="border rounded w-full py-2 px-3"
          value={fileProxy}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setFileProxy(e.target.value)
          }
        />
      </div>
      <div className="mb-4">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={fetchFile}
          disabled={loading || !fileURL}
        >
          Fetch File
        </button>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
};

export default FileFetcher;
