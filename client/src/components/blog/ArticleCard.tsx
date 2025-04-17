import { Link } from "wouter";
import { Article } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import CategoryBadge from "./CategoryBadge";

interface ArticleCardProps {
  article: Article;
  index: number;
}

export default function ArticleCard({ article, index }: ArticleCardProps) {
  return (
    <motion.article 
      className="overflow-hidden rounded-lg bg-white shadow-md transition-shadow hover:shadow-lg dark:bg-slate-900"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Link href={`/article/${article.slug}`}>
        <div className="relative h-48 w-full overflow-hidden">
          <img
            src={article.coverImage}
            alt={article.title}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
      </Link>
      
      <div className="p-5">
        <div className="mb-3 flex items-center gap-3">
          <CategoryBadge categorySlug={article.category.slug} name={article.category.name} />
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })}
          </span>
        </div>
        
        <Link href={`/article/${article.slug}`}>
          <h3 className="mb-2 text-xl font-bold hover:text-primary transition-colors line-clamp-2">
            {article.title}
          </h3>
        </Link>
        
        <p className="mb-4 text-muted-foreground line-clamp-2">
          {article.excerpt}
        </p>
        
        <div className="flex items-center justify-between">
          <Link href={`/author/${article.author.id}`}>
            <div className="flex items-center">
              <img
                src={article.author.avatar}
                alt={article.author.name}
                className="mr-2 h-8 w-8 rounded-full"
              />
              <span className="text-sm font-medium">{article.author.name}</span>
            </div>
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
