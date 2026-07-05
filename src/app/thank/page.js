import React from 'react';
// import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

const ThankYouPage = () => {
  return (
    <main className="flex flex-col justify-center items-center min-h-screen bg-[#fcfaf9] p-4 text-center">
      <div className="bg-white p-8 sm:p-12 rounded-2xl shadow-sm max-w-lg w-full border border-gray-100">
        <div className="flex justify-center mb-6">
          <CheckCircle size={72} className="text-[#c25934]" strokeWidth={1.5} />
        </div>
        <h1 className="text-4xl font-bold text-[#0f172a] mb-4">
          Thank You!
        </h1>
        <p className="text-gray-600 mb-8 text-lg">
          We appreciate your time. Your review has been successfully submitted and it helps us continue providing premium interior services.
        </p>
      </div>
    </main>
  );
}

export default ThankYouPage;