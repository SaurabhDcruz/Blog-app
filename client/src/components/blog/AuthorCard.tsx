import { Author } from "@shared/schema";
import { Twitter, Linkedin, Globe, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface AuthorCardProps {
  author: Author;
}

export default function AuthorCard({ author }: AuthorCardProps) {
  return (
    <motion.div 
      className="overflow-hidden rounded-xl bg-white shadow-lg dark:bg-slate-900"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 h-32"></div>
      <div className="px-6 py-6">
        <div className="flex flex-col items-center -mt-20">
          <img
            src={author.avatar}
            alt={author.name}
            className="h-24 w-24 rounded-full border-4 border-white dark:border-slate-900 mb-4"
          />
          <h2 className="text-2xl font-bold">{author.name}</h2>
          <p className="text-muted-foreground">{author.role}</p>
          
          <div className="flex items-center gap-3 mt-3">
            {author.social?.twitter && (
              <a href={author.social.twitter} target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="icon" aria-label="Twitter">
                  <Twitter size={20} />
                </Button>
              </a>
            )}
            {author.social?.linkedin && (
              <a href={author.social.linkedin} target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="icon" aria-label="LinkedIn">
                  <Linkedin size={20} />
                </Button>
              </a>
            )}
            {author.social?.website && (
              <a href={author.social.website} target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="icon" aria-label="Website">
                  <Globe size={20} />
                </Button>
              </a>
            )}
            {author.social?.email && (
              <a href={`mailto:${author.social.email}`}>
                <Button variant="ghost" size="icon" aria-label="Email">
                  <Mail size={20} />
                </Button>
              </a>
            )}
          </div>
        </div>
        
        <div className="mt-6">
          <h3 className="font-semibold mb-2">About</h3>
          <p className="text-muted-foreground">{author.bio}</p>
        </div>
        
        <div className="mt-6">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="rounded-lg bg-slate-100 p-4 dark:bg-slate-800">
              <p className="text-2xl font-bold">{author.articleCount}</p>
              <p className="text-sm text-muted-foreground">Articles</p>
            </div>
            <div className="rounded-lg bg-slate-100 p-4 dark:bg-slate-800">
              <p className="text-2xl font-bold">{author.followerCount}</p>
              <p className="text-sm text-muted-foreground">Followers</p>
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <Button className="w-full">Follow Author</Button>
        </div>
      </div>
    </motion.div>
  );
}
