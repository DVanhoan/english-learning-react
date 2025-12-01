import type { Comment } from "@/pages/PostDetail/PostDetail";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "../ui/button";
import { Reply } from "lucide-react";
import CommentReply from "../CommentReply";
import { useState } from "react";

import { Textarea } from "../ui/textarea";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

interface CommentParentProps {
  comment: Comment;
}

const replySchema = z.object({
  reply: z
    .string()
    .min(1, "Nội dung không được để trống")
    .max(500, "Nội dung không được vượt quá 500 ký tự"),
});

type ReplyForm = z.infer<typeof replySchema>;

export default function CommentParent({ comment }: CommentParentProps) {
  const [isOpenReply, setOpenReply] = useState<boolean>(false);

  const form = useForm<ReplyForm>({
    resolver: zodResolver(replySchema),
    defaultValues: {
      reply: "",
    },
  });

  const onSubmit = (data: ReplyForm) => {
    console.log("Nội dung phản hồi:", data.reply);
    form.reset();
    setOpenReply(false);
  };

  return (
    <div key={comment.id} className="space-y-4">
      <div className="flex gap-4">
        <Avatar className="h-10 w-10">
          <AvatarImage
            className="object-cover"
            src={comment.avatar || "/placeholder.svg"}
            alt={comment.author}
          />
          <AvatarFallback>{comment.author.charAt(0)}</AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-2">
          <div className="bg-slate-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-semibold text-sm">{comment.author}</span>
              <span className="text-xs text-gray-500">{comment.date}</span>
            </div>
            <p className="text-sm">{comment.content}</p>
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
                  name="reply"
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
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setOpenReply(false)}
                    className="cursor-pointer"
                  >
                    Hủy
                  </Button>
                </div>
              </form>
            </Form>
          )}

          {comment.replies.length > 0 && (
            <div className="ml-6 space-y-4 border-l-2 border-gray-100 pl-4">
              {comment.replies.map((reply) => (
                <CommentReply replyComment={reply} key={reply.id} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
