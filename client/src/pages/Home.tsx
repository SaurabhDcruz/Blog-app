import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import FeaturedPost from "@/components/blog/FeaturedPost";
import ArticleCard from "@/components/blog/ArticleCard";
import NewsletterForm from "@/components/blog/NewsletterForm";
import SearchBar from "@/components/blog/SearchBar";
import { Article } from "@shared/schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [displayedArticles, setDisplayedArticles] = useState<Article[]>([]);
  const [page, setPage] = useState(1);
  const articlesPerPage = 6;

  const { data: articles, isLoading } = useQuery<Article[]>({
    queryKey: ['/api/articles'],
  });

  // Filter articles based on active category
  useEffect(() => {
    if (!articles) return;
    
    const filtered = activeCategory
      ? articles.filter(article => article.category.slug === activeCategory)
      : articles;
    
    setDisplayedArticles(filtered.slice(0, page * articlesPerPage));
  }, [articles, activeCategory, page]);

  // Check if we have more articles to load
  const hasMore = articles ? 
    displayedArticles.length < (activeCategory 
      ? articles.filter(article => article.category.slug === activeCategory).length 
      : articles.length) 
    : false;

  // Handler for "Load More" button
  const loadMore = () => {
    setPage(prev => prev + 1);
  };

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Hero section with search */}
      <section className="mb-16 text-center">
        <motion.h1 
          className="mb-4 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Discover Insightful Articles
        </motion.h1>
        <motion.p 
          className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground md:text-xl"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Stay updated with the latest trends, expert opinions, and in-depth analysis
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <SearchBar />
        </motion.div>
      </section>
      
      {/* Featured post */}
      <section className="mb-16">
        <h2 className="mb-8 text-2xl font-bold md:text-3xl">Featured Post</h2>
        
        {isLoading ? (
          <div className="h-96 w-full rounded-xl">
            <Skeleton className="h-full w-full" />
          </div>
        ) : articles && articles.length > 0 ? (
          <FeaturedPost article={articles[0]} />
        ) : (
          <div className="rounded-xl border border-dashed p-12 text-center">
            <p className="text-muted-foreground">No featured articles available</p>
          </div>
        )}
      </section>
      
      {/* Latest articles with category tabs */}
      <section className="mb-16">
        <h2 className="mb-8 text-2xl font-bold md:text-3xl">Latest Articles</h2>
        
        <Tabs defaultValue="all" className="mb-8" onValueChange={(value) => {
          setActiveCategory(value === "all" ? null : value);
          setPage(1);
        }}>
          <TabsList className="mb-6">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="technology">Technology</TabsTrigger>
            <TabsTrigger value="lifestyle">Lifestyle</TabsTrigger>
            <TabsTrigger value="business">Business</TabsTrigger>
            <TabsTrigger value="culture">Culture</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-0">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {isLoading ? (
                Array(6).fill(0).map((_, i) => (
                  <div key={i} className="h-72 rounded-lg">
                    <Skeleton className="h-full w-full" />
                  </div>
                ))
              ) : displayedArticles.length > 0 ? (
                displayedArticles.map((article, i) => (
                  <ArticleCard key={article.id} article={article} index={i} />
                ))
              ) : (
                <div className="col-span-3 rounded-lg border border-dashed p-12 text-center">
                  <p className="text-muted-foreground">No articles available</p>
                </div>
              )}
            </div>
            
            {hasMore && (
              <div className="mt-10 text-center">
                <Button onClick={loadMore} size="lg">
                  Load More
                </Button>
              </div>
            )}
          </TabsContent>
          
          {/* Repeat TabsContent for each category using the same pattern */}
          {["technology", "lifestyle", "business", "culture"].map(category => (
            <TabsContent key={category} value={category} className="mt-0">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {isLoading ? (
                  Array(6).fill(0).map((_, i) => (
                    <div key={i} className="h-72 rounded-lg">
                      <Skeleton className="h-full w-full" />
                    </div>
                  ))
                ) : displayedArticles.length > 0 ? (
                  displayedArticles.map((article, i) => (
                    <ArticleCard key={article.id} article={article} index={i} />
                  ))
                ) : (
                  <div className="col-span-3 rounded-lg border border-dashed p-12 text-center">
                    <p className="text-muted-foreground">No articles available in this category</p>
                  </div>
                )}
              </div>
              
              {hasMore && (
                <div className="mt-10 text-center">
                  <Button onClick={loadMore} size="lg">
                    Load More
                  </Button>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </section>
      
      {/* Newsletter subscription */}
      <section className="mb-10">
        <NewsletterForm />
      </section>
    </div>
  );
}
