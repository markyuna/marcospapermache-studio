import * as React from "react";
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

type AdminNotificationEmailProps = {
  name: string;
  email: string;
  projectType?: string | null;
  dimensions?: string | null;
  budget?: string | null;
  message: string;
  imageUrl?: string | null;
  fileUrl?: string | null;
};

export function AdminNotificationEmail({
  name,
  email,
  projectType,
  dimensions,
  budget,
  message,
  imageUrl,
  fileUrl,
}: AdminNotificationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Nouvelle demande reçue depuis le site</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Nouvelle demande client</Heading>

          <Section style={card}>
            <Text style={label}>Nom</Text>
            <Text style={value}>{name}</Text>

            <Text style={label}>Email</Text>
            <Text style={value}>{email}</Text>

            <Text style={label}>Type de projet</Text>
            <Text style={value}>{projectType || "Non renseigné"}</Text>

            <Text style={label}>Dimensions</Text>
            <Text style={value}>{dimensions || "Non renseigné"}</Text>

            <Text style={label}>Budget</Text>
            <Text style={value}>{budget || "Non renseigné"}</Text>

            <Text style={label}>Message</Text>
            <Text style={messageBox}>{message}</Text>

            {imageUrl ? (
              <>
                <Text style={label}>Image IA</Text>
                <Text style={value}>{imageUrl}</Text>
              </>
            ) : null}

            {fileUrl ? (
              <>
                <Text style={label}>Fichier joint / lien</Text>
                <Text style={value}>{fileUrl}</Text>
              </>
            ) : null}
          </Section>

          <Hr style={hr} />

          <Text style={footer}>
            Email automatique envoyé depuis marcospapermache.com
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#fffaf5",
  fontFamily: "Arial, sans-serif",
  padding: "24px 0",
};

const container = {
  maxWidth: "640px",
  margin: "0 auto",
  backgroundColor: "#ffffff",
  border: "1px solid #f1e5d8",
  borderRadius: "16px",
  padding: "32px",
};

const card = {
  backgroundColor: "#fffdf9",
  border: "1px solid #f3e8dc",
  borderRadius: "12px",
  padding: "20px",
};

const h1 = {
  fontSize: "28px",
  lineHeight: "1.2",
  color: "#1f1f1f",
  marginBottom: "24px",
};

const label = {
  fontSize: "12px",
  textTransform: "uppercase" as const,
  letterSpacing: "0.08em",
  color: "#b06a2b",
  marginBottom: "4px",
  marginTop: "16px",
};

const value = {
  fontSize: "15px",
  color: "#2b2b2b",
  margin: 0,
};

const messageBox = {
  fontSize: "15px",
  color: "#2b2b2b",
  backgroundColor: "#fff7ef",
  border: "1px solid #f2dfca",
  borderRadius: "10px",
  padding: "14px",
  marginTop: "8px",
};

const hr = {
  borderColor: "#f0e3d6",
  margin: "24px 0",
};

const footer = {
  fontSize: "12px",
  color: "#7a7a7a",
};