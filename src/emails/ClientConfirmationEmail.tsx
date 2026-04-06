import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";

type ClientConfirmationEmailProps = {
  name: string;
  imageUrl?: string | null;
  projectType?: string | null;
  dimensions?: string | null;
  budget?: string | null;
  message?: string | null;
  fileUrl?: string | null;
};

export function ClientConfirmationEmail({
  name,
  imageUrl,
  projectType,
  dimensions,
  budget,
  message,
  fileUrl,
}: ClientConfirmationEmailProps) {
  const previewImage = fileUrl || imageUrl;

  return (
    <Html>
      <Head />
      <Preview>Nous avons bien reçu votre demande, {name}</Preview>

      <Body style={styles.body}>
        <Container style={styles.container}>
          <Section style={styles.logoWrapper}>
            <Img
              src="https://auqffceixjyogdqzlejf.supabase.co/storage/v1/object/public/branding/logo.png"
              alt="Marcos Papermache"
              width="120"
              style={styles.logo}
            />
          </Section>

          <Section style={styles.hero}>
            <Text style={styles.eyebrow}>DEMANDE REÇUE</Text>
            <Heading style={styles.heading}>
              Merci pour votre demande ✨
            </Heading>
            <Text style={styles.text}>
              Bonjour {name}, votre projet a bien été reçu. Je vais l’étudier
              avec attention et revenir vers vous dès que possible.
            </Text>
          </Section>

          {previewImage && (
            <Section style={styles.imageSection}>
              <Img
                src={previewImage}
                alt="Aperçu du projet"
                style={styles.image}
              />
            </Section>
          )}

          {(projectType || dimensions || budget) && (
            <Section style={styles.card}>
              <Text style={styles.cardTitle}>Récapitulatif de votre demande</Text>

              {projectType && (
                <Text style={styles.infoLine}>
                  <strong>Type de projet :</strong> {projectType}
                </Text>
              )}

              {dimensions && (
                <Text style={styles.infoLine}>
                  <strong>Dimensions :</strong> {dimensions}
                </Text>
              )}

              {budget && (
                <Text style={styles.infoLine}>
                  <strong>Budget :</strong> {budget}
                </Text>
              )}
            </Section>
          )}

          {message && (
            <Section style={styles.messageBox}>
              <Text style={styles.cardTitle}>Votre message</Text>
              <Text style={styles.messageText}>{message}</Text>
            </Section>
          )}

          <Section style={styles.ctaWrapper}>
            <Button
              href="https://www.marcospapermache.com"
              style={styles.button}
            >
              Visiter le site
            </Button>
          </Section>

          <Hr style={styles.hr} />

          <Text style={styles.text}>
            Chaque création est pensée comme une pièce unique, réalisée à la
            main avec soin et sensibilité artistique.
          </Text>

          <Text style={styles.signature}>— Marcos Papermache</Text>
        </Container>
      </Body>
    </Html>
  );
}

const styles = {
  body: {
    margin: 0,
    padding: "32px 16px",
    backgroundColor: "#f6f2ed",
    fontFamily: "Arial, Helvetica, sans-serif",
    color: "#1f1f1f",
  },
  container: {
    maxWidth: "620px",
    margin: "0 auto",
    backgroundColor: "#ffffff",
    borderRadius: "18px",
    padding: "32px 28px",
    boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
  },
  logoWrapper: {
    textAlign: "center" as const,
    marginBottom: "24px",
  },
  logo: {
    margin: "0 auto",
  },
  hero: {
    textAlign: "center" as const,
    marginBottom: "28px",
  },
  eyebrow: {
    margin: "0 0 10px",
    fontSize: "12px",
    letterSpacing: "2px",
    textTransform: "uppercase" as const,
    color: "#b96a2f",
  },
  heading: {
    margin: "0 0 14px",
    fontSize: "28px",
    lineHeight: "36px",
    fontWeight: "700",
    color: "#1f1f1f",
  },
  text: {
    margin: "0 0 14px",
    fontSize: "14px",
    lineHeight: "24px",
    color: "#5f5a55",
  },
  imageSection: {
    marginBottom: "24px",
  },
  image: {
    width: "100%",
    borderRadius: "14px",
    display: "block",
  },
  card: {
    backgroundColor: "#fbf8f4",
    borderRadius: "14px",
    padding: "18px",
    marginBottom: "18px",
  },
  cardTitle: {
    margin: "0 0 12px",
    fontSize: "15px",
    fontWeight: "700",
    color: "#1f1f1f",
  },
  infoLine: {
    margin: "0 0 10px",
    fontSize: "14px",
    lineHeight: "22px",
    color: "#3c3a37",
  },
  messageBox: {
    backgroundColor: "#fff4ea",
    borderRadius: "14px",
    padding: "18px",
    marginBottom: "20px",
  },
  messageText: {
    margin: 0,
    fontSize: "14px",
    lineHeight: "24px",
    color: "#3c3a37",
    whiteSpace: "pre-line" as const,
  },
  ctaWrapper: {
    textAlign: "center" as const,
    marginBottom: "24px",
    marginTop: "8px",
  },
  button: {
    backgroundColor: "#b96a2f",
    color: "#ffffff",
    padding: "12px 20px",
    borderRadius: "999px",
    fontSize: "14px",
    textDecoration: "none",
    display: "inline-block",
  },
  hr: {
    borderColor: "#ece4db",
    margin: "24px 0",
  },
  signature: {
    margin: "0",
    fontSize: "14px",
    lineHeight: "22px",
    color: "#5f5a55",
    fontStyle: "italic" as const,
  },
};