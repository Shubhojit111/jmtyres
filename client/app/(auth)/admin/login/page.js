import AuthPage from "@/components/account/AuthPage";

export const metadata = {
  title: "Admin Sign In | J.M. Tyres",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return <AuthPage admin />;
}
