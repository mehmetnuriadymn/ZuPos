import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

const LogoContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-end",
  justifyContent: "center",
  padding: theme.spacing(3),
  paddingRight: theme.spacing(4),
  cursor: "pointer",
  position: "relative",
  gap: theme.spacing(1.5),
  "&::before": {
    content: '""',
    position: "absolute",
    inset: -8,
    borderRadius: 28,
    background: `linear-gradient(135deg, 
      ${theme.palette.primary.main}08, 
      ${theme.palette.secondary.main}08,
      ${theme.palette.primary.main}12
    )`,
    backdropFilter: "blur(20px)",
    opacity: 0,
    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
    border: `1px solid rgba(255, 255, 255, 0.1)`,
  },
  "&:hover::before": {
    opacity: 1,
    transform: "scale(1.02)",
  },
}));

const LogoIcon = styled(Box)(() => ({
  position: "relative",
  width: 80,
  height: 80,
  borderRadius: 20,
  background: `linear-gradient(135deg, 
    #6366f1 0%, 
    #8b5cf6 25%, 
    #a855f7 50%, 
    #c084fc 75%, 
    #e879f9 100%
  )`,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: `
    0 25px 50px rgba(99, 102, 241, 0.25),
    0 12px 25px rgba(168, 85, 247, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.3),
    inset 0 -1px 0 rgba(0, 0, 0, 0.1)
  `,
  border: `2px solid rgba(255, 255, 255, 0.2)`,
  transition: "all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    inset: 0,
    background: `linear-gradient(45deg, 
      transparent 30%, 
      rgba(255, 255, 255, 0.1) 50%, 
      transparent 70%
    )`,
    transform: "translateX(-100%)",
    transition: "transform 0.6s ease",
  },
  "&:hover": {
    transform: "translateY(-6px) scale(1.05) rotate(-2deg)",
    boxShadow: `
      0 40px 80px rgba(99, 102, 241, 0.4),
      0 20px 40px rgba(168, 85, 247, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.4),
      inset 0 -1px 0 rgba(0, 0, 0, 0.1)
    `,
  },
  "&:hover::before": {
    transform: "translateX(100%)",
  },
}));

const LogoText = styled(Typography)(() => ({
  fontSize: "3rem",
  fontWeight: 800,
  color: "white",
  textShadow: `
    0 2px 4px rgba(0, 0, 0, 0.3),
    0 4px 8px rgba(0, 0, 0, 0.2)
  `,
  letterSpacing: "-0.05em",
  position: "relative",
  zIndex: 1,
  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
}));

const BrandName = styled(Typography)(({ theme }) => ({
  fontSize: "1.25rem",
  fontWeight: 700,
  background: `linear-gradient(135deg, 
    ${theme.palette.primary.main}, 
    ${theme.palette.secondary.main}
  )`,
  backgroundClip: "text",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  position: "relative",
  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
  transition: "all 0.3s ease",
}));

const Subtitle = styled(Typography)(({ theme }) => ({
  fontSize: "0.75rem",
  fontWeight: 500,
  color: theme.palette.text.secondary,
  letterSpacing: "0.05em",
  textAlign: "center",
  opacity: 0.8,
  transition: "all 0.3s ease",
}));

export default function SelectContent() {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate("/dashboard");
  };

  return (
    <LogoContainer onClick={handleHomeClick}>
      <LogoIcon>
        <LogoText>Z</LogoText>
      </LogoIcon>
      <BrandName>ZuPos</BrandName>
      <Subtitle>Akıllı Satış Yönetimi</Subtitle>
    </LogoContainer>
  );
}
