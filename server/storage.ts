import { 
  authors, type Author, type InsertAuthor,
  categories, type Category, type InsertCategory,
  articles, type Article, type InsertArticle,
  comments, type Comment, type InsertComment
} from "@shared/schema";
import { getReadingTime } from "../client/src/lib/utils";

export interface IStorage {
  // Authors
  getAllAuthors(): Promise<Author[]>;
  getAuthorById(id: number): Promise<Author | undefined>;
  createAuthor(author: InsertAuthor): Promise<Author>;

  // Categories
  getAllCategories(): Promise<Category[]>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;

  // Articles
  getAllArticles(): Promise<Article[]>;
  getArticleById(id: number): Promise<Article | undefined>;
  getArticleBySlug(slug: string): Promise<Article | undefined>;
  getArticlesByCategory(categorySlug: string): Promise<Article[]>;
  getArticlesByAuthorId(authorId: number): Promise<Article[]>;
  searchArticles(query: string): Promise<Article[]>;
  createArticle(article: InsertArticle): Promise<Article>;

  // Comments
  getCommentsByArticleId(articleId: number): Promise<Comment[]>;
  createComment(comment: InsertComment): Promise<Comment>;
}

export class MemStorage implements IStorage {
  private authors: Map<number, Author>;
  private categories: Map<number, Category>;
  private articles: Map<number, Article>;
  private comments: Map<number, Comment>;
  
  private authorId: number;
  private categoryId: number;
  private articleId: number;
  private commentId: number;

  constructor() {
    this.authors = new Map();
    this.categories = new Map();
    this.articles = new Map();
    this.comments = new Map();
    
    this.authorId = 1;
    this.categoryId = 1;
    this.articleId = 1;
    this.commentId = 1;
    
    this.initializeData();
  }
  
