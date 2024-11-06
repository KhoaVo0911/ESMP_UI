import React, { useState, useEffect } from 'react';
import { getStorage, ref, uploadBytes, listAll, getDownloadURL } from "firebase/storage";
import { storage } from "./firebaseConfig";

function ImageUploadAndList() {
  const [folderName, setFolderName] = useState("");
  const [file, setFile] = useState(null);
  const [fileNames, setFileNames] = useState([]);

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
      alert("Upload thành công!");
      // Sau khi upload thành công, lấy lại danh sách tên file
      fetchFileNames();
    } catch (error) {
      console.error("Lỗi khi upload file:", error);
    }
  };

  // Lấy danh sách tất cả các tên file trong thư mục
  const fetchFileNames = async () => {
    if (!folderName) return;
    const listRef = ref(storage, folderName);

    try {
      const res = await listAll(listRef);
      const names = await Promise.all(
        res.items.map(async (itemRef) => {
          const url = await getDownloadURL(itemRef);
          return {
            name: itemRef.name,  // Tên file (ví dụ: foodie.jpg)
            url: url  // URL tải về của file
          };
        })
      );
      setFileNames(names);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách file:", error);
    }
  };

  // Gọi fetchFileNames mỗi khi folderName thay đổi để tải danh sách file ban đầu
  useEffect(() => {
    if (folderName) {
      fetchFileNames();
    }
  }, [folderName]);

  return (
    <div>
      <h2>Upload và Hiển Thị Tên File</h2>
      
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
      
      <h3>Danh sách file trong thư mục: {folderName}</h3>
      <ul>
        {fileNames.map((file, index) => (
          <li key={index}>
            {file.name} - <a href={file.url} download={file.name}>Download</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ImageUploadAndList;
