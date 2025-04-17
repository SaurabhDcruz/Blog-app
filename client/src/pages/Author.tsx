import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Author as AuthorType, Article } from "@shared/schema";
import AuthorCard from "@/components/blog/AuthorCard";
import ArticleCard from "@/components/blog/ArticleCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect } from "react";

export default function Author() {
  // Get the author ID from the route
  const [match, params] = useRoute<{ id: string }>("/author/:id");
  const id = params?.id ? parseInt(params.id) : null;

  // Fetch the author data
  const { data: author, isLoading: isLoadingAuthor } = useQuery<AuthorType>({
    queryKey: [`/api/authors/${id}`],
    enabled: !!id,
  });

  // Fetch the author's articles
  const { data: articles, isLoading: isLoadingArticles } = useQuery<Article[]>({
    queryKey: [`/api/authors/${id}/articles`],
    enabled: !!id,
  });

  // Set the page title
  useEffect(() => {
    if (author) {
      document.title = `${author.name} | BlogSync`;
    }
    return () => {
      document.title = "BlogSync";
    };
  }, [author]);

  if (!match) {
    return <div>404 Not Found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-1">
          {isLoadingAuthor ? (
            <Skeleton className="h-[500px] w-full rounded-xl" />
          ) : author ? (
            <AuthorCard author={author} />
          ) : (
            <div className="rounded-xl border border-dashed p-12 text-center">
              <p className="text-muted-foreground">Author not found</p>
            </div>
          )}
        </div>
        
        <div className="md:col-span-2">
          <h2 className="mb-6 text-2xl font-bold">Articles by {author?.name || "Author"}</h2>
          
          <Tabs defaultValue="all" className="mb-6">
            <TabsList>
              <TabsTrigger value="all">All Articles</TabsTrigger>
              <TabsTrigger value="popular">Popular</TabsTrigger>
              <TabsTrigger value="recent">Recent</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-6">
              <div className="grid gap-6 sm:grid-cols-2">
                {isLoadingArticles ? (
                  Array(4).fill(0).map((_, i) => (
                    <div key={i} className="h-72 rounded-lg">
                      <Skeleton className="h-full w-full" />
                    </div>
                  ))
                ) : articles && articles.length > 0 ? (
                  articles.map((article, i) => (
                    <ArticleCard key={article.id} article={article} index={i} />
                  ))
                ) : (
                  <div className="col-span-2 rounded-lg border border-dashed p-12 text-center">
                    <p className="text-muted-foreground">No articles available</p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="popular" className="mt-6">
              <div className="grid gap-6 sm:grid-cols-2">
                {isLoadingArticles ? (
                  Array(4).fill(0).map((_, i) => (
                    <div key={i} className="h-72 rounded-lg">
                      <Skeleton className="h-full w-full" />
                    </div>
                  ))
                ) : articles && articles.length > 0 ? (
                  [...articles]
                    .sort((a, b) => b.viewCount - a.viewCount)
                    .map((article, i) => (
                      <ArticleCard key={article.id} article={article} index={i} />
                    ))
                ) : (
                  <div className="col-span-2 rounded-lg border border-dashed p-12 text-center">
                    <p className="text-muted-foreground">No articles available</p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="recent" className="mt-6">
              <div className="grid gap-6 sm:grid-cols-2">
                {isLoadingArticles ? (
                  Array(4).fill(0).map((_, i) => (
                    <div key={i} className="h-72 rounded-lg">
                      <Skeleton className="h-full w-full" />
                    </div>
                  ))
                ) : articles && articles.length > 0 ? (
                  [...articles]
                    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
                    .map((article, i) => (
                      <ArticleCard key={article.id} article={article} index={i} />
                    ))
                ) : (
                  <div className="col-span-2 rounded-lg border border-dashed p-12 text-center">
                    <p className="text-muted-foreground">No articles available</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
