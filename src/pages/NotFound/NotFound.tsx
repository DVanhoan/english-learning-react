import { Link } from "react-router-dom";

export default function Component() {
  return (
    <div className="flex items-center h-[calc(100vh-80px)] px-4 py-12 sm:px-6 md:px-8 lg:px-12 xl:px-16">
      <div className="w-full space-y-6 text-center">
        <div className="space-y-3">
          <h1 className="text-6xl font-bold tracking-tighter sm:text-8xl animate-bounce text-primary-color">
            404
          </h1>
          <p className="text-gray-500">
            Trang bạn đang tìm kiếm không tồn tại. Vui lòng kiểm tra đường dẫn
            hoặc quay về trang chủ.
          </p>
        </div>
        <Link
          to="/"
          className="inline-flex h-10 items-center rounded-md bg-primary-color px-8 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-primary-color/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
        >
          Trở về trang chủ
        </Link>
      </div>
    </div>
  );
}
