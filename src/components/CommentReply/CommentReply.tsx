"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Comment } from "@/pages/PostDetail/PostDetail";
import { Button } from "../ui/button";
import { useState } from "react";
import { Reply } from "lucide-react";
import { Textarea } from "../ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface CommentReplyProps {
  replyComment: Comment;
}

const replySchema = z.object({
  content: z
    .string()
    .min(1, "Không được để trống")
    .max(500, "Không vượt quá 500 ký tự"),
});

export default function CommentReply({ replyComment }: CommentReplyProps) {
  const [isOpenReply, setOpenReply] = useState<boolean>(false);

  const form = useForm<z.infer<typeof replySchema>>({
    resolver: zodResolver(replySchema),
    defaultValues: {
      content: "",
    },
  });

  const onSubmit = (values: z.infer<typeof replySchema>) => {
    console.log("Reply:", values.content);
    form.reset(); // Xóa nội dung sau khi gửi
    setOpenReply(false);
  };

  return (
    <div key={replyComment.id} className="flex gap-3">
      <Avatar className="h-8 w-8">
        <AvatarImage
          className="object-cover"
          src={replyComment.avatar || "/placeholder.svg"}
          alt={replyComment.author}
        />
        <AvatarFallback>{replyComment.author.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-2">
        <div className="bg-slate-200 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-sm">{replyComment.author}</span>
            <span className="text-xs text-gray-500">{replyComment.date}</span>
          </div>
          <p className="text-sm">{replyComment.content}</p>
        </div>

        <div className="flex items-center gap-4 text-sm">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setOpenReply(true)}
            className="h-auto p-0 text-gray-500 cursor-pointer"
          >
            <Reply className="h-4 w-4 mr-1" />
            Trả lời
          </Button>
        </div>

        {/* Reply Form */}
        {isOpenReply && (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-3 mt-4"
            >
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder="Viết phản hồi..."
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-2">
                <Button type="submit" size="sm" className="cursor-pointer">
                  Phản hồi
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() => setOpenReply(false)}
                  className="cursor-pointer"
                >
                  Hủy
                </Button>
              </div>
            </form>
          </Form>
        )}
      </div>
    </div>
  );
}
