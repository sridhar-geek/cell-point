import Header from "@/components/header";
import Footer from "@/components/footer";
import PriroritySection from "@/components/prirority";
import NonPriroritySection from "@/components/nonPriroritySection";
import BannerSection from "@/components/bannerSection";



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
      <Footer />
    </main>
  );
};

export default HomePage;
