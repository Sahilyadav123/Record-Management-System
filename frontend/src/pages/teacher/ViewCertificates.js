"use client";

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f4f4f4;
  padding: 16px;
`;

const Title = styled.h2`
  font-size: 2rem;
  margin-bottom: 16px;
`;

const CertificateList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: center;
`;

const Card = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 16px;
  width: 300px;
  text-align: center;
`;

const CertificateImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 4px;
`;

const Description = styled.p`
  font-size: 1rem;
  color: #333;
  margin: 8px 0;
`;

const IssueDate = styled.span`
  font-size: 0.9rem;
  color: #666;
`;

export default function StudentCertificate() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {id} = useParams();
  console.log(id)

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/student/getCertificates/${id}`
        );
        if (!response.ok) throw new Error("Failed to fetch certificates");

        const data = await response.json();
        setCertificates(data.certificates);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, [id]);

  if (loading) return <Container><Title>Loading Certificates...</Title></Container>;
  if (error) return <Container><Title>Error: {error}</Title></Container>;

  return (
    <Container>
      <Title>Student Certificates</Title>
      <CertificateList>
        {certificates.length === 0 ? (
          <p>No certificates found.</p>
        ) : (
          certificates.map((cert) => (
            <Card key={cert._id}>
              <CertificateImage src={cert.certificateUrl} alt="Certificate" />
              <Description>{cert.description}</Description>
              <IssueDate>Issued on: {new Date(cert.issueDate).toLocaleDateString()}</IssueDate>
            </Card>
          ))
        )}
      </CertificateList>
    </Container>
  );
}
