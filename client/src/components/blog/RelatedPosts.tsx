import { Article } from "@shared/schema";
import { Link } from "wouter";
import { formatDistanceToNow } from "date-fns";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

interface RelatedPostsProps {
  articles: Article[];
  currentArticleSlug: string;
}

export default function RelatedPosts({ articles, currentArticleSlug }: RelatedPostsProps) {
  // Filter out the current article
  const filteredArticles = articles
    .filter(article => article.slug !== currentArticleSlug)
    .slice(0, 3);
  
  if (filteredArticles.length === 0) {
    return null;
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h3 className="mb-6 text-2xl font-bold">Related Articles</h3>
      
      <div className="grid gap-6 md:grid-cols-3">
        {filteredArticles.map((article, index) => (
          <motion.div 
            key={article.id}
            className="group overflow-hidden rounded-lg border bg-card shadow-sm transition-all hover:shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Link href={`/article/${article.slug}`}>
              <div className="relative h-40 w-full overflow-hidden">
                <img
                  src={article.coverImage}
                  alt={article.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            </Link>
            
            <div className="p-4">
              <div className="mb-2 text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })}
              </div>
              
              <Link href={`/article/${article.slug}`}>
                <h4 className="mb-2 font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                  {article.title}
                </h4>
              </Link>
              
              <Link href={`/article/${article.slug}`} className="inline-flex items-center text-sm font-medium text-primary">
                <span>Read more</span>
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
