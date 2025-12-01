import { Link } from "react-router-dom";
import { Calendar, ArrowUpRight, User } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "../ui/badge";
import type { Post } from "@/types/post.type";
import dayjs from "dayjs";
import { AppUtils } from "@/utils/appUtils";

interface PostItemProps {
  post: Post;
  viewMode?: "grid" | "list";
}

export default function PostItem({ post, viewMode = "grid" }: PostItemProps) {
  if (viewMode === "list") {
    return (
      <div className="group relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 flex">
        <div className="relative w-48 h-32 flex-shrink-0 overflow-hidden">
          <img
            src={post.thumbnailUrl || "/placeholder.svg"}
            alt={post.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        <div className="flex flex-col flex-1 p-4">
          <div className="flex items-center gap-4 text-xs text-gray-600 mb-2 flex-wrap">
            <div className="flex items-center gap-2">
              <Avatar className="h-5 w-5">
                {post.author.avatarUrl ? (
                  <AvatarImage
                    src={post.author.avatarUrl}
                    alt={post.author.fullName}
                  />
                ) : null}
                <AvatarFallback className="text-xs">
                  {post.author.fullName ? (
                    post.author.fullName.charAt(0)
                  ) : (
                    <User size={12} />
                  )}
                </AvatarFallback>
              </Avatar>
              <span>{post.author.fullName}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar size={12} className="text-green-800" />
              <span>{dayjs(post.createdAt).format("DD/MM/YYYY")}</span>
              <Badge
                variant="secondary"
                className="bg-orange-500 text-white px-2 py-0.5 rounded-full text-[11px] font-medium shadow-sm hover:bg-orange-600 transition-colors"
              >
                {post.category.title}
              </Badge>
            </div>
          </div>

          <h3 className="text-base font-bold text-gray-900 line-clamp-2">
            <Link
              to={`/posts/${encodeURIComponent(
                AppUtils.renderSlug(post.slug, post.id)
              )}`}
              className="hover: text-primary-color"
            >
              {post.title}
            </Link>
          </h3>

          <p className="text-sm text-gray-600 line-clamp-2 flex-1">
            {post.excerpt}
          </p>

          <div className="flex items-center justify-between pt-2 border-t border-gray-100 mt-auto">
            <span className="text-xs text-gray-500">
              {post.readingTimeMinutes} phút đọc
            </span>
            <Link
              to={`/posts/${encodeURIComponent(
                AppUtils.renderSlug(post.slug, post.id)
              )}`}
              className="inline-flex items-center gap-1 text-primary-color hover:text-orange-600 font-medium text-xs transition-colors duration-200 group/link"
            >
              <span>Đọc thêm</span>
              <ArrowUpRight
                size={12}
                className="transition-transform duration-200 group-hover/link:translate-x-1 group-hover/link:-translate-y-1"
              />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 flex flex-col h-full">
      <Link
        to={`/posts/${encodeURIComponent(
          AppUtils.renderSlug(post.slug, post.id)
        )}`}
        className="block relative overflow-hidden"
      >
        <div className="aspect-[16/9] w-full overflow-hidden relative">
          <img
            src={post.thumbnailUrl || "/placeholder.svg"}
            alt={post.title}
            className="w-full h-full object-cover transform transition-transform duration-700 ease-in-out group-hover:scale-110"
          />
        </div>
      </Link>

      <div className="flex flex-col flex-1 p-5 space-y-3">
        <div className="flex items-center gap-3">
          <Avatar>
            {post.author.avatarUrl ? (
              <AvatarImage
                src={post.author.avatarUrl}
                alt={post.author.fullName}
              />
            ) : null}
            <AvatarFallback className="text-sm">
              {post.author.fullName ? (
                post.author.fullName.charAt(0)
              ) : (
                <User size={16} />
              )}
            </AvatarFallback>
          </Avatar>
          <div className="leading-tight">
            <div className="text-sm text-primary-color font-bold">
              {post.author.fullName}
            </div>
            <div className="text-xs text-gray-500">Tác giả</div>
          </div>
        </div>

        <h3 className="text-lg font-bold text-gray-900 line-clamp-2">
          <Link
            to={`/posts/${encodeURIComponent(
              AppUtils.renderSlug(post.slug, post.id)
            )}`}
            className="hover:text-primary-color"
          >
            {post.title}
          </Link>
        </h3>

        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 flex-1">
          {post.excerpt}
        </p>

        <div className="flex items-center gap-3 text-sm text-gray-600 flex-wrap">
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-green-800" />
            <span>{dayjs(post.createdAt).format("DD/MM/YYYY")}</span>
            <Badge
              variant="secondary"
              className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-sm hover:bg-orange-600 transition-colors"
            >
              {post.category.title}
            </Badge>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-auto">
          <span className="text-sm text-gray-500">
            {post.readingTimeMinutes} phút đọc
          </span>
          <Link
            to={`/posts/${encodeURIComponent(
              AppUtils.renderSlug(post.slug, post.id)
            )}`}
            className="inline-flex items-center gap-2 text-primary-color hover:text-orange-600 font-semibold text-sm transition-colors duration-200 group/link"
          >
            <span>Đọc thêm</span>
            <ArrowUpRight
              size={16}
              className="transition-transform duration-200 group-hover/link:translate-x-1 group-hover/link:-translate-y-1"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}
