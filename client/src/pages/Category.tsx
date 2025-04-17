import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Article, Category as CategoryType } from "@shared/schema";
import ArticleCard from "@/components/blog/ArticleCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export default function Category() {
  // Get category slug from route
  const [match, params] = useRoute<{ slug: string }>("/category/:slug");
  const slug = params?.slug;
  
  const [page, setPage] = useState(1);
  const articlesPerPage = 9;
  
  // Fetch category details
  const { data: category, isLoading: isLoadingCategory } = useQuery<CategoryType>({
    queryKey: [`/api/categories/${slug}`],
    enabled: !!slug,
  });
  
  // Fetch articles for this category
  const { data: allArticles, isLoading: isLoadingArticles } = useQuery<Article[]>({
    queryKey: [`/api/categories/${slug}/articles`],
    enabled: !!slug,
  });
  
  // Calculate displayed articles based on pagination
  const articles = allArticles ? allArticles.slice(0, page * articlesPerPage) : [];
  const hasMore = allArticles ? articles.length < allArticles.length : false;
  
  // Handle loading more articles
  const loadMore = () => {
    setPage(prev => prev + 1);
  };
  
  // Set the page title
  useEffect(() => {
    if (category) {
      document.title = `${category.name} | BlogSync`;
    }
    return () => {
      document.title = "BlogSync";
    };
  }, [category]);
  
  if (!match) {
    return <div>404 Not Found</div>;
  }
  
  return (
    <div className="container mx-auto px-4 py-10">
      <header className="mb-10 text-center">
        {isLoadingCategory ? (
          <div className="mx-auto max-w-2xl">
            <Skeleton className="h-10 w-1/2 mx-auto mb-4" />
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-6 w-3/4 mx-auto" />
          </div>
        ) : category ? (
          <>
            <h1 className="mb-4 text-4xl font-bold">{category.name}</h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              {category.description}
            </p>
          </>
        ) : (
          <div className="mx-auto max-w-2xl">
            <h1 className="mb-4 text-4xl font-bold">Category Not Found</h1>
            <p className="text-lg text-muted-foreground">
              The category you're looking for doesn't exist or has been removed.
            </p>
          </div>
        )}
      </header>
      
      <main>
        {isLoadingArticles ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="h-72 rounded-lg">
                <Skeleton className="h-full w-full" />
              </div>
            ))}
          </div>
        ) : articles && articles.length > 0 ? (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((article, i) => (
                <ArticleCard key={article.id} article={article} index={i} />
              ))}
            </div>
            
            {hasMore && (
              <div className="mt-10 text-center">
                <Button onClick={loadMore} size="lg">
                  Load More
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="rounded-xl border border-dashed p-12 text-center">
            <p className="text-muted-foreground">No articles available in this category</p>
          </div>
        )}
      </main>
    </div>
  );
}
