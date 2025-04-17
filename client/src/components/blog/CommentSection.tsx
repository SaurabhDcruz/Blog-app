import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { ThumbsUp, Reply, MoreHorizontal, AlertTriangle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Comment } from "@shared/schema";

interface CommentSectionProps {
  comments: Comment[];
  articleId: number;
}

export default function CommentSection({ comments, articleId }: CommentSectionProps) {
  const [commentText, setCommentText] = useState("");
  const { toast } = useToast();

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!commentText.trim()) {
      toast({
        title: "Comment cannot be empty",
        description: "Please write something before submitting",
        variant: "destructive",
      });
      return;
    }
    
    // In a real application, we would send this to the server
    toast({
      title: "Comment submitted",
      description: "Your comment is awaiting moderation",
    });
    
    setCommentText("");
  };

  const handleLike = (commentId: number) => {
    toast({
      title: "Comment liked",
      description: "Thank you for your feedback",
    });
  };

  const handleReply = (commentId: number) => {
    setCommentText(`@${comments.find(c => c.id === commentId)?.author.name} `);
    document.getElementById("comment-textarea")?.focus();
  };

  const handleReport = (commentId: number) => {
    toast({
      title: "Comment reported",
      description: "Our team will review this comment",
    });
  };

  return (
    <div className="mx-auto max-w-3xl px-4">
      <h3 className="mb-6 text-2xl font-bold">Comments ({comments.length})</h3>
      
      <form onSubmit={handleSubmitComment} className="mb-8">
        <Textarea
          id="comment-textarea"
          placeholder="Join the conversation..."
          className="mb-3 min-h-[100px]"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
        <div className="flex justify-end">
          <Button type="submit">Post Comment</Button>
        </div>
      </form>
      
      <div className="space-y-6">
        {comments.length === 0 ? (
          <div className="rounded-lg border border-dashed p-6 text-center">
            <p className="text-muted-foreground">Be the first to comment on this article</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="rounded-lg bg-slate-50 p-4 dark:bg-slate-800/50">
              <div className="flex items-start gap-4">
                <Avatar>
                  <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
                  <AvatarFallback>{comment.author.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">{comment.author.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">More</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleReport(comment.id)}>
                          <AlertTriangle className="mr-2 h-4 w-4" />
                          <span>Report</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  <div className="mt-2">
                    <p>{comment.content}</p>
                  </div>
                  
                  <div className="mt-3 flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-1 text-sm"
                      onClick={() => handleLike(comment.id)}
                    >
                      <ThumbsUp className="h-4 w-4" />
                      <span>{comment.likes}</span>
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-1 text-sm"
                      onClick={() => handleReply(comment.id)}
                    >
                      <Reply className="h-4 w-4" />
                      <span>Reply</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
