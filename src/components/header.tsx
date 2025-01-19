    "use client"
import React, { useState } from "react";
import { Facebook, Instagram, MessageCirclePlus, Phone } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Header = () => {
  const router = useRouter();

  const handlePhoneClick = () => {
    if (typeof window !== "undefined" && window.navigator.userAgentData.mobile) {
      // Mobile: Open phone dial pad
      window.location.href = `tel:9876543210`;
    } else {
      // Desktop: Copy phone number to clipboard
      navigator.clipboard.writeText("9876543210");
      window.alert('Phone number copied')
    }
  };

  const handleSocialClick = (url) => {
    window.open(url, "_blank");
  };

  return (
    <header>
      <section className="bg-active flex justify-between items-center md:gap-4 p-4 ">
        <div className="flex justify-center items-center gap-1 cursor-pointer" onClick={handlePhoneClick}>
          <Phone />
          <span>9876543210</span>
        </div>
        <div className="flex justify-center items-center gap-4 cursor-pointer">
          <Facebook onClick={() => handleSocialClick("https://www.facebook.com/")} />
          <Instagram onClick={() => handleSocialClick("https://www.instagram.com/")} />
          <MessageCirclePlus
            onClick={() =>
              handleSocialClick(
                "https://api.whatsapp.com/send?phone=9876543210"
              )
            }
          />
        </div>
      </section>
      <div className="shadow-md shadow-blue-500 p-5">
        
        <Image src="/mobileLogo.png" width={140} height={104} alt="Logo"  
          className="m-0 rounded-xl align-center"
          sizes="300px"
          alt="Logo "
          priority={true}
          title="Header Logo" />
      </div>
    </header>
  );
};

export default Header;