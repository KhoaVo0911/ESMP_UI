import React, { useState } from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./firebaseConfig";

function ImageUploadAndDisplay() {
  const [folderName, setFolderName] = useState("");
  const [file, setFile] = useState(null);
  const [downloadURL, setDownloadURL] = useState("");

  // Xử lý chọn file
  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  // Upload ảnh lên Firebase Storage
  const handleUpload = async () => {
    if (!folderName) {
      alert("Vui lòng nhập tên thư mục!");
      return;
    }
    if (!file) {
      alert("Vui lòng chọn một file ảnh!");
      return;
    }

    const storageRef = ref(storage, `${folderName}/${file.name}`);

    try {
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setDownloadURL(url);
      console.log("Upload thành công, URL tải về:", url);
    } catch (error) {
      console.error("Lỗi khi upload file:", error);
    }
  };

  return (
    <div>
      <h2>Upload và Hiển Thị Ảnh</h2>
      
      {/* Input để nhập tên thư mục */}
      <input
        type="text"
        placeholder="Nhập tên thư mục"
        value={folderName}
        onChange={(e) => setFolderName(e.target.value)}
      />
      
      {/* Input để chọn file */}
      <input type="file" onChange={handleFileChange} />
      
      {/* Nút upload */}
      <button onClick={handleUpload}>Upload</button>
      
      {/* Hiển thị ảnh đã upload và nút tải xuống */}
      {downloadURL && (
        <div>
          <p>Ảnh đã upload thành công!</p>
          <img src={downloadURL} alt="Uploaded file" style={{ width: "200px", height: "auto" }} />
          <br />
          <a href={downloadURL} download={file?.name}>
            Tải ảnh xuống
          </a>
        </div>
      )}
    </div>
  );
}

export default ImageUploadAndDisplay;
