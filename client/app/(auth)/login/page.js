import AuthPage from '@/components/account/AuthPage';

export const metadata = {
  title: 'Sign in | J.M. Tyres',
  description: 'Sign in to manage your J.M. Tyres account and purchase requests.',
};

export default function LoginPage() {
  return <AuthPage initialMode="login" />;
}
