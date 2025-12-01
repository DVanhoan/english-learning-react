import { MailIcon, MapPinIcon, PhoneIcon } from "lucide-react";
import { Link } from "react-router-dom";

const Contact = () => (
  <section
    id="contact"
    className="min-h-screen flex items-center justify-center py-24 bg-gradient-to-b from-gray-50 to-white"
  >
    <div className="max-w-7xl mx-auto px-6">
      {/* Header */}
      <div className="text-center mb-20">
        <span className="px-5 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
          Liên hệ với chúng tôi
        </span>

        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mt-6 mb-4">
          Kết nối với đội ngũ hỗ trợ
        </h2>

        <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
          Chúng tôi luôn đồng hành và sẵn sàng hỗ trợ bạn trong suốt hành trình học tập.
        </p>
      </div>

      {/* Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
        {/* Email */}
        <div className="group bg-white rounded-2xl p-10 border border-gray-100 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center justify-center w-14 h-14 bg-blue-600 rounded-xl mb-6 group-hover:bg-blue-700 transition-colors">
            <MailIcon className="h-7 w-7 text-white" />
          </div>

          <h3 className="text-xl font-semibold text-gray-900 mb-3">Email</h3>
          <p className="text-gray-600 text-sm leading-relaxed mb-5">
            Hỗ trợ nhanh chóng qua email 24/7 – phản hồi trong vòng vài giờ.
          </p>

          <a
            className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
            href="mailto:elearning@gmail.com"
          >
            elearning@gmail.com
          </a>
        </div>

        {/* Office */}
        <div className="group bg-white rounded-2xl p-10 border border-gray-100 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center justify-center w-14 h-14 bg-green-600 rounded-xl mb-6 group-hover:bg-green-700 transition-colors">
            <MapPinIcon className="h-7 w-7 text-white" />
          </div>

          <h3 className="text-xl font-semibold text-gray-900 mb-3">Văn phòng</h3>
          <p className="text-gray-600 text-sm leading-relaxed mb-5">
            Bạn có thể ghé thăm văn phòng chính để được hỗ trợ trực tiếp.
          </p>

          <Link
            className="text-green-600 hover:text-green-700 font-medium transition-colors"
            to=""
          >
            100 Nguyễn Văn A, <br /> Quận B, Đà Nẵng
          </Link>
        </div>

        {/* Phone */}
        <div className="group bg-white rounded-2xl p-10 border border-gray-100 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 md:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-center w-14 h-14 bg-purple-600 rounded-xl mb-6 group-hover:bg-purple-700 transition-colors">
            <PhoneIcon className="h-7 w-7 text-white" />
          </div>

          <h3 className="text-xl font-semibold text-gray-900 mb-3">Điện thoại</h3>
          <p className="text-gray-600 text-sm leading-relaxed mb-5">
            Giờ làm việc: Thứ 2 - Thứ 6, 8:00 - 17:00.
          </p>

          <a
            className="text-purple-600 hover:text-purple-700 font-medium transition-colors"
            href="tel:+84912345678"
          >
            +84 912 345 678
          </a>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center mt-20">
        <div className="inline-flex items-center px-8 py-4 bg-white border border-gray-200 rounded-xl shadow-sm">
          <span className="text-gray-700 font-semibold text-lg">
            Chúng tôi luôn đồng hành cùng bạn 🌟
          </span>
        </div>
      </div>
    </div>
  </section>
);

export default Contact;
