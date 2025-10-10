import * as React from "react";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import Divider from "@mui/material/Divider";
import FormControlLabel from "@mui/material/FormControlLabel";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";

// Kendi UI component'lerimizi kullan
import { Button, Input, Card } from "../../../shared/components/ui";
import ForgotPassword from "./ForgotPassword";
import { GoogleIcon, FacebookIcon, SitemarkIcon } from "./CustomIcons";
import { useAuth } from "../hooks";

// Card component'i artık shared/ui'den geliyor, styled component'e gerek yok

export default function SignInCard() {
  const [usernameError, setUsernameError] = React.useState(false);
  const [usernameErrorMessage, setUsernameErrorMessage] = React.useState("");
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState("");
  const [branchError, setBranchError] = React.useState(false);
  const [branchErrorMessage, setBranchErrorMessage] = React.useState("");
  const [rememberMe, setRememberMe] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  // Form state'i
  const [formData, setFormData] = React.useState({
    username: "",
    password: "",
    branchId: "",
  });

  // Auth hook kullanımı
  const { login, loading, error, clearError } = useAuth();

  // Input change handler
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateInputs()) {
      return;
    }

    try {
      await login(formData.username, formData.password, formData.branchId);
      console.log("Giriş başarılı!");
      // Buraya dashboard'a yönlendirme ekleyebilirsiniz
    } catch (error) {
      console.error("Giriş başarısız:", error);
    }
  };

  const validateInputs = () => {
    let isValid = true;

    if (!formData.username || formData.username.trim().length < 2) {
      setUsernameError(true);
      setUsernameErrorMessage("Lütfen geçerli bir kullanıcı adı girin.");
      isValid = false;
    } else {
      setUsernameError(false);
      setUsernameErrorMessage("");
    }

    if (!formData.password || formData.password.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage("Şifre en az 6 karakter olmalıdır.");
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");
    }

    if (
      !formData.branchId ||
      isNaN(Number(formData.branchId)) ||
      Number(formData.branchId) <= 0
    ) {
      setBranchError(true);
      setBranchErrorMessage("Lütfen geçerli bir şube numarası girin.");
      isValid = false;
    } else {
      setBranchError(false);
      setBranchErrorMessage("");
    }

    return isValid;
  };

  return (
    <Card variant="outlined">
      <Box sx={{ display: { xs: "flex", md: "none" } }}>
        <SitemarkIcon />
      </Box>
      <Typography
        component="h1"
        variant="h4"
        sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
      >
        Giriş Yap
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        sx={{ display: "flex", flexDirection: "column", width: "100%", gap: 2 }}
      >
        {error && (
          <Alert severity="error" onClose={clearError}>
            {error}
          </Alert>
        )}
        <div>
          <label
            htmlFor="username"
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: 500,
              color: "#1976d2",
            }}
          >
            Kullanıcı Adı
          </label>
          <Input
            error={usernameError}
            helperText={usernameErrorMessage}
            id="username"
            type="text"
            name="username"
            placeholder="kullaniciadi"
            autoComplete="username"
            autoFocus
            required
            value={formData.username}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label
            htmlFor="branchId"
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: 500,
              color: "#1976d2",
            }}
          >
            Şube Numarası
          </label>
          <Input
            error={branchError}
            helperText={branchErrorMessage}
            id="branchId"
            type="number"
            name="branchId"
            placeholder="263"
            required
            value={formData.branchId}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "8px",
            }}
          >
            <label
              htmlFor="password"
              style={{ fontWeight: 500, color: "#1976d2" }}
            >
              Şifre
            </label>
            <Link
              component="button"
              type="button"
              onClick={handleClickOpen}
              variant="body2"
              sx={{ alignSelf: "baseline" }}
            >
              Şifrenizi mi unuttunuz?
            </Link>
          </div>
          <Input
            error={passwordError}
            helperText={passwordErrorMessage}
            name="password"
            placeholder="••••••"
            type="password"
            id="password"
            autoComplete="current-password"
            required
            value={formData.password}
            onChange={handleInputChange}
          />
        </div>
        <FormControlLabel
          control={
            <Checkbox
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              color="primary"
            />
          }
          label="Beni hatırla"
        />
        <ForgotPassword open={open} handleClose={handleClose} />
        <Button type="submit" fullWidth variant="primary" disabled={loading}>
          {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
        </Button>
        <Typography sx={{ textAlign: "center" }}>
          Hesabınız yok mu?{" "}
          <span>
            <Link href="/sign-up" variant="body2" sx={{ alignSelf: "center" }}>
              Kayıt Ol
            </Link>
          </span>
        </Typography>
      </Box>
      <Divider>veya</Divider>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Button
          fullWidth
          variant="outline"
          onClick={() => alert("Google ile giriş yapın")}
        >
          <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <GoogleIcon />
            Google ile Giriş Yap
          </span>
        </Button>
        <Button
          fullWidth
          variant="outline"
          onClick={() => alert("Facebook ile giriş yapın")}
        >
          <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <FacebookIcon />
            Facebook ile Giriş Yap
          </span>
        </Button>
      </Box>
    </Card>
  );
}