  private initializeData() {
    // Create authors
    const author1 = this.createAuthor({
      name: "Sarah Johnson",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
      bio: "Sarah is a senior tech writer with over 8 years of experience covering emerging technologies and digital transformation.",
      role: "Senior Tech Writer",
      articleCount: 24,
      followerCount: 1240,
      social: {
        twitter: "https://twitter.com/sarahjohnson",
        linkedin: "https://linkedin.com/in/sarahjohnson",
        website: "https://sarahjohnson.com",
        email: "sarah@example.com"
      }
    });
    
    const author2 = this.createAuthor({
      name: "David Chen",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
      bio: "David specializes in business strategy and leadership. Previously worked at Fortune 500 companies as a consultant.",
      role: "Business Analyst",
      articleCount: 18,
      followerCount: 830,
      social: {
        twitter: "https://twitter.com/davidchen",
        linkedin: "https://linkedin.com/in/davidchen",
        email: "david@example.com"
      }
    });

    const author3 = this.createAuthor({
      name: "Emily Davis",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
      bio: "Emily is a lifestyle blogger, photographer, and wellness advocate passionate about sustainable living and mindfulness.",
      role: "Lifestyle Editor",
      articleCount: 32,
      followerCount: 2150,
      social: {
        twitter: "https://twitter.com/emilydavis",
        instagram: "https://instagram.com/emilydavis",
        website: "https://emilydavis.com",
        email: "emily@example.com"
      }
    });

    const author4 = this.createAuthor({
      name: "Michael Brown",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
      bio: "Michael is a cultural critic and essayist focusing on the intersection of technology, art, and society.",
      role: "Cultural Editor",
      articleCount: 15,
      followerCount: 925,
      social: {
        twitter: "https://twitter.com/michaelbrown",
        linkedin: "https://linkedin.com/in/michaelbrown",
        email: "michael@example.com"
      }
    });
    
    // Create categories
    const techCategory = this.createCategory({
      name: "Technology",
      slug: "technology",
      description: "Latest news and insights about technology, innovation, and digital transformation"
    });
    
    const lifestyleCategory = this.createCategory({
      name: "Lifestyle",
      slug: "lifestyle",
      description: "Wellness, sustainability, personal growth, and living your best life"
    });
    
    const businessCategory = this.createCategory({
      name: "Business",
      slug: "business",
      description: "Business strategy, entrepreneurship, market trends, and leadership"
    });
    
    const cultureCategory = this.createCategory({
      name: "Culture",
      slug: "culture",
      description: "Art, music, literature, and the cultural phenomena shaping our world"
    });
    
    // Create articles
    const article1 = this.createArticle({
      title: "The Future of AI in Everyday Applications",
      slug: "future-of-ai-everyday-applications",
      excerpt: "How artificial intelligence is becoming an invisible but essential part of our daily digital experiences.",
      content: `
        <h2>The Quiet Revolution</h2>
        <p>Artificial intelligence has moved beyond the realm of science fiction to become an integral part of our everyday digital experiences. From the moment we wake up and check our personalized news feeds to the recommendations we receive throughout the day, AI is quietly working behind the scenes.</p>
        
        <p>The most effective AI implementations are often the ones we don't notice. They're seamlessly integrated into applications we use daily, making our digital experiences more intuitive and personalized without drawing attention to themselves.</p>
        
        <h2>Personal Assistants Evolve</h2>
        <p>Voice assistants like Siri, Alexa, and Google Assistant continue to evolve, becoming more conversational and capable of understanding context. The next generation of these assistants will move beyond simple command-response interactions to maintain ongoing conversations, remember your preferences, and anticipate your needs.</p>
        
        <p>We're already seeing the beginnings of this with features that allow assistants to maintain context across multiple queries and perform increasingly complex tasks that require coordination between different applications and services.</p>
        
        <h2>AI in Content Creation</h2>
        <p>Content creation tools powered by AI are transforming how we write, design, and produce media. From grammar correction and writing suggestions to automated video editing and image generation, these tools are making creative processes more accessible and efficient.</p>
        
        <p>The most exciting developments in this space involve collaborative AI, where the technology serves as a creative partner rather than just a tool. These systems can suggest ideas, provide feedback, and even learn your style and preferences over time.</p>
        
        <h2>The Challenges Ahead</h2>
        <p>As AI becomes more pervasive in our daily applications, we face important questions about privacy, transparency, and control. Users are increasingly demanding to know how their data is being used to train AI systems and what information is being collected about them.</p>
        
        <p>Responsible AI development requires clear communication about how AI makes decisions and what data it uses. It also means giving users meaningful control over their privacy and how personalized they want their experiences to be.</p>
        
        <h2>Looking Forward</h2>
        <p>The future of AI in everyday applications isn't about replacing human capabilities but augmenting them. The most successful implementations will be those that understand human needs and limitations, and use AI to overcome barriers and enhance our natural abilities.</p>
        
        <p>As these technologies continue to advance, the line between "using a computer" and "interacting with an AI" will continue to blur. The goal isn't to make AI more visible, but to make our digital experiences more human.</p>
      `,
      coverImage: "https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
      publishedAt: new Date("2023-09-15T09:30:00Z").toISOString(),
      authorId: author1.id,
      categoryId: techCategory.id,
      readingTime: 8,
      viewCount: 4520,
      isFeatured: true
    });
    
    const article2 = this.createArticle({
      title: "Sustainable Living: Small Changes, Big Impact",
      slug: "sustainable-living-small-changes-big-impact",
      excerpt: "Practical ways to incorporate sustainability into your daily routine without overhauling your entire lifestyle.",
      content: `
        <h2>Starting Your Sustainability Journey</h2>
        <p>The path to a more sustainable lifestyle doesn't require dramatic changes overnight. Instead, it's about making a series of small, manageable adjustments that collectively reduce your environmental footprint while enhancing your quality of life.</p>
        
        <p>The key is consistency rather than perfection. Even small changes, when adopted by many people, can have a significant positive impact on our planet.</p>
        
        <h2>Kitchen Sustainability</h2>
        <p>The kitchen offers numerous opportunities for sustainable practices. Start by reducing food waste through meal planning, proper storage, and creative use of leftovers. A shocking 30-40% of food in the United States goes to waste, so this simple change can have a substantial impact.</p>
        
        <p>Consider investing in reusable alternatives to single-use products: cloth napkins instead of paper, beeswax wraps instead of plastic wrap, and silicone baking mats instead of parchment paper. These durable replacements quickly pay for themselves while reducing waste.</p>
        
        <h2>Mindful Consumption</h2>
        <p>Before making a purchase, pause to consider whether you truly need the item. When you do need to buy something, look for options that are durable, repairable, and made from sustainable materials. This approach reduces waste and often results in higher-quality possessions that bring more satisfaction.</p>
        
        <p>Explore secondhand options through thrift stores, online marketplaces, and community swap events. Pre-owned items require no additional resources to produce and are usually more affordable.</p>
        
        <h2>Energy and Water Conservation</h2>
        <p>Simple habits like turning off lights when leaving a room, unplugging electronics when not in use, and washing clothes in cold water can significantly reduce your energy consumption without requiring any investment.</p>
        
        <p>Water conservation is equally important. Fix leaky faucets promptly, install low-flow showerheads, and consider native landscaping that requires less irrigation. These changes reduce both your utility bills and your environmental impact.</p>
        
        <h2>Community Engagement</h2>
        <p>Sustainable living extends beyond individual actions to community involvement. Support local farmers and businesses, participate in community clean-up events, and share sustainable practices with friends and family in a positive, non-judgmental way.</p>
        
        <p>By building a community around sustainable values, you create a supportive environment for continued growth and larger-scale changes that benefit everyone.</p>
      `,
      coverImage: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
      publishedAt: new Date("2023-09-12T14:15:00Z").toISOString(),
      authorId: author3.id,
      categoryId: lifestyleCategory.id,
      readingTime: 7,
      viewCount: 3870,
      isFeatured: false
    });
    
    const article3 = this.createArticle({
      title: "Remote Work Culture: Building Connection Across Distance",
      slug: "remote-work-culture-building-connection",
      excerpt: "Strategies for creating a strong, cohesive company culture when teams are distributed across different locations.",
      content: `
        <h2>The Remote Work Reality</h2>
        <p>Remote work has transcended its status as a temporary measure to become a permanent fixture in the modern workplace. Companies are now facing the challenge of maintaining their cultural identity and fostering connection when employees rarely or never share a physical space.</p>
        
        <p>A strong remote work culture doesn't happen by accident—it requires intentional design, consistent nurturing, and adaptability as teams evolve.</p>
        
        <h2>Intentional Communication</h2>
        <p>In a remote environment, communication must be more deliberate than in an office setting where informal interactions happen naturally. Successful remote teams establish clear communication channels for different purposes: synchronous tools like video calls for collaborative work and discussions, and asynchronous platforms for updates and documentation.</p>
        
        <p>Documentation becomes especially crucial in remote settings. When information is clearly recorded and easily accessible, it reduces dependency on specific team members being available at particular times—an important consideration when working across time zones.</p>
        
        <h2>Creating Virtual Watercoolers</h2>
        <p>The spontaneous conversations that happen in office break rooms play a vital role in building relationships and cross-pollinating ideas. Remote teams need virtual equivalents of these spaces where non-work conversations can flourish.</p>
        
        <p>This might take the form of dedicated chat channels for hobbies and interests, virtual coffee breaks paired across departments, or game sessions that bring people together for light-hearted competition and conversation.</p>
        
        <h2>Reimagining Team Rituals</h2>
        <p>Company traditions and rituals take on heightened importance in remote settings where shared experiences are less common. Adapt existing traditions to work virtually or create new ones that are designed specifically for distributed teams.</p>
        
        <p>Regular team retrospectives provide valuable opportunities to reflect on what's working well and what could be improved. These sessions can generate innovative ideas for strengthening culture while addressing emerging challenges.</p>
        
        <h2>Leadership's Crucial Role</h2>
        <p>Leaders set the tone for remote work culture through their behavior, communication style, and the systems they implement. Transparent leadership builds trust, while consistent check-ins provide structure and support without micromanagement.</p>
        
        <p>Effective remote leaders recognize and celebrate achievements publicly, making sure that accomplishments don't go unnoticed when people aren't physically present to receive acknowledgment.</p>
        
        <h2>The Future of Connection</h2>
        <p>As remote and hybrid work models continue to evolve, companies that excel at building connection across distance will enjoy significant advantages in employee satisfaction, retention, and productivity. The most successful will view remote work not as a compromise or limitation, but as an opportunity to create more inclusive, flexible, and resilient organizations.</p>
      `,
      coverImage: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
      publishedAt: new Date("2023-09-08T11:45:00Z").toISOString(),
      authorId: author2.id,
      categoryId: businessCategory.id,
      readingTime: 9,
      viewCount: 2940,
      isFeatured: false
    });
    
    const article4 = this.createArticle({
      title: "The Renaissance of Independent Bookstores",
      slug: "renaissance-independent-bookstores",
      excerpt: "How local bookshops are thriving in the digital age by creating community spaces and unique experiences.",
      content: `
        <h2>Defying Digital Predictions</h2>
        <p>When e-books and online retailers began their meteoric rise, many predicted the imminent demise of physical bookstores. Yet independent bookshops have not only survived but are experiencing a remarkable renaissance, opening at rates not seen in decades.</p>
        
        <p>This resurgence represents more than nostalgia—it reflects a fundamental shift in how consumers view shopping and community in an increasingly digital world.</p>
        
        <h2>Beyond Transactions to Experiences</h2>
        <p>Today's successful independent bookstores recognize that they're not merely selling books; they're offering experiences that cannot be replicated online. Thoughtfully designed spaces invite browsing and discovery, while knowledgeable staff provide personalized recommendations that algorithms cannot match.</p>
        
        <p>Many stores have expanded their offerings to include cafés, wine bars, and comfortable reading nooks that transform a quick shopping trip into a leisurely experience worth savoring.</p>
        
        <h2>Cultural Hubs and Community Anchors</h2>
        <p>Independent bookstores have positioned themselves as vital community centers where ideas are exchanged and connections are formed. Author readings, book clubs, writing workshops, and children's storytimes create regular gatherings that build loyalty and bring diverse community members together.</p>
        
        <p>These events transform bookstores from retail establishments into cultural institutions that contribute to the vibrancy and identity of their neighborhoods.</p>
        
        <h2>Curated Selection and Local Focus</h2>
        <p>While online retailers offer seemingly infinite selection, independent bookstores excel through careful curation. Each book on the shelf represents a deliberate choice by the bookseller, creating a more manageable and often more interesting selection than the overwhelming options online.</p>
        
        <p>Many stores highlight local authors and regional subjects, becoming important platforms for voices that might be overlooked by national retailers and algorithms.</p>
        
        <h2>Adapting to New Realities</h2>
        <p>The most successful independent bookstores embrace technology rather than resist it, using social media to build community, e-commerce to extend their reach, and point-of-sale systems to optimize inventory management.</p>
        
        <p>Many have also diversified their merchandise beyond books, offering carefully selected stationery, gifts, and apparel that complement their literary focus and provide additional revenue streams.</p>
        
        <h2>The Future of Independent Bookselling</h2>
        <p>As we continue to navigate the balance between digital convenience and authentic experience, independent bookstores offer valuable lessons for retail as a whole. They demonstrate that physical spaces can thrive alongside e-commerce when they offer something meaningful that cannot be digitized: human connection, sensory experiences, and the joy of discovery.</p>
        
        <p>The renaissance of independent bookstores isn't about rejecting technology or progress—it's about creating something richer and more human alongside it.</p>
      `,
      coverImage: "https://images.unsplash.com/photo-1521776943084-9a3512bd6311?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
      publishedAt: new Date("2023-09-05T16:20:00Z").toISOString(),
      authorId: author4.id,
      categoryId: cultureCategory.id,
      readingTime: 8,
      viewCount: 2105,
      isFeatured: false
    });
    
    const article5 = this.createArticle({
      title: "Blockchain Beyond Cryptocurrency: Real-World Applications",
      slug: "blockchain-beyond-cryptocurrency",
      excerpt: "Exploring how blockchain technology is transforming industries from supply chain management to healthcare and beyond.",
      content: `
        <h2>Beyond the Bitcoin Hype</h2>
        <p>While blockchain technology first captured public attention through cryptocurrencies like Bitcoin, its potential applications extend far beyond digital currencies. At its core, blockchain is a distributed ledger system that provides transparency, security, and immutability—qualities valuable in countless contexts where trust and verification are essential.</p>
        
        <p>As the technology matures, innovative implementations are emerging across diverse industries, solving real-world problems and creating new opportunities.</p>
        
        <h2>Supply Chain Revolution</h2>
        <p>Supply chain management represents one of the most promising applications for blockchain technology. By creating an immutable record of every transaction and movement in a product's journey, blockchain enables unprecedented transparency from origin to consumer.</p>
        
        <p>Food safety offers a compelling example. When contamination is detected, blockchain-enabled traceability can identify the specific source and distribution path within minutes rather than days, potentially saving lives and significantly reducing the scope and cost of recalls.</p>
        
        <h2>Healthcare Transformation</h2>
        <p>In healthcare, blockchain addresses critical challenges around data security, interoperability, and patient control. Electronic health records stored on blockchain systems can be securely shared between providers while maintaining patient privacy and consent management.</p>
        
        <p>Pharmaceutical supply chains benefit from blockchain's ability to verify authenticity and prevent counterfeit medications, while clinical trials gain transparency and integrity in their data collection and reporting processes.</p>
        
        <h2>Redefining Digital Identity</h2>
        <p>Blockchain offers promising solutions to the growing challenges of digital identity and personal data management. Self-sovereign identity systems built on blockchain allow individuals to control their personal information and selectively share verified credentials without revealing unnecessary data.</p>
        
        <p>These systems can provide secure, portable digital identities for underserved populations who lack traditional documentation, enabling access to financial services, healthcare, education, and voting rights.</p>
        
        <h2>Smart Contracts and Governance</h2>
        <p>Smart contracts—self-executing agreements with terms directly written into code—represent one of blockchain's most transformative capabilities. These automated contracts reduce the need for intermediaries in transactions ranging from real estate transfers to insurance claims processing.</p>
        
        <p>In governance applications, blockchain voting systems can increase transparency and security in elections while decentralized autonomous organizations (DAOs) explore new models for collective decision-making and resource allocation.</p>
        
        <h2>The Path Forward</h2>
        <p>Despite its promise, blockchain implementation still faces significant challenges, including scalability limitations, energy consumption concerns, regulatory uncertainty, and the need for widespread adoption to realize network effects.</p>
        
        <p>As these challenges are addressed through ongoing technical innovation and regulatory development, blockchain technology will likely become an invisible but essential infrastructure underlying many of the systems we interact with daily—much as the internet evolved from a technical novelty to a ubiquitous utility.</p>
      `,
      coverImage: "https://images.unsplash.com/photo-1639322537228-f710d846310a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
      publishedAt: new Date("2023-09-02T10:20:00Z").toISOString(),
      authorId: author1.id,
      categoryId: techCategory.id,
      readingTime: 10,
      viewCount: 3650,
      isFeatured: false
    });
    
    const article6 = this.createArticle({
      title: "Mindfulness Practices for Busy Professionals",
      slug: "mindfulness-practices-busy-professionals",
      excerpt: "Accessible meditation and mindfulness techniques that fit into hectic schedules and enhance productivity and wellbeing.",
      content: `
        <h2>The Mindfulness Paradox</h2>
        <p>The busier and more stressed we are, the more we need mindfulness—yet the harder it seems to find time for it. This paradox leads many professionals to view mindfulness practices as an unattainable luxury rather than an essential component of peak performance and wellbeing.</p>
        
        <p>Fortunately, effective mindfulness doesn't require hours of meditation or retreat from the world. Brief, strategic practices integrated throughout the day can yield substantial benefits while fitting into even the most demanding schedules.</p>
        
        <h2>Micro-Meditation Moments</h2>
        <p>Rather than viewing meditation as a lengthy, formal practice, consider incorporating "micro-meditations" throughout your day. These brief moments of mindfulness—often just 1-3 minutes—can be surprisingly effective at resetting your mental state and reducing stress levels.</p>
        
        <p>Try a minute of focused breathing before important meetings, during transitions between tasks, or when you feel tension building. Setting specific triggers (like receiving a challenging email or waiting for an elevator) can help build these micro-practices into your routine.</p>
        
        <h2>Mindful Transitions</h2>
        <p>The spaces between activities offer natural opportunities for mindfulness that don't require additional time. When moving between meetings, switching tasks, or commuting, bring full awareness to the transition itself rather than immediately shifting your attention to the next destination or responsibility.</p>
        
        <p>These mindful transitions create mental boundaries that can prevent the stress of one situation from contaminating the next, while giving your brain valuable processing time to consolidate information and insights.</p>
        
        <h2>Environmental Reminders</h2>
        <p>Our surroundings strongly influence our mental state, yet we often operate on autopilot in familiar environments. Create visual cues in your workspace that prompt moments of awareness and intention—perhaps a small plant, a meaningful quote, or simply a colored dot on your computer monitor.</p>
        
        <p>When you notice these cues, pause for a breath and check in with your current state: What's your posture like? Are you holding tension somewhere? What's the quality of your attention right now?</p>
        
        <h2>Technology-Assisted Mindfulness</h2>
        <p>While digital devices often pull us away from the present moment, thoughtfully selected apps and tools can actually support mindfulness. Brief guided meditations, gentle interval reminders to pause and breathe, and tools that track and visualize your practice can make mindfulness more accessible and consistent.</p>
        
        <p>Consider using workplace messaging statuses or calendar blocking to create dedicated space for these practices and communicate their importance to colleagues.</p>
        
        <h2>From Practice to Presence</h2>
        <p>The ultimate goal of mindfulness isn't to perfect meditation techniques, but to bring greater awareness, intention, and presence to all aspects of life. Over time, you may find that formal practices naturally evolve into a more mindful approach to everyday activities—from listening to colleagues more attentively to engaging with challenges more skillfully.</p>
        
        <p>This integration of mindfulness into daily professional life represents its most valuable form—not as another task on your to-do list, but as a fundamental shift in how you engage with all your responsibilities and relationships.</p>
      `,
      coverImage: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
      publishedAt: new Date("2023-08-28T15:40:00Z").toISOString(),
      authorId: author3.id,
      categoryId: lifestyleCategory.id,
      readingTime: 7,
      viewCount: 4210,
      isFeatured: false
    });
    
    const article7 = this.createArticle({
      title: "Data-Driven Decision Making for Small Businesses",
      slug: "data-driven-decision-making-small-businesses",
      excerpt: "How small and medium enterprises can leverage data analytics without enterprise-level resources or technical expertise.",
      content: `
        <h2>The Democratization of Data</h2>
        <p>Data-driven decision making is no longer exclusive to large corporations with dedicated analytics departments. Advances in technology have democratized access to powerful data tools, making them accessible and affordable for businesses of all sizes.</p>
        
        <p>Small businesses that embrace this shift gain a significant competitive advantage, making more informed decisions while remaining agile and responsive to changing conditions.</p>
        
        <h2>Starting with the Right Questions</h2>
        <p>Effective data analytics begins not with data or tools, but with clearly defined business questions. Identify the specific decisions you need to make and the information that would help make them better. This focused approach prevents the common pitfall of collecting data without a clear purpose.</p>
        
        <p>For retail businesses, key questions might include: Which products have the highest profit margins? What times of day see the most customer traffic? How effective was our latest marketing campaign in driving sales?</p>
        
        <h2>Accessible Analytics Tools</h2>
        <p>Modern analytics platforms offer user-friendly interfaces that don't require programming skills or statistical expertise. Many point-of-sale systems, e-commerce platforms, and CRM tools include built-in analytics that provide valuable insights with minimal setup.</p>
        
        <p>Free or low-cost tools like Google Analytics for website data, social media platform analytics, and basic visualization tools like Google Data Studio can provide powerful insights without significant investment.</p>
        
        <h2>Building a Data-Informed Culture</h2>
        <p>Beyond tools and techniques, successful data utilization requires nurturing a culture where information is valued, shared, and applied. Encourage team members at all levels to consider relevant data in their decision processes and to question assumptions.</p>
        
        <p>Create regular rhythms for reviewing key metrics and discussing their implications for the business. These reviews should focus not just on what the numbers show, but on generating actionable insights that lead to concrete improvements.</p>
        
        <h2>Common Pitfalls to Avoid</h2>
        <p>Even with the right tools and intentions, small businesses can struggle to derive value from their data efforts. Watch out for these common challenges: collecting too much data and becoming overwhelmed; focusing on vanity metrics that don't connect to business outcomes; or making decisions based on too small a sample size.</p>
        
        <p>Remember that data should inform decisions, not make them for you. The most effective approach combines data insights with human judgment, industry experience, and awareness of factors that may not be captured in your metrics.</p>
        
        <h2>Evolving Your Approach</h2>
        <p>As your comfort with data analytics grows, gradually expand your capabilities through targeted learning, strategic partnerships, or selective technology investments. Consider working with analytics consultants for specific projects before building in-house expertise.</p>
        
        <p>The goal isn't to implement enterprise-level analytics overnight, but to continuously improve your ability to make informed decisions that create competitive advantage and drive business growth.</p>
      `,
      coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
      publishedAt: new Date("2023-08-25T09:15:00Z").toISOString(),
      authorId: author2.id,
      categoryId: businessCategory.id,
      readingTime: 8,
      viewCount: 1875,
      isFeatured: false
    });
    
    const article8 = this.createArticle({
      title: "The Evolution of Street Art: From Vandalism to Fine Art",
      slug: "evolution-street-art-vandalism-fine-art",
      excerpt: "Tracing the journey of street art from criminalized graffiti to museum exhibitions and commissioned murals.",
      content: `
        <h2>Origins in the Margins</h2>
        <p>Street art emerged from the margins of society, with early graffiti writers in Philadelphia and New York City using urban surfaces as canvases for expression in the late 1960s and 1970s. What began as simple name tags evolved into increasingly elaborate pieces, with artists developing distinctive styles and pushing aesthetic boundaries despite the illegal nature of their work.</p>
        
        <p>These early practitioners operated under the constant threat of criminal charges, creating a subculture with its own rules, ethics, and artistic standards that existed largely outside mainstream recognition.</p>
        
        <h2>From Subway Cars to Gallery Walls</h2>
        <p>The transition of street art from vandalism to recognized art form began in the early 1980s, when galleries in New York City started exhibiting work by artists like Jean-Michel Basquiat and Keith Haring who had roots in street art. This controversial crossover sparked debates about authenticity, commercialization, and the implications of bringing outsider art into institutional spaces.</p>
        
        <p>While some artists successfully navigated this transition, many others continued to create solely in public spaces, maintaining that true street art exists in dialogue with the city rather than in commercial galleries.</p>
        
        <h2>Global Visual Language</h2>
        <p>By the early 2000s, street art had evolved into a global cultural phenomenon with distinctive regional variations. Artists like Banksy in the UK, Blu in Italy, and Os Gemeos in Brazil developed iconic styles that addressed local concerns while contributing to an international visual conversation about politics, consumerism, and urban life.</p>
        
        <p>The internet played a crucial role in this globalization, allowing artists to share their work internationally and gain recognition far beyond their local environments, while also influencing each other's techniques and approaches.</p>
        
        <h2>Institutional Recognition and Commercial Success</h2>
        <p>Major museums began acknowledging street art's cultural significance with landmark exhibitions like "Street Art" at London's Tate Modern in 2008 and "Art in the Streets" at the Museum of Contemporary Art in Los Angeles in 2011. These institutional endorsements coincided with skyrocketing commercial values for works by established street artists.</p>
        
        <p>This institutional and commercial success has created complex dynamics within the street art community, with ongoing debates about authenticity, selling out, and the inherent contradictions of commercializing an art form born from rebellion against authority and capitalism.</p>
        
        <h2>Urban Renewal Through Art</h2>
        <p>As attitudes toward street art evolved, cities began recognizing its potential for urban renewal and community engagement. Mural festivals and public art programs now commission street artists to create legal works that revitalize neighborhoods, attract tourism, and reflect community identity.</p>
        
        <p>These sanctioned projects offer artists the time and resources to create more elaborate works than would be possible under illegal conditions, while providing steady income and professional opportunities previously unavailable in this field.</p>
        
        <h2>The Future of Street Art</h2>
        <p>Today, street art exists in multiple forms simultaneously: as illegal interventions in urban space, as commissioned public art, as fine art in museums and galleries, and as commercial work for brands. Rather than seeing these as contradictions, many artists move fluidly between these contexts, adapting their practice to different opportunities while maintaining their distinctive voice.</p>
        
        <p>This flexibility suggests a future where the boundaries between street art and fine art continue to blur, creating new possibilities for artists to engage with public space, institutional critique, and commercial platforms on their own terms.</p>
      `,
      coverImage: "https://images.unsplash.com/photo-1575232171834-11afc0dcc64d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
      publishedAt: new Date("2023-08-22T14:30:00Z").toISOString(),
      authorId: author4.id,
      categoryId: cultureCategory.id,
      readingTime: 9,
      viewCount: 2450,
      isFeatured: false
    });
    
    const article9 = this.createArticle({
      title: "The Promise and Peril of Quantum Computing",
      slug: "promise-peril-quantum-computing",
      excerpt: "Understanding the revolutionary potential of quantum computers and the challenges they pose to current cryptography and security systems.",
      content: `
        <h2>A Computational Revolution</h2>
        <p>Quantum computing represents a fundamental shift in how we process information, harnessing the principles of quantum mechanics to perform calculations that would be practically impossible for classical computers. Unlike classical bits that exist in either a 0 or 1 state, quantum bits (qubits) can exist in superpositions of both states simultaneously, enabling exponential increases in computing power for certain problems.</p>
        
        <p>This isn't simply an incremental improvement in computing technology—it's a paradigm shift with profound implications across multiple domains.</p>
        
        <h2>Transformative Applications</h2>
        <p>Quantum computing's most promising applications lie in problems that involve massive computational complexity. Material science could see rapid acceleration in the discovery of new materials with specific properties, potentially revolutionizing fields from energy storage to medicine.</p>
        
        <p>Drug discovery and molecular modeling stand to benefit enormously, as quantum computers could simulate molecular interactions with unprecedented accuracy, potentially reducing the time and cost of developing new pharmaceuticals from years to months.</p>
        
        <p>In optimization problems—from supply chain logistics to financial portfolio management—quantum algorithms could find optimal solutions that would elude classical approaches, potentially creating significant economic value across industries.</p>
        
        <h2>The Cryptographic Challenge</h2>
        <p>Perhaps the most immediate and concerning impact of quantum computing involves cybersecurity. Many current encryption methods rely on the computational difficulty of problems like factoring large numbers—a task that quantum computers could theoretically handle efficiently using Shor's algorithm.</p>
        
        <p>This capability threatens to render vulnerable much of the cryptographic infrastructure that secures the internet, financial systems, and sensitive communications. Data that is securely encrypted today could potentially be decrypted in the future when sufficiently powerful quantum computers become available—a concern that has prompted the concept of "harvest now, decrypt later" attacks.</p>
        
        <h2>The Race for Quantum Supremacy</h2>
        <p>Nations and corporations are investing billions in quantum research, recognizing its strategic importance. The achievement of "quantum supremacy"—demonstrating a quantum computer's ability to solve problems that classical supercomputers cannot handle in a reasonable timeframe—has become a significant milestone in this competition.</p>
        
        <p>While early demonstrations of quantum supremacy have been achieved for specialized problems, practical quantum computers capable of solving real-world problems at scale remain years away, requiring significant advances in qubit stability, error correction, and scaling.</p>
        
        <h2>Quantum-Safe Security</h2>
        <p>In response to quantum computing's threat to current cryptographic systems, researchers are developing "post-quantum cryptography"—encryption methods that would resist quantum attacks. The National Institute of Standards and Technology (NIST) is leading efforts to standardize these new approaches.</p>
        
        <p>Organizations handling sensitive data with long-term security requirements are already beginning the transition to quantum-resistant cryptography, recognizing that this complex migration may take years to implement across systems.</p>
        
        <h2>Balancing Promise and Preparation</h2>
        <p>The quantum future requires balancing excitement about transformative possibilities with pragmatic preparation for disruption. While quantum computing promises solutions to previously intractable problems in science and industry, it also necessitates fundamental changes to our security infrastructure.</p>
        
        <p>This duality makes quantum computing one of the most consequential technological developments of our era—one that demands attention not just from technologists, but from policymakers, business leaders, and security professionals across all sectors.</p>
      `,
      coverImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
      publishedAt: new Date("2023-08-18T08:45:00Z").toISOString(),
      authorId: author1.id,
      categoryId: techCategory.id,
      readingTime: 9,
      viewCount: 3125,
      isFeatured: false
    });
    
    const article10 = this.createArticle({
      title: "Slow Travel: Rediscovering the Journey",
      slug: "slow-travel-rediscovering-journey",
      excerpt: "How the slow travel movement encourages deeper cultural immersion and more sustainable tourism through mindful, unhurried exploration.",
      content: `
        <h2>Beyond the Bucket List</h2>
        <p>In an era of Instagram-worthy destinations and competitive bucket list checking, slow travel offers a thoughtful alternative. Rather than racing between landmarks and major attractions, slow travelers prioritize quality over quantity, spending extended time in fewer places to develop a more meaningful connection with each location.</p>
        
        <p>This approach shifts the focus from consumption of experiences to genuine engagement with places and people, transforming travel from a collection of photographic trophies into a process of discovery and personal growth.</p>
        
        <h2>Living Like a Local</h2>
        <p>Slow travel often involves temporary integration into local communities through extended stays in residential neighborhoods, language learning, and participation in everyday activities. Renting apartments rather than staying in tourist hotels, shopping at local markets, and establishing routines that mirror local life all contribute to a more authentic understanding of place.</p>
        
        <p>These immersive experiences offer insights that remain inaccessible to travelers on whirlwind tours, revealing the cultural nuances, social dynamics, and daily rhythms that define a community's true character.</p>
        
        <h2>Sustainable by Design</h2>
        <p>Slow travel naturally aligns with sustainability by reducing the transportation emissions associated with rapid multi-destination itineraries. Staying longer in each place means fewer flights, train journeys, or car trips, significantly lowering a trip's carbon footprint.</p>
        
        <p>Beyond environmental benefits, slow travel distributes economic impact more equitably within communities. By patronizing neighborhood businesses, eating at locally-owned restaurants, and engaging with smaller cultural venues, slow travelers direct their spending toward the actual residents of a place rather than international tourism corporations.</p>
        
        <h2>Rediscovering the Journey</h2>
        <p>The slow travel philosophy extends to the physical journey between destinations, reclaiming transportation as an integral part of the travel experience rather than merely a means to an end. Choosing ground transportation options like trains, boats, or cycling tours transforms transit time from a necessary inconvenience into a valuable component of the adventure.</p>
        
        <p>These slower journeys reveal landscapes and communities that remain invisible to air travelers, providing a geographical context that enhances understanding of how places connect and transition into one another.</p>
        
        <h2>Digital Disconnection</h2>
        <p>Many slow travelers incorporate intentional digital disconnection into their journeys, limiting time spent on devices and social media to remain present in their experiences. This mindful approach creates space for spontaneous discoveries, conversations with locals, and the kind of serendipitous moments that often become the most treasured memories of a trip.</p>
        
        <p>Without the pressure to document everything for online sharing, travelers can fully engage with their surroundings through all their senses, creating richer and more personal memories than those captured through a camera lens.</p>
        
        <h2>Bringing Slow Travel Home</h2>
        <p>Perhaps the most valuable aspect of slow travel is how it influences travelers' perspectives even after returning home. The patience, cultural curiosity, and appreciation for simplicity cultivated during slow travel experiences often inspire more mindful and sustainable choices in everyday life.</p>
        
        <p>By approaching familiar surroundings with the same attentiveness they bring to foreign destinations, returned travelers can discover new dimensions of their own communities and continue the journey of discovery without leaving home.</p>
      `,
      coverImage: "https://images.unsplash.com/photo-1530521954074-e64f6810b32d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
      publishedAt: new Date("2023-08-15T12:35:00Z").toISOString(),
      authorId: author3.id,
      categoryId: lifestyleCategory.id,
      readingTime: 8,
      viewCount: 2890,
      isFeatured: false
    });
    
    const article11 = this.createArticle({
      title: "ESG Investing: Beyond the Hype",
      slug: "esg-investing-beyond-hype",
      excerpt: "Navigating the complexities of environmental, social, and governance investing to align portfolios with values while maintaining financial performance.",
      content: `
        <h2>Evolution of Responsible Investing</h2>
        <p>Environmental, Social, and Governance (ESG) investing represents the latest evolution in a long history of approaches to aligning investments with values. From early religious prohibitions on certain investments to socially responsible investing focused primarily on exclusions, the field has matured into today's more sophisticated integration of ESG factors into fundamental investment analysis.</p>
        
        <p>This evolution reflects growing recognition that environmental and social factors—from climate risk to labor practices—can materially impact financial performance, making ESG analysis relevant even for investors primarily focused on returns rather than values alignment.</p>
        
        <h2>The Data Challenge</h2>
        <p>Despite significant progress, ESG investing continues to face challenges in data quality, consistency, and comparability. Unlike financial reporting, which follows established accounting standards, ESG disclosure remains largely voluntary and unstandardized, with significant variations in what companies report and how they measure performance.</p>
        
        <p>This data landscape creates challenges for investors attempting to make meaningful comparisons between companies or to track improvement over time. Various rating agencies have developed their own methodologies to assess companies, but these ratings often diverge significantly in their conclusions about the same company.</p>
        
        <h2>Beyond Exclusions</h2>
        <p>Modern ESG investing has moved beyond simply excluding controversial industries to encompass a range of more nuanced approaches. ESG integration incorporates environmental, social, and governance factors into traditional financial analysis, while thematic investing focuses on specific issues like clean energy or gender diversity.</p>
        
        <p>Impact investing—which seeks measurable positive outcomes alongside financial returns—and active ownership strategies that use shareholder engagement to influence corporate behavior represent the leading edge of this evolution, offering investors more targeted ways to align their portfolios with specific values and goals.</p>
        
        <h2>Performance Considerations</h2>
        <p>The relationship between ESG factors and financial performance remains a central question for many investors. A growing body of research suggests that well-constructed ESG strategies need not sacrifice returns, with some studies indicating potential outperformance, particularly during market downturns or over longer time horizons.</p>
        
        <p>Rather than viewing ESG as a trade-off between values and returns, sophisticated investors increasingly recognize that environmental and social factors can identify both risks and opportunities that might be overlooked in traditional financial analysis, potentially leading to more resilient portfolios.</p>
        
        <h2>Regulatory Landscape</h2>
        <p>The regulatory environment for ESG investing is evolving rapidly, with implications for both investors and companies. The European Union has taken a leading role with its Sustainable Finance Disclosure Regulation (SFDR) and taxonomy for sustainable activities, while the U.S. Securities and Exchange Commission is developing climate disclosure rules.</p>
        
        <p>These developments aim to address concerns about "greenwashing"—the practice of making misleading environmental claims—while providing investors with more consistent, comparable information for decision-making.</p>
        
        <h2>The Path Forward</h2>
        <p>As ESG investing continues to mature, successful approaches will likely combine rigorous analysis of material ESG factors with clearly defined investment philosophies and transparent methodologies. Investors should look beyond simplified ESG ratings to understand the specific environmental, social, and governance factors most relevant to each investment's financial performance and alignment with their values.</p>
        
        <p>The future of ESG investing isn't about a one-size-fits-all approach, but about developing more sophisticated tools to understand how companies manage the complex environmental and social challenges of our time—and how these management practices translate into both financial and non-financial outcomes.</p>
      `,
      coverImage: "https://images.unsplash.com/photo-1579532536935-619928decd08?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
      publishedAt: new Date("2023-08-10T10:15:00Z").toISOString(),
      authorId: author2.id,
      categoryId: businessCategory.id,
      readingTime: 9,
      viewCount: 2150,
      isFeatured: false
    });
    
    const article12 = this.createArticle({
      title: "The Evolution of Music Production in the Digital Age",
      slug: "evolution-music-production-digital-age",
      excerpt: "How technology has democratized music creation, changing the industry landscape and enabling new forms of artistic expression.",
      content: `
        <h2>From Studios to Bedrooms</h2>
        <p>The most dramatic shift in music production over the past two decades has been the decentralization of the recording process. What once required expensive studio time, large-format consoles, and teams of engineers can now be accomplished on a laptop with readily available software. This democratization has opened music creation to diverse voices who previously faced significant financial barriers to entry.</p>
        
        <p>Bedroom producers working with minimal equipment have launched successful careers and pioneered new genres, challenging the traditional gatekeeping structures of the music industry and expanding the sonic landscape in ways that would have been impossible in the analog era.</p>
        
        <h2>The Digital Arsenal</h2>
        <p>Digital audio workstations (DAWs) like Ableton Live, FL Studio, and Logic Pro have become the central platforms for music creation, offering capabilities that would have required rooms of equipment just decades ago. These software environments combine recording, editing, mixing, and sound design in comprehensive packages that cost a fraction of their hardware predecessors.</p>
        
        <p>Virtual instruments and sampling technologies have further transformed production possibilities, giving musicians access to convincing emulations of everything from rare vintage synthesizers to orchestral ensembles. These tools have blurred the line between traditional composition and sound design, enabling producers to create hybrid sonic textures that defy conventional categorization.</p>
        
        <h2>Collaboration Without Boundaries</h2>
        <p>Digital technologies have eliminated geographical constraints on collaboration, allowing artists to work together across continents and time zones. Cloud-based platforms facilitate the exchange of session files and stems, enabling producers, vocalists, and instrumentalists to contribute to projects without ever being physically present in the same space.</p>
        
        <p>This distributed workflow has accelerated cross-cultural musical exchange and fostered unexpected artistic partnerships that have enriched popular music with diverse influences and perspectives—a creative silver lining to the increasingly connected global landscape.</p>
        
        <h2>New Production Aesthetics</h2>
        <p>Beyond merely replicating traditional recording processes more efficiently, digital tools have given rise to entirely new production aesthetics. Techniques like extreme time-stretching, granular synthesis, and algorithmic composition were either impossible or prohibitively difficult in the analog domain but are now accessible to any producer with standard software.</p>
        
        <p>These capabilities have spawned genres built around distinctly digital sonic signatures, from the glitchy textures of IDM to the hyper-processed vocals of contemporary pop. The computer has become not just a recording device but a creative instrument in its own right, with its unique capabilities shaping the sound of contemporary music.</p>
        
        <h2>Balancing Technology and Humanity</h2>
        <p>As production tools become increasingly powerful, many artists are grappling with questions about authenticity, creativity, and the human element in digitally-mediated music. Some embrace the pursuit of technical perfection through tools like pitch correction and quantization, while others deliberately introduce imperfections or analog elements to retain a sense of organic performance.</p>
        
        <p>This tension has produced interesting hybrid approaches that combine cutting-edge digital techniques with traditional performance practices—artists might record through vintage microphones into state-of-the-art interfaces, or manipulate acoustic instruments through complex digital processing chains to create sounds that exist in the space between analog and digital domains.</p>
        
        <h2>The Future Landscape</h2>
        <p>As we look ahead, artificial intelligence is poised to bring the next wave of transformation to music production. Already, AI tools can generate convincing musical elements, assist with mixing decisions, and even master recordings with minimal human intervention.</p>
        
        <p>Rather than replacing human creativity, these technologies are more likely to become collaborators in the creative process, handling technical aspects of production while allowing artists to focus on expression and aesthetic decisions. The most exciting possibilities lie not in automation alone, but in how these tools might expand our conception of what music can be and who can create it.</p>
      `,
      coverImage: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
      publishedAt: new Date("2023-08-05T16:50:00Z").toISOString(),
      authorId: author4.id,
      categoryId: cultureCategory.id,
      readingTime: 8,
      viewCount: 2720,
      isFeatured: false
    });
    
    // Create comments
    this.createComment({
      content: "This article provided such a clear explanation of how AI is becoming integrated into everyday applications. I particularly appreciated the section on personal assistants evolving beyond simple commands.",
      articleId: article1.id,
      authorId: author2.id,
      createdAt: new Date("2023-09-15T14:25:00Z").toISOString(),
      likes: 8
    });
    
    this.createComment({
      content: "As someone working in the AI field, I think this article does a great job of balancing the excitement of new capabilities with the very real privacy concerns. It's refreshing to see such a nuanced take.",
      articleId: article1.id,
      authorId: author3.id,
      createdAt: new Date("2023-09-16T09:10:00Z").toISOString(),
      likes: 12
    });
    
    this.createComment({
      content: "I've been trying to incorporate more sustainable practices into my routine, and this article gave me several new ideas I hadn't considered. The section on kitchen sustainability was particularly helpful!",
      articleId: article2.id,
      authorId: author4.id,
      createdAt: new Date("2023-09-13T16:40:00Z").toISOString(),
      likes: 5
    });
    
    this.createComment({
      content: "The challenge with remote work culture is maintaining the spontaneous creativity that comes from in-person collaboration. I'd love to see a follow-up article addressing that specific challenge.",
      articleId: article3.id,
      authorId: author1.id,
      createdAt: new Date("2023-09-09T13:15:00Z").toISOString(),
      likes: 7
    });
    
    this.createComment({
      content: "As someone who worked in a large bookstore chain that closed down, I've been watching the resurgence of independent bookstores with great interest. This article perfectly captures what makes them special in the digital age.",
      articleId: article4.id,
      authorId: author3.id,
      createdAt: new Date("2023-09-06T10:30:00Z").toISOString(),
      likes: 9
    });
  }

