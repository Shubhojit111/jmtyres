import AuthPage from "@/components/account/AuthPage";

export const metadata = {
  title: "Create an account | J.M. Tyres",
  description:
    "Create a J.M. Tyres account to submit and track purchase requests.",
};

export default function RegisterPage() {
  return <AuthPage initialMode="register" />;
}
