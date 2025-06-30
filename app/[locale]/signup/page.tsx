import {setRequestLocale} from 'next-intl/server';
import Navbar from "@/components/navigation/navbar";
import Footer from "@/components/layout/footer";
import SignupForm from "@/components/auth/signup-form";

export default async function SignupPage({
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
      <SignupForm />
      <Footer />
    </div>
  );
}
