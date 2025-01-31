"use client";
import React from "react";
import { Facebook, Instagram, Phone } from "lucide-react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { phoneNumber } from "@/lib/data";

const Header = () => {
  const { toast } = useToast();

  // when phone number is clicked
  const handlePhoneClick = () => {
    if (
      typeof window !== "undefined" &&
      window.navigator.userAgent.match(
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
      )
    ) {
      // Mobile: Open phone dial pad
      window.location.href = `tel:${phoneNumber}`;
    } else {
      // Desktop: Copy phone number to clipboard
      navigator.clipboard.writeText(phoneNumber);
      toast({
        title: "Phone Number Copied",
        description: `Contact for more help  >>> ${phoneNumber}`,
        variant: "default",
      });
    }
  };

  //  when social apps are clicked
  const handleSocialClick = (url: string) => {
    window.open(url, "_blank");
  };

  return (
    <header>
      <section className="bg-active flex justify-between items-center md:gap-4 p-4 ">
        {/* phone number */}
        <div
          className="flex justify-center items-center gap-1 cursor-pointer"
          onClick={handlePhoneClick}
        >
          <Phone />
          <span>{phoneNumber}</span>
        </div>
        {/* Logo */}
        <Image
          src="/mobileLogo.png"
          width={100}
          height={24}
          className="m-0 rounded-xl align-middle"
          sizes="300px"
          alt="Logo"
          priority={true}
          title="Header Logo"
        />
        {/* Social links */}
        <div className="flex justify-center items-center gap-4 cursor-pointer">
          <Facebook
            onClick={() => handleSocialClick("https://www.facebook.com/")}
          />
          <Instagram
            onClick={() => handleSocialClick("https://www.instagram.com/")}
          />
          <Image
            src="/whatsApp.svg"
            alt="Your SVG description"
            width={32}
            height={32}
            onClick={() =>
              handleSocialClick(
                `https://api.whatsapp.com/send?phone=${phoneNumber}`
              )
            }
          />
        </div>
      </section>
      {/* <div className="shadow-md shadow-blue-500 p-5 flex justify-center items-center"></div> */}
    </header>
  );
};

export default Header;
