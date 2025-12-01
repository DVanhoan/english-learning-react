import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

const ScrollToTopButton = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return visible ? (
    <button
      onClick={scrollToTop}
      className="fixed bottom-6 max-w-[60px] rounded-2xl right-6 z-50 cursor-pointer p-3 bg-[#1f2937] text-white shadow-lg hover:bg-[#263448] transition-colors"
    >
      <div className="flex flex-col items-center justify-center text-[10px] gap-0.5">
        <ArrowUp size={18} /> <p>ĐẦU TRANG</p>
      </div>
    </button>
  ) : null;
};

export default ScrollToTopButton;
