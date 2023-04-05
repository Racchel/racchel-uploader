import { useEffect, useState } from "react";
import axios from "axios";
import fs from "fs/promises";
import path from "path";
import Link from "next/link";


const Home = ({ dirs }) => {
  const [uploading, setUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState();

  useEffect(() => {
  }, [selectedFile, selectedImage, uploading])

  const handleUpload = async () => {
    setUploading(true);
    try {
      if (!selectedFile) {
        alert('Você precisa selecionar uma imagem')
        setUploading()
        return
      };
      const formData = new FormData();
      formData.append("myImage", selectedFile);
      const { data } = await axios.post("/api/image", formData);
      alert('Tudo certo')
      setSelectedImage(null)
      selectedFile(null)
      console.log(data);
    } catch (error) {
      console.log(error.response?.data);
    }
    setUploading(false);
  };

  return (
    <div style={{ width: '100%', height: '100vh', margin: '0 auto', display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
      <div style={{ width: '50%', height: '50vh', display: 'flex',flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 20 }}> 
          <label>
            <input
              type="file"
              hidden
              onChange={({ target }) => {
                if (target.files) {
                  const file = target.files[0];
                  setSelectedImage(URL.createObjectURL(file));
                  setSelectedFile(file);
                }
              }}
            />
            <div style={{ border: '1px solid red', padding: '5px'}}> 
              {selectedImage ? (
                <img src={selectedImage} alt="" style={{ maxWidth: '100px'}} />
              ) : (
                <span>Select Image</span>
              )}
            </div>
          </label>

          <button
            onClick={handleUpload}
            disabled={uploading}
            style={{ opacity: uploading ? ".5" : "1" }}
          >
            {uploading ? "Uploading.." : "Fazer Upload"}
          </button>

          <div>  
            <p>Lista de imagens:</p>
            <ul>
             {dirs.map((item) => (
                <li>
                  <Link key={item} href={"/images/" + item}>{item}</Link>
                </li>
              ))}
           </ul>
          </div>
      </div>
    </div>
  );
};
export const getServerSideProps = async () => {
  const props = { dirs: [] };
  try {
    const dirs = await fs.readdir(path.join(process.cwd(), "/public/images"));
    props.dirs = dirs;
    return { props };
  } catch (error) {
    return { props };
  }
};

export default Home;