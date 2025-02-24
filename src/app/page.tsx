import Header from "@/components/Header/header";
import Footer from "@/components/footer";
import PriroritySection from "@/components/prirority";
import NonPriroritySection from "@/components/nonPriroritySection";
import BannerSection from "@/components/bannerSection";
import GoogleMap from "@/components/googleMap";

const HomePage = () => {
  return (
    <main>
      <Header />
      <div className="h-28" />{" "}
      <div className="mx-3 md:mx-8 lg:mx-10">
        <BannerSection />
        <PriroritySection />
        <NonPriroritySection />
      </div>
      <div className="h-[400px] w-[90%] md:w-full mx-auto mt-3 mb-3">
        <GoogleMap />
      </div>
      <Footer />
    </main>
  );
};

export default HomePage;
