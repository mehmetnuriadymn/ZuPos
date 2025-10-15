import { Box, Typography, Stack } from "@mui/material";

interface PageContainerProps {
  title: string;
  children: React.ReactNode;
}

export default function PageContainer({ title, children }: PageContainerProps) {
  return (
    <Box sx={{ width: "100%" }}>
      <Typography
        variant="h4"
        sx={{
          mb: 3,
          fontWeight: 600,
          color: "text.primary",
        }}
      >
        {title}
      </Typography>

      <Stack spacing={3}>{children}</Stack>
    </Box>
  );
}
