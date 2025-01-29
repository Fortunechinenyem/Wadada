import Footer from "@/app/components/Footer";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-lg p-8 bg-white shadow-lg rounded-lg">
          <Image
            className="mx-auto"
            alt="logo"
            src="/images/logo.png"
            width={100}
            height={100}
          />
          <h1 className="text-4xl font-extrabold text-center text-blue-600">
            Welcome to Wadada
          </h1>
          <p className="mt-4 text-center text-gray-600">
            Your Digital "Esusu" - Seamless payments and group management made
            easy.
          </p>

          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-center text-gray-800">
              Get Started
            </h2>
            <div className="flex flex-col items-center mt-8 space-y-4">
              <Link
                href="/register"
                className="w-full px-4 py-2 text-center text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-100 focus:ring-2 focus:ring-blue-500 focus:outline-none sm:w-auto"
              >
                Register
              </Link>
              <Link
                href="/login"
                className="w-full px-4 py-2 text-center text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-100 focus:ring-2 focus:ring-blue-500 focus:outline-none sm:w-auto"
              >
                Log in
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
