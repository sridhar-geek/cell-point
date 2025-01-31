import Link from "next/link";
import { MapPin, Phone } from "lucide-react";
import { phoneNumber } from "@/lib/data";

const Footer = () => {
  return (
    <footer className="bg-slate-400 pt-10 pb-5 text-body ">
      {/* box 1 */}
      <div className="flex flex-col md:items-center sm:justify-between  mx-5 md:flex-row gap-5">
        <h3 className=" text-3xl cursor-pointer select-none">
          {" "}
          Divya Cell Point
        </h3>
        {/* box 2 */}
        <div>
          <h4 className="footer_items font-extrabold">Services Available</h4>
          <div className="footer_items">Combo Replacement</div>
          <div className="footer_items">Water Services</div>
          <div className="footer_items">Keypad Replacement </div>
        </div>
        {/* box 3 */}
        <div>
          <h4 className="footer_items font-bold">Contact Us</h4>
          <div className="footer_items flex items-center gap-2">
            {" "}
            <MapPin /> Maduthuru, Atchuthapuram
          </div>
          <div className="footer_items flex items-center gap-2">
            <Phone />
            <div className="flex flex-col">
              <span>{phoneNumber}</span>
              {/* <span>+91 99999 99999</span>  Add extra number */}
            </div>
          </div>
        </div>
      </div>
      {/* down copyright */}
      <div className="border border-gray-500 border-x-2"></div>
      <div className="text-center mt-3">
        {/* Link to login page */}
        <Link href={"/admin/login"}>
          CopyRights © Divya Cell Point 2025
        </Link>{" "}
      </div>
    </footer>
  );
};

export default Footer;
