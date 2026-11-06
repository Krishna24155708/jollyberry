/**
 * Event data for Eventura.
 * `daysFromNow` keeps every event in the future, so the site always shows
 * "upcoming" events and working countdowns, whenever it is opened.
 */
const CATEGORIES = [
  { id: "tech", label: "Tech", emoji: "💻" },
  { id: "music", label: "Music", emoji: "🎵" },
  { id: "business", label: "Business", emoji: "📈" },
  { id: "sports", label: "Sports", emoji: "🏃" },
  { id: "art", label: "Art & Culture", emoji: "🎨" },
  { id: "food", label: "Food", emoji: "🍜" }
];

const EVENTS = [
  {
    id: "e1", title: "CodeStorm 36-Hour Hackathon", category: "tech", featured: true,
    daysFromNow: 9, time: "09:00", venue: "Tech Park Convention Hall", city: "Bhubaneswar",
    price: 299, seats: 200,
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=70",
    short: "Build, break and ship real products with mentors and prizes worth ₹5 lakh.",
    description: "Form a team of up to four and spend 36 hours turning an idea into a working product. Industry mentors, free meals, and a final demo day judged by founders and engineers.",
    agenda: ["Opening keynote & problem statements", "Mentor office hours throughout", "Midnight snacks & game break", "Final demos and awards ceremony"]
  },
  {
    id: "e2", title: "Sunset Beats Music Festival", category: "music", featured: true,
    daysFromNow: 16, time: "17:30", venue: "Puri Beach Arena", city: "Puri",
    price: 999, seats: 1500,
    image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1200&q=70",
    short: "A beachside evening of live bands, DJs and food stalls under the open sky.",
    description: "Six live acts across indie, fusion and electronic music, set against the Bay of Bengal sunset. Food trucks, art installations and a silent-disco finale.",
    agenda: ["Gates open & sunset acoustic set", "Headline live performances", "DJ night", "Silent disco finale"]
  },
  {
    id: "e3", title: "Startup Summit 2026", category: "business", featured: true,
    daysFromNow: 23, time: "10:00", venue: "Grand Orchid Hotel", city: "Bhubaneswar",
    price: 1499, seats: 400,
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=70",
    short: "Founders, investors and operators share what actually works in building startups.",
    description: "A full-day summit with keynote talks, investor panels and a live pitch competition. Network with 400+ founders, VCs and early employees.",
    agenda: ["Keynote: Building from zero", "Investor panel", "Live pitch battle", "Networking lunch & evening mixer"]
  },
  {
    id: "e4", title: "City Half Marathon", category: "sports", featured: false,
    daysFromNow: 30, time: "05:30", venue: "Marine Drive Start Line", city: "Bhubaneswar",
    price: 499, seats: 800,
    image: "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?auto=format&fit=crop&w=1200&q=70",
    short: "21K, 10K and 5K routes through the city's greenest streets.",
    description: "Whether you're chasing a personal best or a fun finish, pick your distance. Includes timing chip, finisher medal, T-shirt and hydration points every 2 km.",
    agenda: ["Bib collection the day before", "Warm-up & flag-off", "Hydration & medical support en route", "Medal ceremony & breakfast"]
  },
  {
    id: "e5", title: "Odissi & Beyond: Dance Evening", category: "art", featured: false,
    daysFromNow: 12, time: "18:30", venue: "Rabindra Mandap", city: "Bhubaneswar",
    price: 350, seats: 300,
    image: "https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?auto=format&fit=crop&w=1200&q=70",
    short: "A showcase of classical Odissi with contemporary collaborations.",
    description: "Renowned dancers and young artists present an evening that bridges tradition and modern choreography, accompanied by live music.",
    agenda: ["Welcome & short talk on Odissi", "Classical performances", "Contemporary fusion", "Meet the artists"]
  },
  {
    id: "e6", title: "Street Food Carnival", category: "food", featured: false,
    daysFromNow: 6, time: "16:00", venue: "Ekamra Haat Grounds", city: "Bhubaneswar",
    price: 150, seats: 1000,
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=70",
    short: "60+ stalls serving regional favourites, desserts and fusion bites.",
    description: "Taste your way through Odisha and beyond. Live cooking demos, a dessert alley and a family-friendly kids' zone.",
    agenda: ["Stalls open", "Live cooking demos", "Eating challenge", "Live music & dessert alley"]
  },
  {
    id: "e7", title: "AI & Machine Learning Workshop", category: "tech", featured: false,
    daysFromNow: 14, time: "10:00", venue: "Innovation Lab, KIIT Campus", city: "Bhubaneswar",
    price: 0, seats: 120,
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=70",
    short: "A hands-on beginner-friendly day of building your first ML model.",
    description: "Learn the fundamentals of machine learning and train a working model in Python. Laptops required; all material is provided.",
    agenda: ["ML fundamentals", "Hands-on: data cleaning", "Hands-on: training a model", "Q&A and next steps"]
  },
  {
    id: "e8", title: "Indie Acoustic Night", category: "music", featured: false,
    daysFromNow: 4, time: "19:30", venue: "The Blue Door Café", city: "Bhubaneswar",
    price: 399, seats: 80,
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=70",
    short: "An intimate evening of original songs and soft guitars.",
    description: "Four local singer-songwriters, one cosy room. Limited seating, great coffee and even better music.",
    agenda: ["Doors & seating", "Artist sets", "Open mic segment", "Meet & greet"]
  },
  {
    id: "e9", title: "Women in Leadership Forum", category: "business", featured: false,
    daysFromNow: 38, time: "09:30", venue: "Mayfair Convention Centre", city: "Bhubaneswar",
    price: 799, seats: 250,
    image: "https://images.unsplash.com/photo-1475721027785-f74eca1e3ab2?auto=format&fit=crop&w=1200&q=70",
    short: "Conversations with leaders on growth, resilience and mentorship.",
    description: "Panels, fireside chats and small-group mentoring sessions with senior leaders from tech, finance, and public service.",
    agenda: ["Opening address", "Panel: Leading through change", "Mentoring circles", "Closing networking"]
  },
  {
    id: "e10", title: "Corporate Cricket Cup", category: "sports", featured: false,
    daysFromNow: 21, time: "08:00", venue: "Barabati Practice Ground", city: "Cuttack",
    price: 250, seats: 160,
    image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=1200&q=70",
    short: "T10 knockout tournament for office teams — or come to cheer.",
    description: "Teams of 11 battle it out in a one-day T10 knockout. Spectators welcome, with food stalls and live commentary.",
    agenda: ["Team check-in & toss", "Group matches", "Semi-finals", "Final & trophy presentation"]
  },
  {
    id: "e11", title: "Contemporary Art Walk", category: "art", featured: false,
    daysFromNow: 19, time: "16:00", venue: "Kala Bhoomi Gallery District", city: "Bhubaneswar",
    price: 0, seats: 150,
    image: "https://images.unsplash.com/photo-1536924940846-227afb31e2a5?auto=format&fit=crop&w=1200&q=70",
    short: "A guided walk through five galleries and live mural painting.",
    description: "Meet emerging artists, watch a mural come to life and join a short sketching session. Free entry — registration helps us plan.",
    agenda: ["Gathering at Gallery 1", "Guided gallery tour", "Live mural session", "Tea & conversations"]
  },
  {
    id: "e12", title: "Baking Masterclass: Artisan Breads", category: "food", featured: false,
    daysFromNow: 27, time: "11:00", venue: "Flour & Co. Studio", city: "Bhubaneswar",
    price: 899, seats: 24,
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=70",
    short: "Learn sourdough and focaccia from a professional baker.",
    description: "A relaxed, hands-on class where you'll knead, shape and bake your own loaves to take home. All equipment provided.",
    agenda: ["Dough science basics", "Shaping & scoring", "Baking & tasting", "Take-home loaf & recipes"]
  }
];
