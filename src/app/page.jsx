"use client"
import React, { useState, useEffect } from 'react'
import { Star } from 'lucide-react';
import { useRouter } from "next/navigation"
import toast, { Toaster } from "react-hot-toast"
import { FileUploader } from "react-drag-drop-files";

const Page = () => {
  const router = useRouter();

  const [isMounted, setIsMounted] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState(null);
  const fileTypes = ["JPEG", "PNG", "GIF"];
  
  const [Value, setValue] = useState({
    name: "",
    rating: 0,
    review: ""
  });

  const IMGBB_API_KEY = "2df2c52f7a85ab6cad626182bc60dfc7";

  const handleChange = (file) => {
    setFile(file);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
      const checkSubmission = localStorage.getItem('isReviewSubmitted');
      if (checkSubmission === 'true') {
        setHasSubmitted(true);
        router.push('/thank'); 
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!Value.name || Value.rating === 0 || !Value.review) {
      toast.error("Please Fill all the fields");
      return;
    }

    setIsLoading(true);

    try {
      let uploadedImageUrls = [];

      if (file && file.length > 0) {
        toast.loading("Uploading images...", { id: "upload-toast" });
        
        for (let i = 0; i < file.length; i++) {
          const imgFormData = new FormData();
          imgFormData.append("image", file[i]);

          const imgbbResponse = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
            method: 'POST',
            body: imgFormData,
          });

          const imgbbData = await imgbbResponse.json();

          if (imgbbData.success) {
            uploadedImageUrls.push(imgbbData.data.url);
          } else {
            throw new Error("Failed to upload image to ImgBB");
          }
        }
        toast.success("Images uploaded!", { id: "upload-toast" });
      }
      const finalDataToSubmit = {
        ...Value,
        images: uploadedImageUrls
      };

      const response = await fetch('/api/review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(finalDataToSubmit),
      });

      const result = await response.json();

      if (result.success) {
        setValue({ name: "", rating: 0, review: "" });
        setFile(null);
        
        localStorage.setItem('isReviewSubmitted', 'true');
        setHasSubmitted(true);

        toast.success("Review Submitted Successfully!");
        router.push("/thank");
      } else {
        toast.error("Error: " + result.message);
      }

    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Something went wrong!");
      toast.dismiss("upload-toast");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isMounted) return null;

  if (hasSubmitted) {
    return null;
  }

  return (
    <>
      <Toaster position="top-center" />
      <main className='flex justify-center items-center min-h-lvh p-4 bg-[#fcfaf9] text-[#0f172a]'>
        <form onSubmit={handleSubmit} className='w-full max-w-md bg-white border border-gray-100 shadow-sm flex flex-col p-6 sm:p-10 rounded-2xl'>
          <div className='text-center text-3xl font-bold mb-5 text-[#0f172a]'>
            <h1>REVIEW FORM</h1>
          </div>

          <label className='mb-1 font-medium'>Name *</label>
          <input
            type="text"
            value={Value.name}
            onChange={(e) => setValue({ ...Value, name: e.target.value })}
            placeholder='Write Your Name'
            className='w-full border border-gray-200 bg-white text-gray-800 mb-4 py-2 px-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c25934]'
            required
          />

          <label className='mb-1 font-medium'>Rate *</label>
          <div className='flex mb-4'>
            {[...Array(5)].map((_, index) => {
              let starValue = index + 1;
              return (
                <div key={starValue} className='cursor-pointer' onClick={() => setValue({ ...Value, rating: starValue })}>
                  <Star
                    size={32}
                    fill={starValue <= Value.rating ? '#c25934' : 'none'}
                    stroke={starValue <= Value.rating ? '#c25934' : '#9ca3af'}
                    strokeWidth="1.5"
                  />
                </div>
              )
            })}
          </div>

          <label className='mb-1 font-medium'>Review *</label>
          <textarea
            required
            value={Value.review}
            onChange={(e) => setValue({ ...Value, review: e.target.value })}
            className='w-full border border-gray-200 bg-white text-gray-800 rounded-md h-36 py-2 px-3 mb-4 focus:outline-none focus:ring-2 focus:ring-[#c25934] resize-y'
            placeholder='Write About Venetus Interiors Service......'
          ></textarea>
          <div className="w-full [&>label]:w-full! [&>label]:max-w-full! [&>label]:min-w-0! [&>label]:border-[#c25934]! [&>label]:border-2! [&>label]:border-dashed! hover:[&>label]:bg-orange-50! transition-colors">
          <FileUploader
            multiple={true}
            handleChange={handleChange}
            name="file"
            types={fileTypes}
          />
          </div>
          <p className="mt-2 text-sm text-gray-500">
            {file ? `${file.length} file(s) selected` : "No files uploaded yet"}
          </p>

          <button
            type="submit"
            disabled={isLoading}
            className={`bg-[#c25934] text-white border-none rounded-[5px] py-2 mt-4 font-semibold transition-colors duration-300 flex justify-center items-center ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#a64b2c] cursor-pointer'}`}
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              'SUBMIT'
            )}
          </button>
        </form>
      </main>
    </>
  )
}

export default Page