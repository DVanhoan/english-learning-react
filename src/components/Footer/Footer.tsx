import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";

interface FooterProps {
  logo?: {
    url: string;
    src: string;
    alt: string;
    title: string;
  };
  sections?: Array<{
    title: string;
    links: Array<{ name: string; href: string }>;
  }>;
  description?: string;
  socialLinks?: Array<{
    icon: React.ReactElement;
    href: string;
    label: string;
  }>;
  copyright?: string;
  legalLinks?: Array<{
    name: string;
    href: string;
  }>;
}

const defaultSections = [
  {
    title: "THÔNG TIN",
    links: [
      { name: "Giới thiệu", href: "#" },
      { name: "Câu hỏi thường gặp", href: "#" },
      { name: "Điều khoản dịch vụ", href: "#" },
      { name: "Chính sách bảo mật", href: "#" },
    ],
  },
  {
    title: "CÔNG TY",
    links: [
      { name: "Đội ngũ", href: "#" },
      { name: "Blog", href: "#" },
      { name: "Tuyển dụng", href: "#" },
    ],
  },
  {
    title: "TÀI NGUYÊN",
    links: [
      { name: "Trợ giúp", href: "#" },
      { name: "Liên hệ kinh doanh", href: "#" },
      { name: "Quảng cáo", href: "#" },
      { name: "Chính sách bảo mật", href: "#" },
    ],
  },
];

const defaultSocialLinks = [
  {
    icon: <FaInstagram className="size-5" fill="white" />,
    href: "#",
    label: "Instagram",
  },
  {
    icon: <FaFacebook className="size-5" fill="white" />,
    href: "#",
    label: "Facebook",
  },
  {
    icon: <FaTwitter className="size-5" fill="white" />,
    href: "#",
    label: "Twitter",
  },
  {
    icon: <FaLinkedin className="size-5" fill="white" />,
    href: "#",
    label: "LinkedIn",
  },
];

const defaultLegalLinks = [
  { name: "Terms and Conditions", href: "#" },
  { name: "Privacy Policy", href: "#" },
];

const Footer = ({
  logo = {
    url: "/",
    src: "/images/student.png",
    alt: "logo",
    title: "K-English",
  },
  sections = defaultSections,
  description = "K-English - Your english, your future",
  socialLinks = defaultSocialLinks,
  copyright = "© 2025 K-English. All rights reserved.",
  legalLinks = defaultLegalLinks,
}: FooterProps) => {
  return (
    <footer className="bg-primary-color">
      <section className="py-8 main-layout text-white">
        <div className="container">
          <div className="flex w-full flex-col justify-between gap-10 lg:flex-row lg:items-start lg:text-left">
            <div className="flex w-full flex-col justify-between gap-6 lg:items-start">
              {/* Logo */}
              <div className="flex items-center gap-2 lg:justify-start">
                <Link to={logo.url}>
                  <img
                    src={logo.src}
                    alt={logo.alt}
                    title={logo.title}
                    className="h-8"
                  />
                </Link>
                <h2 className="text-xl font-semibold text-white">
                  {logo.title}
                </h2>
              </div>
              <p className=" max-w-[70%] text-sm text-white">{description}</p>
              <ul className="flex items-center space-x-6">
                {socialLinks.map((social, idx) => (
                  <li key={idx} className="hover:text-primary font-medium">
                    <a href={social.href} aria-label={social.label}>
                      {social.icon}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid w-full gap-6 md:grid-cols-3 lg:gap-20">
              {sections.map((section, sectionIdx) => (
                <div key={sectionIdx}>
                  <h3 className="mb-4 font-bold">{section.title}</h3>
                  <ul className="text-muted-foreground space-y-3 text-sm">
                    {section.links.map((link, linkIdx) => (
                      <li key={linkIdx} className="text-white">
                        <Link to={link.href}>{link.name}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <div className="text-muted-foreground mt-8 flex flex-col justify-between gap-4 border-t py-8 text-xs font-medium md:flex-row md:items-center md:text-left">
            <p className="order-2 lg:order-1 text-white">{copyright}</p>
            <ul className="order-1 flex flex-col gap-2 md:order-2 md:flex-row">
              {legalLinks.map((link, idx) => (
                <li key={idx} className="text-white">
                  <Link to={link.href}>{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </footer>
  );
};

export default Footer;
