import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Article as ArticleType } from "@shared/schema";
import ArticleContent from "@/components/blog/ArticleContent";
import RelatedPosts from "@/components/blog/RelatedPosts";
import CommentSection from "@/components/blog/CommentSection";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect } from "react";

export default function Article() {
  // Get the slug from the route
  const [match, params] = useRoute<{ slug: string }>("/article/:slug");
  const slug = params?.slug;

  // Fetch the article data
  const { data: article, isLoading: isLoadingArticle } = useQuery<ArticleType>({
    queryKey: [`/api/articles/${slug}`],
    enabled: !!slug,
  });

  // Fetch related articles
  const { data: articles, isLoading: isLoadingArticles } = useQuery<ArticleType[]>({
    queryKey: ['/api/articles'],
  });

  // Fetch comments for this article
  const { data: comments, isLoading: isLoadingComments } = useQuery({
    queryKey: [`/api/articles/${slug}/comments`],
    enabled: !!slug,
  });

  // Set the page title
  useEffect(() => {
    if (article) {
      document.title = `${article.title} | BlogSync`;
    }
    return () => {
      document.title = "BlogSync";
    };
  }, [article]);

  if (!match) {
    return <div>404 Not Found</div>;
  }

  return (
    <div className="container mx-auto py-10">
      {isLoadingArticle ? (
        <div className="mx-auto max-w-3xl px-4">
          <Skeleton className="h-10 w-2/3 mb-4" />
          <Skeleton className="h-6 w-full mb-2" />
          <Skeleton className="h-6 w-full mb-2" />
          <Skeleton className="h-6 w-3/4 mb-6" />
          <Skeleton className="h-8 w-full mb-2" />
          <Skeleton className="h-96 w-full rounded-xl mb-6" />
          <Skeleton className="h-6 w-full mb-2" />
          <Skeleton className="h-6 w-full mb-2" />
          <Skeleton className="h-6 w-full mb-2" />
        </div>
      ) : article ? (
        <>
          <ArticleContent article={article} />
          {!isLoadingArticles && articles && (
            <RelatedPosts articles={articles} currentArticleSlug={article.slug} />
          )}
          <CommentSection 
            comments={comments || []} 
            articleId={article.id} 
          />
        </>
      ) : (
        <div className="mx-auto max-w-3xl px-4 text-center py-12">
          <h2 className="text-2xl font-bold mb-2">Article Not Found</h2>
          <p className="text-muted-foreground">The article you're looking for doesn't exist or has been removed.</p>
        </div>
      )}
    </div>
  );
}
