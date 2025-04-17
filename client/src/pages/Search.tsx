import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Article } from "@shared/schema";
import ArticleCard from "@/components/blog/ArticleCard";
import SearchBar from "@/components/blog/SearchBar";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Search() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(location.split('?')[1]);
  const query = searchParams.get('q') || '';
  
  const [page, setPage] = useState(1);
  const articlesPerPage = 9;
  const [filter, setFilter] = useState("all");
  
  // Fetch all articles
  const { data: allArticles, isLoading } = useQuery<Article[]>({
    queryKey: ['/api/articles'],
  });
  
  // Filter articles based on search query
  const filteredArticles = allArticles
    ? allArticles.filter(article => {
        const searchRegex = new RegExp(query, 'i');
        
        if (
          searchRegex.test(article.title) ||
          searchRegex.test(article.excerpt) ||
          searchRegex.test(article.content) ||
          searchRegex.test(article.author.name) ||
          searchRegex.test(article.category.name)
        ) {
          if (filter === "all") return true;
          if (filter === article.category.slug) return true;
          return false;
        }
        return false;
      })
    : [];
  
  // Calculate displayed articles based on pagination
  const articles = filteredArticles.slice(0, page * articlesPerPage);
  const hasMore = articles.length < filteredArticles.length;
  
  // Get unique categories from filtered articles
  const categories = filteredArticles
    .map(article => article.category)
    .filter((category, index, self) => 
      index === self.findIndex(c => c.slug === category.slug)
    );
  
  // Handle loading more articles
  const loadMore = () => {
    setPage(prev => prev + 1);
  };
  
  // Set the page title
  useEffect(() => {
    document.title = `Search results for "${query}" | BlogSync`;
    return () => {
      document.title = "BlogSync";
    };
  }, [query]);
  
  return (
    <div className="container mx-auto px-4 py-10">
      <header className="mb-10">
        <h1 className="mb-6 text-3xl font-bold">
          Search results for "<span className="text-primary">{query}</span>"
        </h1>
        
        <SearchBar />
      </header>
      
      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array(6).fill(0).map((_, i) => (
            <div key={i} className="h-72 rounded-lg">
              <Skeleton className="h-full w-full" />
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="mb-6">
            <p className="text-muted-foreground">
              Found {filteredArticles.length} result{filteredArticles.length !== 1 ? 's' : ''}
            </p>
          </div>
          
          {filteredArticles.length > 0 ? (
            <>
              <Tabs defaultValue="all" className="mb-6" onValueChange={setFilter}>
                <TabsList>
                  <TabsTrigger value="all">All Results</TabsTrigger>
                  {categories.map(category => (
                    <TabsTrigger key={category.slug} value={category.slug}>
                      {category.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                <TabsContent value="all" className="mt-6">
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
                </TabsContent>
                
                {categories.map(category => (
                  <TabsContent key={category.slug} value={category.slug} className="mt-6">
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {filteredArticles
                        .filter(article => article.category.slug === category.slug)
                        .slice(0, page * articlesPerPage)
                        .map((article, i) => (
                          <ArticleCard key={article.id} article={article} index={i} />
                        ))}
                    </div>
                    
                    {filteredArticles.filter(article => article.category.slug === category.slug).length > page * articlesPerPage && (
                      <div className="mt-10 text-center">
                        <Button onClick={loadMore} size="lg">
                          Load More
                        </Button>
                      </div>
                    )}
                  </TabsContent>
                ))}
              </Tabs>
            </>
          ) : (
            <div className="rounded-xl border border-dashed p-12 text-center">
              <p className="text-xl font-medium mb-2">No results found</p>
              <p className="text-muted-foreground">
                We couldn't find any articles matching your search. Try different keywords or browse our categories.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
