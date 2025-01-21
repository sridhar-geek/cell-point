"use client";
import React from "react";
import { Facebook, Instagram, MessageCirclePlus, Phone } from "lucide-react";
import Image from "next/image";

const Header = () => {
  const handlePhoneClick = () => {
    if (
      typeof window !== "undefined" &&
      window.navigator.userAgent.match(
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
      )
    ) {
      // Mobile: Open phone dial pad
      window.location.href = `tel:8464914395`;
    } else {
      // Desktop: Copy phone number to clipboard
      navigator.clipboard.writeText("8464914395");
      window.alert("Phone number copied");
    }
  };

  const handleSocialClick = (url: string) => {
    window.open(url, "_blank");
  };

  return (
    <header>
      <section className="bg-active flex justify-between items-center md:gap-4 p-4 ">
        <div
          className="flex justify-center items-center gap-1 cursor-pointer"
          onClick={handlePhoneClick}
        >
          <Phone />
          <span>8464914395</span>
        </div>
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
        <div className="flex justify-center items-center gap-4 cursor-pointer">
          <Facebook
            onClick={() => handleSocialClick("https://www.facebook.com/")}
          />
          <Instagram
            onClick={() => handleSocialClick("https://www.instagram.com/")}
          />
          <MessageCirclePlus
            onClick={() =>
              handleSocialClick(
                "https://api.whatsapp.com/send?phone=8464914395"
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
