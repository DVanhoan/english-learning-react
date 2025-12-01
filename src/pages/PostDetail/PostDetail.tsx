import { useEffect, useState, useCallback, useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, List, MessageCircle } from "lucide-react";
import CommentParent from "@/components/CommentParent";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { AppUtils } from "@/utils/appUtils";
import routes from "@/routes/routes.const";
import { useQuery } from "@tanstack/react-query";
import { PostApi } from "@/api/post.api";
import LogoLoader from "@/components/LogoLoader";
import dayjs from "dayjs";

export interface Comment {
  id: number;
  author: string;
  avatar: string;
  content: string;
  date: string;
  likes: number;
  isLiked: boolean;
  replies: any[];
}

const initialComments: Comment[] = [
  {
    id: 1,
    author: "Minh Anh",
    avatar:
      "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=600",
    content:
      "Bài viết rất hữu ích! Tôi đã áp dụng phương pháp lặp lại ngắt quãng và thấy hiệu quả rõ rệt.",
    date: "2 giờ trước",
    likes: 12,
    isLiked: false,
    replies: [
      {
        id: 11,
        author: "Nguyễn Văn A",
        avatar:
          "https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=600",
        content:
          "Cảm ơn bạn! Rất vui khi biết phương pháp này hữu ích với bạn.",
        date: "1 giờ trước",
        likes: 3,
        isLiked: false,
      },
      {
        id: 12,
        author: "Thanh Hoa",
        avatar:
          "https://images.pexels.com/photos/415829/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=600",
        content:
          "Mình cũng đang thử phương pháp này, hy vọng sẽ có kết quả tốt!",
        date: "30 phút trước",
        likes: 1,
        isLiked: true,
      },
    ],
  },
  {
    id: 2,
    author: "Đức Minh",
    avatar:
      "https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=600",
    content:
      "Phương pháp tạo câu chuyện thật sự hiệu quả. Tôi đã thử và nhớ từ vựng lâu hơn rất nhiều. Cảm ơn tác giả!",
    date: "5 giờ trước",
    likes: 8,
    isLiked: true,
    replies: [],
  },
  {
    id: 3,
    author: "Lan Phương",
    avatar:
      "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=600",
    content:
      "Bạn có thể chia sẻ thêm về cách sử dụng Anki hiệu quả không? Mình mới bắt đầu dùng app này.",
    date: "1 ngày trước",
    likes: 5,
    isLiked: false,
    replies: [
      {
        id: 31,
        author: "Nguyễn Văn A",
        avatar:
          "https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=600",
        content:
          "Mình sẽ viết một bài chi tiết về Anki trong thời gian tới. Hiện tại bạn có thể bắt đầu với việc tạo deck theo chủ đề nhé!",
        date: "20 giờ trước",
        likes: 7,
        isLiked: false,
      },
    ],
  },
];

const commentFormSchema = z.object({
  content: z
    .string()
    .min(1, "Nội dung không được để trống")
    .max(500, "Không quá 500 ký tự"),
});

