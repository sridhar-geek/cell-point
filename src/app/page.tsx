import Header from "@/components/header";
import CarouselBanner from "@/components/shadcnBanner";
import Footer from "@/components/footer";
import PriroritySection from "@/components/prirority";
import NonPriroritySection from "@/components/nonPriroritySection";

const bannerImageLinks = [
  "/realme phone.jpg",
  "/realme phone2.jpg",
  "/samsung image.jpeg",
  "/vivo phone.jpg",
];

const HomePage = () => {
  return (
    <main>
      <Header />
      <br />
      <div className="mx-3 md:mx-8 lg:mx-10">
        <CarouselBanner imageLinks={bannerImageLinks} />
        <PriroritySection />
        <NonPriroritySection />
      </div>
      <Footer />
    </main>
  );
};

export default HomePage;