  // Author methods
  async getAllAuthors(): Promise<Author[]> {
    return Array.from(this.authors.values());
  }

  async getAuthorById(id: number): Promise<Author | undefined> {
    return this.authors.get(id);
  }

  createAuthor(author: InsertAuthor): Author {
    const id = this.authorId++;
    const newAuthor: Author = { ...author, id };
    this.authors.set(id, newAuthor);
    return newAuthor;
  }

  // Category methods
  async getAllCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return Array.from(this.categories.values()).find(
      category => category.slug === slug
    );
  }

  createCategory(category: InsertCategory): Category {
    const id = this.categoryId++;
    const newCategory: Category = { ...category, id };
    this.categories.set(id, newCategory);
    return newCategory;
  }

  // Article methods
  async getAllArticles(): Promise<Article[]> {
    return Array.from(this.articles.values());
  }

  async getArticleById(id: number): Promise<Article | undefined> {
    return this.articles.get(id);
  }

  async getArticleBySlug(slug: string): Promise<Article | undefined> {
    return Array.from(this.articles.values()).find(
      article => article.slug === slug
    );
  }

  async getArticlesByCategory(categorySlug: string): Promise<Article[]> {
    const category = await this.getCategoryBySlug(categorySlug);
    if (!category) return [];
    
    return Array.from(this.articles.values()).filter(
      article => article.category.slug === categorySlug
    );
  }

  async getArticlesByAuthorId(authorId: number): Promise<Article[]> {
    return Array.from(this.articles.values()).filter(
      article => article.author.id === authorId
    );
  }

  async searchArticles(query: string): Promise<Article[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.articles.values()).filter(article =>
      article.title.toLowerCase().includes(lowerQuery) ||
      article.excerpt.toLowerCase().includes(lowerQuery) ||
      article.content.toLowerCase().includes(lowerQuery) ||
      article.author.name.toLowerCase().includes(lowerQuery) ||
      article.category.name.toLowerCase().includes(lowerQuery)
    );
  }

  createArticle(articleData: InsertArticle): Article {
    const id = this.articleId++;
    const author = this.authors.get(articleData.authorId)!;
    const category = this.categories.get(articleData.categoryId)!;
    
    // Calculate reading time if not provided
    let readingTime = articleData.readingTime;
    if (!readingTime && articleData.content) {
      readingTime = getReadingTime(articleData.content);
    }
    
    const article: Article = {
      ...articleData,
      id,
      readingTime: readingTime || 5, // Default to 5 min if can't calculate
      author,
      category
    };
    
    this.articles.set(id, article);
    return article;
  }

  // Comment methods
  async getCommentsByArticleId(articleId: number): Promise<Comment[]> {
    return Array.from(this.comments.values()).filter(
      comment => comment.articleId === articleId
    );
  }

  createComment(commentData: InsertComment): Comment {
    const id = this.commentId++;
    const author = this.authors.get(commentData.authorId)!;
    
    const comment: Comment = {
      ...commentData,
      id,
      author
    };
    
    this.comments.set(id, comment);
    return comment;
  }
}

export const storage = new MemStorage();
