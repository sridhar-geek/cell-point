"use client";
import React, { useState, useEffect } from "react";
import { Facebook, Instagram, Phone } from "lucide-react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { phoneNumber } from "@/lib/data";
import { useRouter } from "next/navigation";

const Header = () => {
  const { toast } = useToast();
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY) {
        // Scrolling down → hide header
        setShowHeader(false);
      } else {
        // Scrolling up → show header
        setShowHeader(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

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
    <header
      className={`fixed top-0 left-0 w-full bg-white shadow-md transition-transform duration-300 z-50 ${
        showHeader ? "translate-y-0" : "-translate-y-full"
      }`}
    >
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
          src="/logo.png"
          width={100}
          height={100}
          className="m-0 rounded-xl align-middle cursor-pointer"
          sizes="300px"
          alt="Logo"
          priority={true}
          title="Divya Cell Point"
          onClick={() => router.push('/')}
        />
        {/* Social links */}
        <div className="flex justify-center items-center gap-4 cursor-pointer">
          <Facebook
            onClick={() => handleSocialClick("https://www.facebook.com/")}
          />
          <Instagram
            onClick={() => handleSocialClick("https://www.instagram.com/")}
          />
          {/* <Image
            src="/whatsApp.svg"
            alt="Your SVG description"
            width={32}
            height={32}
            onClick={() =>
              handleSocialClick(
                `https://api.whatsapp.com/send?phone=${phoneNumber}`
              )
            }
          /> */}
        </div>
      </section>
    </header>
  );
};

export default Header;
