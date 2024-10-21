"use client";
import { useState, ChangeEvent } from "react";
import QRCode from "qrcode";
import Image from "next/image";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  rollNumber: string;
  gender: string;
  image?: File | null;
}

export default function Home() {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    rollNumber: "",
    gender: "",
    image: null,
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [qrVisible, setQrIsVisible] = useState<boolean>(false);
  const [qr, setQr] = useState<string>("");

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};
    if (!formData.firstName) newErrors.firstName = "Please fill in all required fields before submitting";
    if (!formData.lastName) newErrors.lastName = "Please fill in all required fields before submitting";
    if (!formData.email) newErrors.email = "Please fill in all required fields before submitting";

    const email = formData.email; // Assuming you have an email field in your formData
if (email === "" || !email.endsWith(".ee.24@nitj.ac.in")) {
    newErrors.email = "Your details do not match our database";
}

    const rollNumber = Number(formData.rollNumber); // Convert to number for validation
    if (formData.rollNumber === "" || rollNumber > 24126060 || rollNumber < 24126001) {
        newErrors.rollNumber = "Your details does not match our database";
    }

    if (!formData.gender) newErrors.gender = "Please fill in all required fields before submitting";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
};


  const handleQrCodeGenerator = (): void => {
    if (validateForm()) {
      QRCode.toDataURL(`https://preview-ebon.vercel.app/ticket/${formData.firstName}/${formData.email}/${formData.rollNumber}`).then((url) => {
        setQr(url);
        setQrIsVisible(true);
      });
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;

    if (name === "image" && e.target instanceof HTMLInputElement && e.target.files) {
        const file = e.target.files[0];
        setFormData((prev) => ({ ...prev, image: file }));
    } else {
        setFormData((prev) => ({
            ...prev,
            [name]: value, // Directly use value as it's now a string
        }));
    }
};



  const downloadQrCode = () => {
    if (qr) {
      const link = document.createElement("a");
      link.href = qr;
      link.download = "qr_code.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center">
     <h1 className="text-3xl font-bold text-center p-4 text-white">Fresher&apos;s Party 2024 Batch - Roulette</h1>

     <p className="text-gray-400 text-lg text-center">Enter details to generate your ticket</p>


      <form className="flex w-96 flex-col gap-4 items-center justify-center m-2 p-2">
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          className="bg-gray-50 border-gray-200 rounded-lg border p-2 w-96 text-gray-900"


          value={formData.firstName}
          onChange={handleInputChange}
        />
        {errors.firstName && <p className="text-red-500">{errors.firstName}</p>}

        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          className="bg-gray-50 border-gray-200 rounded-lg border p-2 w-96 text-gray-900"


          value={formData.lastName}
          onChange={handleInputChange}
        />
        {errors.lastName && <p className="text-red-500">{errors.lastName}</p>}

        <input
          type="email"
          name="email"
          placeholder="Official Email id"
          className="bg-gray-50 border-gray-200 rounded-lg border p-2 w-96 text-gray-900"


          value={formData.email}
          onChange={handleInputChange}
        />
        {errors.email && <p className="text-red-500">{errors.email}</p>}

        <input
          type="number"
          name="rollNumber"
          placeholder="Roll Number"
          className="bg-gray-50 border-gray-200 rounded-lg border p-2 w-96 text-gray-900"

          value={formData.rollNumber || ""}
          onChange={handleInputChange}
        />
        {errors.rollNumber && <p className="text-red-500">{errors.rollNumber}</p>}

        <select
          name="gender"
         className="bg-gray-50 border-gray-200 rounded-lg border p-2 w-96 text-gray-900"

          value={formData.gender}
          onChange={handleInputChange}
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          {/* <option value="other">Other</option> */}
        </select>
        {errors.gender && <p className="text-red-500">{errors.gender}</p>}

        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleInputChange}
          className="w-96 p-2 bg-white rounded-lg"
        />

        <button
          type="button"
          className="w-96 p-2 bg-white rounded-lg text-black"
          onClick={handleQrCodeGenerator}
        >
          Generate QR Code
        </button>
      </form>

      {qrVisible && (
        <div className="mt-8">
          <Image
            src={qr}
            alt="QR Code"
            width={400}
            height={300}
            className="border border-gray-700 p-4"
          />
          <button
            onClick={downloadQrCode}
            className="mt-4 w-96 p-2 bg-white rounded-lg text-black"
          >
            Download QR Code
          </button>
        </div>
      )}
    </div>
  );
}
