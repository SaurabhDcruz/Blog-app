import { Article } from "@shared/schema";
import { formatDistanceToNow, format } from "date-fns";
import { Facebook, Twitter, Linkedin, Copy, Bookmark, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import CategoryBadge from "./CategoryBadge";

interface ArticleContentProps {
  article: Article;
}

export default function ArticleContent({ article }: ArticleContentProps) {
  const { toast } = useToast();

  const handleShare = async (platform: string) => {
    const title = encodeURIComponent(article.title);
    const url = encodeURIComponent(window.location.href);
    
    let shareUrl = '';
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${title}&url=${url}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
      case 'copy':
        try {
          await navigator.clipboard.writeText(window.location.href);
          toast({
            title: "Link copied",
            description: "Article link has been copied to clipboard",
          });
          return;
        } catch (err) {
          toast({
            title: "Failed to copy",
            description: "Could not copy link to clipboard",
            variant: "destructive",
          });
          return;
        }
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  const handleBookmark = () => {
    toast({
      title: "Article bookmarked",
      description: "You can find this article in your bookmarks",
    });
  };

  return (
    <article className="mx-auto max-w-3xl px-4">
      <div className="mb-8">
        <div className="mb-4 flex items-center gap-3">
          <CategoryBadge categorySlug={article.category.slug} name={article.category.name} />
          <span className="text-sm text-muted-foreground">
            {formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })}
          </span>
        </div>
        
        <motion.h1 
          className="mb-4 text-4xl font-bold leading-tight tracking-tight md:text-5xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {article.title}
        </motion.h1>
        
        <p className="mb-6 text-xl text-muted-foreground">
          {article.excerpt}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img
              src={article.author.avatar}
              alt={article.author.name}
              className="mr-3 h-12 w-12 rounded-full"
            />
            <div>
              <p className="font-semibold">{article.author.name}</p>
              <div className="flex items-center text-sm text-muted-foreground">
                <time dateTime={article.publishedAt}>
                  {format(new Date(article.publishedAt), 'MMMM d, yyyy')}
                </time>
                <span className="mx-2">•</span>
                <span>{article.readingTime} min read</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button size="icon" variant="ghost" onClick={() => handleShare('copy')} aria-label="Copy link">
              <Copy className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" onClick={handleBookmark} aria-label="Bookmark article">
              <Bookmark className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" onClick={() => handleShare('twitter')} aria-label="Share on Twitter">
              <Twitter className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" onClick={() => handleShare('facebook')} aria-label="Share on Facebook">
              <Facebook className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" onClick={() => handleShare('linkedin')} aria-label="Share on LinkedIn">
              <Linkedin className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      <div className="relative mb-8 aspect-video w-full overflow-hidden rounded-xl">
        <img
          src={article.coverImage}
          alt={article.title}
          className="h-full w-full object-cover"
        />
      </div>
      
      <div className="prose prose-lg mx-auto dark:prose-invert prose-img:rounded-lg prose-headings:font-bold prose-a:text-primary">
        <div dangerouslySetInnerHTML={{ __html: article.content }} />
      </div>
      
      <Separator className="my-10" />
      
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h4 className="text-lg font-semibold">Share this article</h4>
          <p className="text-muted-foreground">If you found this article helpful</p>
        </div>
        
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => handleShare('twitter')} className="flex items-center gap-2">
            <Twitter className="h-4 w-4" />
            <span className="hidden sm:inline">Twitter</span>
          </Button>
          <Button size="sm" variant="outline" onClick={() => handleShare('facebook')} className="flex items-center gap-2">
            <Facebook className="h-4 w-4" />
            <span className="hidden sm:inline">Facebook</span>
          </Button>
          <Button size="sm" variant="outline" onClick={() => handleShare('linkedin')} className="flex items-center gap-2">
            <Linkedin className="h-4 w-4" />
            <span className="hidden sm:inline">LinkedIn</span>
          </Button>
          <Button size="sm" variant="outline" onClick={() => handleShare('copy')} className="flex items-center gap-2">
            <Copy className="h-4 w-4" />
            <span className="hidden sm:inline">Copy Link</span>
          </Button>
        </div>
      </div>
      
      <div className="mb-10 rounded-xl bg-slate-100 p-6 dark:bg-slate-800">
        <div className="flex items-center gap-4">
          <img
            src={article.author.avatar}
            alt={article.author.name}
            className="h-16 w-16 rounded-full"
          />
          <div>
            <h4 className="text-lg font-semibold">{article.author.name}</h4>
            <p className="text-muted-foreground">{article.author.bio}</p>
          </div>
        </div>
      </div>
    </article>
  );
}