export default function PostDetail() {
  const navigate = useNavigate();
  const { slug: rawSlug } = useParams();
  const slug = rawSlug ? decodeURIComponent(rawSlug) : rawSlug;
  const [comments, _setComments] = useState<Comment[]>(initialComments);

  const isValidSlug = AppUtils.isValidSlug(slug);
  const postId = useMemo(() => {
    const id = Number((slug || "").split(".")[1]);
    return id;
  }, [slug]);
  const hasValidId = Number.isFinite(postId) && !Number.isNaN(postId);

  useEffect(() => {
    if (!isValidSlug) navigate(routes.NOT_FOUND);
  }, [isValidSlug, navigate]);

  const { data: postDetailData } = useQuery({
    queryKey: ["post", postId],
    queryFn: () => {
      return PostApi.getPost(postId).catch((error) => {
        navigate(routes.NOT_FOUND);
        throw error;
      });
    },
    enabled: isValidSlug && hasValidId,
  });

  const { data: releatedPostsData } = useQuery({
    queryKey: ["relatedPosts", postId],
    queryFn: () => PostApi.getRelatedPosts(postId),
    enabled: isValidSlug && hasValidId,
  });

  const commentForm = useForm<z.infer<typeof commentFormSchema>>({
    resolver: zodResolver(commentFormSchema),
    defaultValues: {
      content: "",
    },
  });

  const handleSubmitComment = (data: z.infer<typeof commentFormSchema>) => {
    console.log(data);
  };

  const [transformedContent, setTransformedContent] = useState<string | null>(
    null
  );
  const [toc, setToc] = useState<
    Array<{ id: string; text: string; level: number }>
  >([]);
  const [_, setActiveId] = useState<string | null>(null);

  const slugify = useCallback((str: string) => {
    return (
      str
        .normalize("NFKD")
        .replace(/\p{Diacritic}/gu, "")
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-") || "heading"
    );
  }, []);

  const extractTocAndInjectIds = useCallback(
    (html: string | undefined) => {
      if (!html) return { html: "", toc: [] as Array<any> };

      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const headings = Array.from(
        doc.querySelectorAll(
          "h1, h2, h3, h4, h5, h6, [role=heading], .heading, .title, .post-title"
        )
      );

      const seen: Record<string, number> = {};
      const tocArr: Array<{ id: string; text: string; level: number }> = [];

      headings.forEach((el) => {
        const text = el.textContent?.trim() || "";
        const baseId = slugify(text) || "heading";
        let id = baseId;
        if (seen[baseId] == null) seen[baseId] = 0;
        else seen[baseId] += 1;
        if (seen[baseId] > 0) id = `${baseId}-${seen[baseId]}`;

        el.id = id;

        const tag = el.tagName?.toUpperCase?.();
        let level = 2;
        if (tag && tag.startsWith("H") && tag.length === 2) {
          const n = Number(tag[1]);
          if (!Number.isNaN(n)) level = Math.max(1, Math.min(6, n));
        }
        level = Math.max(1, Math.min(3, level));
        tocArr.push({ id, text, level });
      });

      return { html: doc.body.innerHTML, toc: tocArr };
    },
    [slugify]
  );

  useEffect(() => {
    const html = postDetailData?.data.content;
    if (!html) {
      setTransformedContent(null);
      setToc([]);
      return;
    }

    const { html: injected, toc: extracted } = extractTocAndInjectIds(html);
    setTransformedContent(injected);
    setToc(extracted);
  }, [postDetailData?.data.content, extractTocAndInjectIds]);

  useEffect(() => {
    if (!toc || toc.length === 0) return;
    const obsOptions = {
      root: null,
      rootMargin: "-40% 0% -40% 0%",
      threshold: 0.1,
    } as IntersectionObserverInit;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const id = entry.target.id;
        if (entry.isIntersecting) {
          setActiveId(id);
        }
      });
    }, obsOptions);

    const ids = toc.map((t) => t.id);
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, [toc]);

  if (!isValidSlug) {
    return <LogoLoader />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="main-layout py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <article className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-6">
                <Badge className="bg-primary-color mb-4">
                  {postDetailData?.data.category.title}
                </Badge>
                <h1 className="text-3xl md:text-4xl font-bold mb-4 text-primary-color">
                  {postDetailData?.data.title}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        className="object-cover"
                        src={postDetailData?.data.author.avatarUrl}
                        alt={postDetailData?.data.author.fullName}
                      />
                      <AvatarFallback>
                        {postDetailData?.data.author.fullName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">
                      {postDetailData?.data.author.fullName}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {dayjs(postDetailData?.data.createdAt).format(
                        "DD/MM/YYYY"
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>
                      {postDetailData?.data.readingTimeMinutes} phút đọc
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="mb-6">
                  <div className="bg-white border rounded-md shadow-sm p-4">
                    <h3 className="text-lg font-semibold mb-2 flex flex-row items-center gap-2">
                      <List /> Mục lục
                    </h3>
                    {toc.length > 0 ? (
                      <nav aria-label="Table of contents">
                        <ul className="space-y-0.5 pl-4">
                          {toc.map((item) => (
                            <li
                              key={item.id}
                              className={`
          group relative transition-all
          ${item.level === 1 ? "font-semibold" : ""}
          ${item.level === 2 ? "pl-4" : ""}
          ${item.level === 3 ? "pl-8 text-sm text-gray-600" : ""}
        `}
                            >
                              <a
                                href={`#${item.id}`}
                                className="
            block py-1 text-gray-700 
            hover:text-primary-color
            hover:translate-x-1 transition-all
          "
                                onClick={(e) => {
                                  e.preventDefault();
                                  const el = document.getElementById(item.id);
                                  if (el) {
                                    el.scrollIntoView({
                                      behavior: "smooth",
                                      block: "center",
                                    });
                                    history.replaceState(
                                      null,
                                      "",
                                      `#${item.id}`
                                    );
                                  }
                                }}
                              >
                                <span className="before:absolute before:-left-3 before:top-1/2 before:h-1 before:w-1 before:rounded-full before:bg-gray-400 group-hover:before:bg-primary-color"></span>
                                {item.text}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </nav>
                    ) : (
                      <p className="text-sm text-gray-500">
                        Chưa có mục lục cho bài viết này.
                      </p>
                    )}
                  </div>
                </div>

                <div
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{
                    __html:
                      transformedContent ?? postDetailData?.data.content ?? "",
                  }}
                />
              </div>
            </article>

            {/* Comments Section */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Bình luận ({comments.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Add Comment */}
                <div className="space-y-3">
                  <Form {...commentForm}>
                    <form
                      onSubmit={commentForm.handleSubmit(handleSubmitComment)}
                      className="space-y-4"
                    >
                      <FormField
                        control={commentForm.control}
                        name="content"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mô tả</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Viết bình luận của bạn..."
                                className="min-h-[100px]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        variant="outline"
                        className="bg-primary-color text-white hover:bg-hover-primary-color hover:text-white cursor-pointer"
                      >
                        Đăng bình luận
                      </Button>
                    </form>
                  </Form>
                </div>

                {/* Comments List */}
                <div className="space-y-6">
                  {comments.map((comment) => (
                    <CommentParent comment={comment} key={comment.id} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="top-8 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Bài viết liên quan</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {releatedPostsData?.data.map((post) => (
                    <div key={post.id} className="flex gap-3">
                      <img
                        src={post.thumbnailUrl || "/placeholder.svg"}
                        alt={post.title}
                        className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm line-clamp-2 mb-1">
                          <Link
                            to={`/posts/${encodeURIComponent(
                              AppUtils.renderSlug(post.slug, post.id)
                            )}`}
                            className="hover:text-primary-color"
                          >
                            {post.title}
                          </Link>
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>
                            {dayjs(post.createdAt).format("DD/MM/YYYY")}
                          </span>
                          <span>•</span>
                          <span>{post.readingTimeMinutes} phút đọc</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
