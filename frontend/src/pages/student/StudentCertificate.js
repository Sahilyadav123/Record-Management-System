"use client";

import styled from "styled-components";
import { useState } from "react";
import { Calendar } from "lucide-react";
import { useSelector } from 'react-redux';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f4f4f4;
  padding: 16px;
`;

const Card = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 480px;
  padding: 24px;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 16px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Label = styled.label`
  font-weight: 600;
  margin-bottom: 4px;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Textarea = styled.textarea`
  width: 100%;
  min-height: 100px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Button = styled.button`
  background-color: #007bff;
  color: white;
  padding: 12px;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background-color: #0056b3;
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const ImagePreview = styled.div`
  position: relative;
  width: 100%;
  height: 150px; /* Fixed height */
  border: 1px solid #ccc;
  border-radius: 4px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: auto;
    height: 100%; /* Maintain fixed height */
    object-fit: contain; /* Ensures the image fits inside without cropping */
  }
`;


const IconWrapper = styled.div`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
`;

export default function UploadForm() {
  const {user} = useSelector((state) => state.user);
  const [preview, setPreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);
  const [desc, setDesc] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [name, setName] = useState("");
  const [data, setData] = useState({
    certificateUrl: "",
    desc: desc,
    name: name,
    issueDate: issueDate,
  });

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    console.log("Selected file:", file);
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreview(imageUrl);
    }

    return setFile(file);
  };

  const handleData = (name, value) => {
    setData({
      ...data,
      [name]: value,
    });
  };

  const uploadToCloudinary = async (file) => {
    const CLOUDINARY_URL =
      "https://api.cloudinary.com/v1_1/dlhalhe0w/image/upload";
    const CLOUDINARY_PRESET = "ml_default"; // Use your actual preset

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_PRESET);

    try {
      const response = await fetch(CLOUDINARY_URL, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Cloudinary upload failed");

      const imgResponse = await response.json();
      console.log("Image uploaded:", imgResponse);

      return imgResponse.secure_url;
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    }
  };

  const submitForm = async (formEvent) => {
    formEvent.preventDefault();
  
    if (!file) {
      console.error("No image selected");
      return;
    }
  
    try {
      setUploading(true);
      const imageUrl = await uploadToCloudinary(file);
      if (!imageUrl) {
        console.error("Failed to upload image");
        setUploading(false);
        return;
      }
  
      const apiUrl = "http://localhost:5000/student/uploadCertificate";
      const requestData = {
        certificateUrl: imageUrl,
        name: data.name,
        desc: data.desc,
        issueDate: data.issueDate,
        user: JSON.parse(localStorage.getItem('user'))?._id,
        school: JSON.parse(localStorage.getItem('user'))?.school?._id,
      };
  
      const apiResponse = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });
  
      if (!apiResponse.ok) throw new Error("API submission failed");
  
      console.log("Data successfully submitted:", await apiResponse.json());
  
      // Reset the form after successful submission
      setPreview("");
      setFile(null);
      setDesc("");
      setIssueDate("");
      setName("");
      setData({ certificateUrl: "", desc: "", name: "", issueDate: "" });
  
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setUploading(false);
    }
  };
  

  return (
    <Container>
      <Card>
        <Title>Upload Document</Title>
        <Form onSubmit={submitForm}>
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="Enter Full Name"
              required
              onChange={(e) => handleData("name", e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="image">Image Upload</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              required
            />
            {preview && (
              <ImagePreview>
                <img
                  src={preview}
                  alt="Upload preview"
                  className="w-full h-28 object-cover"
                />
              </ImagePreview>
            )}
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Enter document description"
              required
              onChange={(e) => handleData("desc", e.target.value)}
            />
          </div>

          <div style={{ position: "relative" }}>
            <Label htmlFor="issueDate">Issue Date</Label>
            <Input
              type="date"
              id="issueDate"
              name="issueDate"
              required
              onChange={(e) => handleData("issueDate", e.target.value)}
            />
            <IconWrapper>
              <Calendar size={20} color="#888" />
            </IconWrapper>
          </div>

          <Button type="submit" disabled={uploading}>
            {uploading ? "Uploading..." : "Submit"}
          </Button>
        </Form>
      </Card>
    </Container>
  );
}
