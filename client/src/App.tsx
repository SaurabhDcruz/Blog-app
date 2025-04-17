import { Switch, Route } from "wouter";
import Home from "@/pages/Home";
import Article from "@/pages/Article";
import Author from "@/pages/Author";
import Category from "@/pages/Category";
import Search from "@/pages/Search";
import NotFound from "@/pages/not-found";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

function App() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <div className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/article/:slug" component={Article} />
          <Route path="/author/:id" component={Author} />
          <Route path="/category/:slug" component={Category} />
          <Route path="/search" component={Search} />
          <Route component={NotFound} />
        </Switch>
      </div>
      <Footer />
    </div>
  );
}

export default App;
