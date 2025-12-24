import express from 'express';

const router = express.Router();

// News articles data
const newsArticles = [
  {
    id: 1,
    title: "Annual Convocation 2024",
    category: "Events",
    date: "2024-12-10",
    excerpt: "Celebrating the achievements of our graduating class with distinguished guests and inspiring speeches.",
    content: "The Punjab College held its Annual Convocation ceremony on December 10, 2024, celebrating the outstanding achievements of our graduating students. The event was graced by distinguished guests from academia and industry, who shared their insights and experiences with the graduates. The ceremony highlighted the academic excellence and personal growth of our students, marking a significant milestone in their educational journey.",
    image: "/api/placeholder/800/400",
    author: "Dr. Sarah Johnson"
  },
  {
    id: 2,
    title: "Research Breakthrough in Computer Science",
    category: "Academics",
    date: "2024-12-08",
    excerpt: "Faculty members publish groundbreaking research in international journals on artificial intelligence.",
    content: "Our Computer Science department has achieved a significant milestone with the publication of groundbreaking research in leading international journals. Dr. Michael Chen and his team have developed innovative algorithms in machine learning that promise to revolutionize data analysis in healthcare. This research has garnered international attention and positions Punjab College as a leader in cutting-edge technology research.",
    image: "/api/placeholder/800/400",
    author: "Prof. Michael Chen"
  },
  {
    id: 3,
    title: "Admissions Open for Fall 2025",
    category: "Admissions",
    date: "2024-12-05",
    excerpt: "Applications are now being accepted for all undergraduate programs starting Fall 2025.",
    content: "Punjab College is pleased to announce that admissions are now open for the Fall 2025 semester across all undergraduate programs. We invite passionate students to join our vibrant academic community and pursue excellence in their chosen fields. The application process has been streamlined to ensure a smooth experience for all prospective students.",
    image: "/api/placeholder/800/400",
    author: "Admissions Office"
  },
  {
    id: 4,
    title: "New State-of-the-Art Laboratory Inaugurated",
    category: "Infrastructure",
    date: "2024-12-01",
    excerpt: "Modern research facilities equipped with cutting-edge technology now available to students.",
    content: "The college has inaugurated a new state-of-the-art research laboratory equipped with the latest technology and equipment. This facility will provide students with hands-on experience using industry-standard tools and will support advanced research projects across multiple disciplines. The laboratory represents our commitment to providing world-class educational infrastructure.",
    image: "/api/placeholder/800/400",
    author: "Infrastructure Team"
  },
  {
    id: 5,
    title: "Student Team Wins National Hackathon",
    category: "Achievements",
    date: "2024-11-28",
    excerpt: "Our students secured first place in the prestigious National Coding Championship.",
    content: "A team of Computer Science students from Punjab College has won the National Coding Championship, competing against teams from over 50 institutions across the country. Their innovative solution to real-world problems impressed the judges and demonstrated the high caliber of education and talent at our institution. This achievement brings great pride to our college community.",
    image: "/api/placeholder/800/400",
    author: "Student Affairs"
  },
  {
    id: 6,
    title: "International Collaboration Agreement Signed",
    category: "Partnerships",
    date: "2024-11-25",
    excerpt: "Partnership with leading European universities opens new opportunities for student exchange.",
    content: "Punjab College has signed a memorandum of understanding with several leading European universities, opening doors for student exchange programs, joint research initiatives, and collaborative academic projects. This partnership will provide our students with international exposure and opportunities to learn from diverse educational perspectives.",
    image: "/api/placeholder/800/400",
    author: "International Relations Office"
  },
  {
    id: 7,
    title: "Career Fair 2024: Record Industry Participation",
    category: "Career",
    date: "2024-11-20",
    excerpt: "Over 100 companies participated in this year's career fair, offering diverse opportunities.",
    content: "The annual Career Fair 2024 saw record participation from leading companies across various industries. Students had the opportunity to interact with recruiters, learn about career paths, and secure internships and job placements. The event strengthened industry-academia connections and helped students transition smoothly from education to professional careers.",
    image: "/api/placeholder/800/400",
    author: "Career Services"
  },
  {
    id: 8,
    title: "Sustainability Initiative Launches Campus-Wide",
    category: "Campus Life",
    date: "2024-11-15",
    excerpt: "New green campus program aims to reduce environmental impact and promote sustainability.",
    content: "Punjab College has launched a comprehensive sustainability initiative aimed at reducing the campus environmental footprint. The program includes solar panel installations, waste reduction measures, and educational campaigns to promote environmental awareness among students and staff. This initiative reflects our commitment to creating a sustainable future.",
    image: "/api/placeholder/800/400",
    author: "Sustainability Committee"
  }
];

// GET /api/news - Get all news articles
router.get('/', (req, res) => {
  try {
    // Optional filtering by category
    const { category } = req.query;
    
    let filteredNews = newsArticles;
    if (category && category !== 'all') {
      filteredNews = newsArticles.filter(
        article => article.category.toLowerCase() === category.toLowerCase()
      );
    }
    
    // Sort by date (newest first)
    filteredNews.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    res.json({
      success: true,
      count: filteredNews.length,
      data: filteredNews
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// GET /api/news/:id - Get single news article by ID
router.get('/:id', (req, res) => {
  try {
    const article = newsArticles.find(a => a.id === parseInt(req.params.id));
    
    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'News article not found'
      });
    }
    
    res.json({
      success: true,
      data: article
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

export default router;
