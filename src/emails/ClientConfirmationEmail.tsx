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

type ClientConfirmationEmailProps = {
  name: string;
  projectType?: string | null;
  dimensions?: string | null;
  budget?: string | null;
  message: string;
};

export function ClientConfirmationEmail({
  name,
  projectType,
  dimensions,
  budget,
  message,
}: ClientConfirmationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Nous avons bien reçu votre demande</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Merci pour votre demande</Heading>

          <Text style={paragraph}>
            Bonjour {name},
          </Text>

          <Text style={paragraph}>
            Nous avons bien reçu votre demande de création sur mesure.
            Merci pour votre intérêt envers l’univers de Marcos Papermache.
          </Text>

          <Section style={card}>
            <Text style={label}>Type de projet</Text>
            <Text style={value}>{projectType || "Non renseigné"}</Text>

            <Text style={label}>Dimensions</Text>
            <Text style={value}>{dimensions || "Non renseigné"}</Text>

            <Text style={label}>Budget</Text>
            <Text style={value}>{budget || "Non renseigné"}</Text>

            <Text style={label}>Votre message</Text>
            <Text style={messageBox}>{message}</Text>
          </Section>

          <Hr style={hr} />

          <Text style={paragraph}>
            Nous reviendrons vers vous prochainement pour étudier votre projet.
          </Text>

          <Text style={signature}>
            Marcos Papermache
            <br />
            Sculpture contemporaine & créations artistiques sur mesure
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

const paragraph = {
  fontSize: "15px",
  color: "#2b2b2b",
  lineHeight: "1.7",
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

const signature = {
  fontSize: "14px",
  color: "#5a5a5a",
  lineHeight: "1.7",
};