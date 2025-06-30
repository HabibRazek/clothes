import {setRequestLocale} from 'next-intl/server';
import Navbar from "@/components/navigation/navbar";
import Footer from "@/components/layout/footer";
import LoginForm from "@/components/auth/login-form";

export default async function LoginPage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  
  // Enable static rendering
  setRequestLocale(locale);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar/>
      <LoginForm />
      <Footer />
    </div>
  );
}
