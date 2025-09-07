'use client'

import React, { useState } from "react";

export default function MinioUploadTest() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState("");
  const [link, setLink] = useState("");
  const [healthStatus, setHealthStatus] = useState("");

  const uploadFile = async () => {
    if (!file) {
      setStatus("⚠️ Please select a file first.");
      return;
    }

    try {
      setStatus("Requesting signed upload URL...");
      const res1 = await fetch(`http://localhost:3005/files/upload-url/${file?.name}`);
      
      if (!res1.ok) {
        throw new Error(`Upload URL request failed: ${res1.status} ${res1.statusText}`);
      }
      
      const uploadData = await res1.json();
      console.log("Upload URL response:", uploadData);

      setStatus("Uploading file directly to MinIO...");
      const uploadResponse = await fetch(uploadData.data.url, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file?.type }
      });

      if (!uploadResponse.ok) {
        throw new Error(`Upload failed: ${uploadResponse.status} ${uploadResponse.statusText}`);
      }

      setStatus("✅ Upload complete! Generating access URL...");

      const res2 = await fetch(`http://localhost:3005/files/access-url/${file?.name}`);
      
      if (!res2.ok) {
        throw new Error(`Access URL request failed: ${res2.status} ${res2.statusText}`);
      }
      
      const accessData = await res2.json();
      console.log("Access URL response:", accessData);
      
      setLink(accessData.data.url);
      setStatus("✅ File ready!");
    } catch (err) {
      console.error(err);
      setStatus("❌ Upload failed: " + (err as Error).message);
    }
  };

  const checkHealth = async () => {
    try {
      setHealthStatus("Checking MinIO health...");
      const res = await fetch(`http://localhost:3005/files/health`);
      
      if (!res.ok) {
        throw new Error(`Health check failed: ${res.status} ${res.statusText}`);
      }
      
      const healthData = await res.json();
      console.log("Health check response:", healthData);
      
      if (healthData.data.status === "healthy") {
        setHealthStatus(`✅ MinIO is healthy! Bucket exists: ${healthData.data.bucketExists}`);
      } else {
        setHealthStatus(`❌ MinIO is unhealthy: ${healthData.data.error}`);
      }
    } catch (err) {
      console.error(err);
      setHealthStatus("❌ Health check failed: " + (err as Error).message);
    }
  };

  return (
    <div style={{ fontFamily: "sans-serif", padding: "20px" }}>
      <h2>MinIO Upload Test</h2>
      
      <div style={{ marginBottom: "20px", padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }}>
        <h3>Health Check</h3>
        <button onClick={checkHealth} style={{ marginRight: "10px" }}>
          Check MinIO Health
        </button>
        <p>{healthStatus}</p>
      </div>

      <div style={{ marginBottom: "20px", padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }}>
        <h3>File Upload</h3>
        <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        <button onClick={uploadFile} style={{ marginLeft: "10px" }}>
          Upload
        </button>
        <p>{status}</p>
        {link && (
          <p>
            File available for 1h:{" "}
            <a href={link} target="_blank" rel="noopener noreferrer">
              {link}
            </a>
          </p>
        )}
      </div>
    </div>
  );
}
