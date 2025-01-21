import Header from "@/components/header";
import CarouselBanner from "@/components/shadcnBanner";

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
      <CarouselBanner imageLinks={bannerImageLinks} />
    </main>
  );
};

export default HomePage;
