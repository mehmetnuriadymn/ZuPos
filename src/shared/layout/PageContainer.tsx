import { Box, Typography, Breadcrumbs, Link, Stack } from "@mui/material";
import { useLocation } from "react-router-dom";

interface PageContainerProps {
  title: string;
  children: React.ReactNode;
  showBreadcrumbs?: boolean;
}

export default function PageContainer({
  title,
  children,
  showBreadcrumbs = true,
}: PageContainerProps) {
  const location = useLocation();

  const getBreadcrumbs = () => {
    const paths = location.pathname.split("/").filter(Boolean);

    return paths.map((path, index) => {
      const label = path
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      return {
        label,
        href: `/${paths.slice(0, index + 1).join("/")}`,
        isLast: index === paths.length - 1,
      };
    });
  };

  return (
    <Box sx={{ width: "100%" }}>
      {showBreadcrumbs && (
        <Breadcrumbs sx={{ mb: 2 }}>
          <Link
            href="/dashboard"
            underline="hover"
            color="inherit"
            sx={{ cursor: "pointer" }}
          >
            Dashboard
          </Link>
          {getBreadcrumbs().map((crumb, index) =>
            crumb.isLast ? (
              <Typography
                key={index}
                color="text.primary"
                sx={{ fontWeight: 500 }}
              >
                {crumb.label}
              </Typography>
            ) : (
              <Link
                key={index}
                href={crumb.href}
                underline="hover"
                color="inherit"
                sx={{ cursor: "pointer" }}
              >
                {crumb.label}
              </Link>
            )
          )}
        </Breadcrumbs>
      )}

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
