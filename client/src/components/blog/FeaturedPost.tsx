import { Link } from "wouter";
import { motion } from "framer-motion";
import { Article } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";
import CategoryBadge from "./CategoryBadge";

interface FeaturedPostProps {
  article: Article;
}

export default function FeaturedPost({ article }: FeaturedPostProps) {
  return (
    <motion.div 
      className="grid md:grid-cols-2 gap-6 overflow-hidden rounded-xl bg-white shadow-xl dark:bg-slate-900"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative h-64 md:h-full w-full overflow-hidden">
        <Link href={`/article/${article.slug}`}>
          <img 
            src={article.coverImage} 
            alt={article.title}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </Link>
      </div>
      
      <div className="flex flex-col justify-center p-6 md:p-8">
        <div className="mb-3 flex items-center gap-3">
          <CategoryBadge categorySlug={article.category.slug} name={article.category.name} />
          <span className="text-sm text-muted-foreground">
            {formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })}
          </span>
        </div>
        
        <Link href={`/article/${article.slug}`}>
          <h2 className="mb-4 text-3xl font-bold leading-tight hover:text-primary transition-colors">
            {article.title}
          </h2>
        </Link>
        
        <p className="mb-6 text-muted-foreground">
          {article.excerpt}
        </p>
        
        <div className="flex items-center">
          <Link href={`/author/${article.author.id}`}>
            <div className="flex items-center">
              <img
                src={article.author.avatar}
                alt={article.author.name}
                className="mr-3 h-10 w-10 rounded-full"
              />
              <div>
                <p className="font-medium">{article.author.name}</p>
                <p className="text-sm text-muted-foreground">{article.author.role}</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
