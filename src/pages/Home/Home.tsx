import Contact from "@/components/Contact";
import FeaturedCourses from "@/components/FeaturedCourses";
import FeaturedPosts from "@/components/FeaturedPosts";
import Hero from "@/components/Hero";

export default function Home() {
  return (
    <div>
      <Hero />
      <FeaturedCourses />
      <FeaturedPosts />
      <Contact />
    </div>
  );
}
