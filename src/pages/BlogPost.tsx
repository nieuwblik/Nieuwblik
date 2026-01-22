import { useParams, Link, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import SEOHead from "@/components/SEOHead";
import { Clock, ArrowLeft, Phone, Menu } from "lucide-react";
import { blogPosts } from "@/data/blogPosts";
import justinImg from "@/assets/justin-slok.png";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { motion, useReducedMotion } from "framer-motion";
import { fadeUp, staggerContainer, scaleUp, easings } from "@/lib/motion";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  items: TocItem[];
  activeSection: string;
  onItemClick: (id: string) => void;
  shouldReduceMotion: boolean | null;
}

const TableOfContents = ({ items, activeSection, onItemClick, shouldReduceMotion }: TableOfContentsProps) => (
  <nav className="sticky top-32 max-h-[calc(100vh-10rem)] overflow-y-auto">
    <h3 className="text-lg font-semibold mb-4">Inhoudsopgave</h3>
    <ul className="space-y-2 text-sm">
      {items.map((item, index) => (
        <motion.li
          key={item.id}
          className={item.level === 3 ? "ml-4" : ""}
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{
            delay: shouldReduceMotion ? 0 : index * 0.03,
            duration: 0.3,
            ease: easings.easeOutExpo
          }}
          viewport={{ once: true }}
        >
          <button
            onClick={() => onItemClick(item.id)}
            className={`text-left w-full py-1 px-2 rounded transition-colors ${activeSection === item.id
              ? "text-accent font-semibold bg-accent/10"
              : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
          >
            {item.text}
          </button>
        </motion.li>
      ))}
    </ul>
  </nav>
);

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState("");
  const [tocItems, setTocItems] = useState<TocItem[]>([]);
  const shouldReduceMotion = useReducedMotion();

  const post = blogPosts.find(p => p.slug === slug);

  const structuredData = post ? {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title.nl,
    "description": post.excerpt.nl,
    "image": `https://www.nieuwblik.com/blog/${slug}.jpg`,
    "datePublished": post.date,
    "dateModified": post.date,
    "author": {
      "@type": "Person",
      "name": "Justin Slok",
      "url": "https://www.nieuwblik.com/over-ons"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Nieuwblik",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.nieuwblik.com/logo.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://www.nieuwblik.com/blog/${slug}`
    }
  } : null;

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      const scrolled = window.scrollY;
      const progress = scrolled / documentHeight * 100;
      setScrollProgress(Math.min(progress, 100));

      // Update active section based on scroll position
      const headings = document.querySelectorAll('h2[id], h3[id]');
      let current = "";
      headings.forEach(heading => {
        const rect = heading.getBoundingClientRect();
        if (rect.top <= 100) {
          current = heading.id;
        }
      });
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (post) {
      const content = post.content.nl;
      const headings: TocItem[] = [];
      const lines = content.split('\n');
      lines.forEach(line => {
        if (line.startsWith('## ')) {
          const text = line.replace('## ', '');
          const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
          headings.push({ id, text, level: 2 });
        } else if (line.startsWith('### ')) {
          const text = line.replace('### ', '');
          const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
          headings.push({ id, text, level: 3 });
        }
      });
      setTocItems(headings);
    }
  }, [post]);

  const formatContent = (content: string) => {
    const sections = content.trim().split('\n\n');
    return sections.map((section, index) => {
      // Main title (H1)
      if (section.startsWith('# ')) {
        return (
          <motion.h1
            key={index}
            className="text-3xl md:text-4xl font-bold mb-6 mt-8 first:mt-0"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, ease: easings.easeOutExpo }}
          >
            {section.replace('# ', '')}
          </motion.h1>
        );
      }

      // H2 with anchor
      if (section.startsWith('## ')) {
        const text = section.replace('## ', '');
        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        return (
          <motion.h2
            key={index}
            id={id}
            className="text-2xl md:text-3xl font-bold mb-4 mt-8 scroll-mt-24"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, ease: easings.easeOutExpo }}
          >
            {text}
          </motion.h2>
        );
      }

      // H3 with anchor
      if (section.startsWith('### ')) {
        const text = section.replace('### ', '');
        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        return (
          <motion.h3
            key={index}
            id={id}
            className="text-xl md:text-2xl font-semibold mb-3 mt-6 scroll-mt-24"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.4, ease: easings.easeOutExpo }}
          >
            {text}
          </motion.h3>
        );
      }

      // Blockquote
      if (section.startsWith('> ')) {
        return (
          <motion.blockquote
            key={index}
            className="border-l-4 border-accent pl-4 italic text-base md:text-lg my-6 text-muted-foreground"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, ease: easings.easeOutExpo }}
          >
            {section.replace('> ', '')}
          </motion.blockquote>
        );
      }

      // Markdown table
      if (section.includes('|') && section.includes('---')) {
        const lines = section.split('\n').filter(line => line.trim());
        if (lines.length >= 2) {
          const headerLine = lines[0];
          const dataLines = lines.slice(2);
          const headers = headerLine.split('|').map(h => h.trim()).filter(h => h);

          return (
            <motion.div
              key={index}
              className="my-6 overflow-x-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, ease: easings.easeOutExpo }}
            >
              <table className="w-full border-collapse border border-border rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-secondary">
                    {headers.map((header, i) => (
                      <th key={i} className="border border-border px-4 py-3 text-left font-semibold text-sm">
                        {header.replace(/\*\*/g, '')}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {dataLines.map((line, rowIndex) => {
                    const cells = line.split('|').map(c => c.trim()).filter(c => c);
                    return (
                      <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-background' : 'bg-secondary/30'}>
                        {cells.map((cell, cellIndex) => (
                          <td key={cellIndex} className="border border-border px-4 py-3 text-sm">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </motion.div>
          );
        }
      }

      // Numbered list
      if (section.match(/^\d+\.\s/m)) {
        const items = section.split('\n').filter(line => line.match(/^\d+\.\s/));
        return (
          <motion.ol
            key={index}
            className="list-decimal list-inside space-y-2 my-4 text-base"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, ease: easings.easeOutExpo }}
          >
            {items.map((item, i) => {
              const text = item.replace(/^\d+\.\s/, '');
              const parts = text.split('**');
              return (
                <motion.li
                  key={i}
                  className="text-foreground font-light"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{
                    delay: shouldReduceMotion ? 0 : i * 0.05,
                    duration: 0.3,
                    ease: easings.easeOutExpo
                  }}
                >
                  {parts.map((part, j) => j % 2 === 1 ? <strong key={j} className="font-semibold">{part}</strong> : part)}
                </motion.li>
              );
            })}
          </motion.ol>
        );
      }

      // Unordered list
      if (section.includes('\n- ') || section.startsWith('- ')) {
        const items = section.split('\n').filter(line => line.startsWith('- '));
        return (
          <motion.ul
            key={index}
            className="list-disc list-inside space-y-2 my-4 text-base"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, ease: easings.easeOutExpo }}
          >
            {items.map((item, i) => {
              const text = item.replace('- ', '');
              const parts = text.split('**');
              return (
                <motion.li
                  key={i}
                  className="text-foreground font-light"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{
                    delay: shouldReduceMotion ? 0 : i * 0.05,
                    duration: 0.3,
                    ease: easings.easeOutExpo
                  }}
                >
                  {parts.map((part, j) => j % 2 === 1 ? <strong key={j} className="font-semibold">{part}</strong> : part)}
                </motion.li>
              );
            })}
          </motion.ul>
        );
      }

      // Code block
      if (section.startsWith('```')) {
        const lines = section.split('\n');
        const code = lines.slice(1, -1).join('\n');
        return (
          <motion.pre
            key={index}
            className="bg-secondary p-6 rounded-lg my-6 overflow-x-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, ease: easings.easeOutExpo }}
          >
            <code className="text-sm font-mono whitespace-pre">{code || section.replace(/```/g, '').trim()}</code>
          </motion.pre>
        );
      }

      // Inline code
      if (section.startsWith('`') && section.endsWith('`')) {
        const code = section.replace(/`/g, '').trim();
        return (
          <motion.pre
            key={index}
            className="bg-secondary p-6 rounded-lg my-6 overflow-x-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, ease: easings.easeOutExpo }}
          >
            <code className="text-sm font-mono">{code}</code>
          </motion.pre>
        );
      }

      // Emoji bullets
      if (section.match(/^[❌✅]/m)) {
        const lines = section.split('\n');
        return (
          <motion.ul
            key={index}
            className="space-y-3 my-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, ease: easings.easeOutExpo }}
          >
            {lines.map((line, i) => {
              const text = line.slice(2);
              const parts = text.split('**');
              return (
                <motion.li
                  key={i}
                  className="text-lg flex items-start gap-3"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{
                    delay: shouldReduceMotion ? 0 : i * 0.05,
                    duration: 0.3,
                    ease: easings.easeOutExpo
                  }}
                >
                  <span className="text-2xl flex-shrink-0">{line.charAt(0)}</span>
                  <span className="text-foreground font-light flex-1">
                    {parts.map((part, j) => j % 2 === 1 ? <strong key={j} className="font-semibold">{part}</strong> : part)}
                  </span>
                </motion.li>
              );
            })}
          </motion.ul>
        );
      }

      // HTML content
      if (section.includes('<div') || section.includes('<a')) {
        return (
          <motion.div
            key={index}
            dangerouslySetInnerHTML={{ __html: section }}
            className="my-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, ease: easings.easeOutExpo }}
          />
        );
      }

      // Horizontal rule
      if (section === '---') {
        return <hr key={index} className="my-8 border-border" />;
      }

      // Regular paragraph with bold and link support
      const formatParagraphText = (text: string) => {
        const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
        const parts: (string | JSX.Element)[] = [];
        let lastIndex = 0;
        let match;

        while ((match = linkRegex.exec(text)) !== null) {
          if (match.index > lastIndex) {
            parts.push(text.slice(lastIndex, match.index));
          }
          parts.push(
            <a key={match.index} href={match[2]} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
              {match[1]}
            </a>
          );
          lastIndex = match.index + match[0].length;
        }
        if (lastIndex < text.length) {
          parts.push(text.slice(lastIndex));
        }
        return parts;
      };

      const parts = section.split('**');
      return (
        <motion.p
          key={index}
          className="text-base text-foreground font-light leading-relaxed my-4"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.4, ease: easings.easeOutExpo }}
        >
          {parts.map((part, i) => {
            if (i % 2 === 1) {
              return <strong key={i} className="font-semibold">{formatParagraphText(part)}</strong>;
            }
            return <span key={i}>{formatParagraphText(part)}</span>;
          })}
        </motion.p>
      );
    });
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth'
      });
    }
  };




  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      {post && (
        <SEOHead
          title={`${post.title.nl} | Blog - Nieuwblik`}
          description={post.excerpt.nl}
          keywords="webdesign, SEO, conversie, digitale marketing, website optimalisatie"
          canonicalUrl={`https://nieuwblik.com/blog/${slug}`}
          ogImage={typeof post.image === 'string' ? post.image : `https://nieuwblik.com/og-image.webp`}
          ogType="article"
          articlePublishedTime={post.date}
          articleModifiedTime={post.date}
          articleAuthor="Justin Slok"
          structuredData={structuredData || undefined}
          breadcrumbs={[
            { name: "Home", url: "https://nieuwblik.com" },
            { name: "Blog", url: "https://nieuwblik.com/blog" },
            { name: post.title.nl, url: `https://nieuwblik.com/blog/${slug}` }
          ]}
        />
      )}
      <Navigation />

      {/* Breadcrumb */}
      <section className="pt-32 pb-4">
        <div className="container mx-auto px-6">
          <Breadcrumb items={[{
            label: "Blog",
            path: "/blog"
          }, {
            label: post?.title.nl || "Blog Post",
            path: `/blog/${slug}`
          }]} />
        </div>
      </section>

      {/* Reading Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-secondary z-50"
        initial={{ scaleX: 0, transformOrigin: "left" }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="h-full bg-accent"
          style={{ width: `${scrollProgress}%` }}
          transition={{ duration: 0.1 }}
        />
      </motion.div>

      {/* Back to Blog */}
      <motion.section
        className="pb-8"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: easings.easeOutExpo }}
      >
        <div className="container mx-auto px-6">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-accent hover:gap-3 transition-all font-semibold"
          >
            <ArrowLeft className="w-5 h-5" />
            Terug naar Blog
          </Link>
        </div>
      </motion.section>

      {/* Article */}
      <article className="pb-20 md:pb-32">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 max-w-7xl mx-auto">

            {/* Table of Contents - Desktop */}
            <motion.div
              className="hidden lg:block lg:col-span-1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2, ease: easings.easeOutExpo }}
            >
              <TableOfContents
                items={tocItems}
                activeSection={activeSection}
                onItemClick={scrollToSection}
                shouldReduceMotion={shouldReduceMotion}
              />
            </motion.div>

            {/* Table of Contents - Mobile */}
            <div className="lg:hidden fixed bottom-6 right-6 z-40">
              <Sheet>
                <SheetTrigger asChild>
                  <motion.div
                    whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
                    whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                  >
                    <Button size="lg" className="rounded-full w-14 h-14 shadow-lg bg-accent text-accent-foreground hover:bg-accent/90">
                      <Menu className="h-6 w-6" />
                    </Button>
                  </motion.div>
                </SheetTrigger>
                <SheetContent side="left" className="w-80">
                  <TableOfContents
                    items={tocItems}
                    activeSection={activeSection}
                    onItemClick={scrollToSection}
                    shouldReduceMotion={shouldReduceMotion}
                  />
                </SheetContent>
              </Sheet>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="max-w-3xl">
                {/* Hero Image */}
                {post.image && (
                  <motion.div
                    className="mb-12 -mx-6 md:mx-0"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: easings.easeOutExpo }}
                  >
                    <img
                      src={post.image}
                      alt={post.title.nl}
                      className="w-full h-[400px] md:h-[500px] object-cover rounded-none md:rounded-lg"
                      loading="eager"
                    />
                  </motion.div>
                )}

                {/* Title */}
                <motion.h1
                  className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1, ease: easings.easeOutExpo }}
                >
                  {post.title.nl}
                </motion.h1>

                {/* Meta */}
                <motion.div
                  className="flex items-center gap-4 text-base text-muted-foreground mb-8 pb-8 border-b border-border"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.15, ease: easings.easeOutExpo }}
                >
                  <time dateTime={post.date}>
                    {new Date(post.date).toLocaleDateString('nl-NL', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </time>
                  <span className="flex items-center gap-2 font-semibold">
                    <Clock className="w-5 h-5" />
                    {post.readingTime} min leestijd
                  </span>
                </motion.div>

                {/* Intro */}
                <motion.div
                  className="text-xl font-light leading-relaxed mb-12 text-foreground/90"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2, ease: easings.easeOutExpo }}
                >
                  {post.excerpt.nl}
                </motion.div>

                {/* Content */}
                <div className="prose prose-lg max-w-none">
                  {formatContent(post.content.nl)}
                </div>

                {/* Mid-Article CTA */}
                <motion.div
                  className="my-16 bg-accent text-accent-foreground p-10 rounded-lg"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                  variants={scaleUp}
                >
                  {slug === 'brand-storytelling-van-pixel-tot-voordeur' ? (
                    <>
                      <h3 className="text-2xl md:text-3xl font-bold mb-4">
                        Klaar om jouw merk tastbaar te maken?
                      </h3>
                      <p className="text-lg mb-6 opacity-90 font-light">
                        Van je eerste pixel tot aan de voordeur - wij helpen je een consistente merkbeleving te creëren die indruk maakt.
                      </p>
                    </>
                  ) : (
                    <>
                      <h3 className="text-2xl md:text-3xl font-bold mb-4">
                        Klaar om jouw website naar het volgende level te tillen?
                      </h3>
                      <p className="text-lg mb-6 opacity-90 font-light">
                        Ontdek hoe we jouw online aanwezigheid transformeren met een website die écht resultaat oplevert.
                      </p>
                    </>
                  )}
                  <motion.div
                    whileHover={shouldReduceMotion ? {} : { scale: 1.03, y: -2 }}
                    whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                    transition={{ duration: 0.2, ease: easings.easeOutQuart }}
                  >
                    <Button asChild size="lg" className="bg-background text-foreground hover:bg-background/90 font-semibold">
                      <Link to="/contact">Start je Project Vandaag</Link>
                    </Button>
                  </motion.div>
                </motion.div>

                {/* Summary */}
                <motion.div
                  className="mt-16 p-8 bg-secondary rounded-lg border-l-4 border-accent"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                  variants={fadeUp}
                >
                  <h3 className="text-2xl font-bold mb-4">Samenvatting</h3>
                  <p className="text-lg font-light leading-relaxed text-muted-foreground">
                    {post.excerpt.nl}
                  </p>
                </motion.div>

                {/* Author */}
                <motion.div
                  className="mt-16 pt-8 border-t border-border"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                  variants={fadeUp}
                >
                  <div className="flex items-center gap-4">
                    <motion.img
                      src={justinImg}
                      alt="Justin Slok - Oprichter Nieuwblik"
                      loading="lazy"
                      decoding="async"
                      width="64"
                      height="64"
                      className="w-16 h-16 rounded-full object-cover"
                      whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                    />
                    <div>
                      <p className="font-semibold text-lg">Justin Slok</p>
                      <p className="text-muted-foreground text-sm">Nieuwblik.com</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Sidebar */}
            <motion.div
              className="lg:col-span-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3, ease: easings.easeOutExpo }}
            >
              <motion.div
                className="bg-accent text-accent-foreground p-8 rounded-lg sticky top-32"
                whileHover={shouldReduceMotion ? {} : {
                  y: -4,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.15)"
                }}
                transition={{ duration: 0.3, ease: easings.easeOutExpo }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <img
                    src={justinImg}
                    alt="Justin Slok - Nieuwblik"
                    loading="lazy"
                    className="w-20 h-20 rounded-full object-cover border-4 border-accent-foreground/20"
                  />
                  <div>
                    <h3 className="text-2xl font-semibold">Geïnspireerd?</h3>
                    <p className="text-sm opacity-80">Justin Slok</p>
                  </div>
                </div>

                <p className="mb-6 opacity-90">
                  {slug === 'brand-storytelling-van-pixel-tot-voordeur'
                    ? 'Heb je ideeën gekregen voor je branding? Laten we samen een merkbeleving creëren die van pixel tot voordeur consistent is.'
                    : 'Heb je ideeën gekregen voor je eigen project? Laten we samen iets moois bouwen dat jouw merk laat schitteren.'}
                </p>

                <div className="space-y-4">
                  <motion.a
                    href="tel:+31646253607"
                    className="w-full block"
                    whileHover={shouldReduceMotion ? {} : { scale: 1.02, y: -2 }}
                    whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                    transition={{ duration: 0.2, ease: easings.easeOutQuart }}
                  >
                    <Button className="w-full bg-background text-foreground hover:bg-background/90" size="lg">
                      <Phone className="mr-2 h-5 w-5" />
                      Bel: +31 6 46 25 36 07
                    </Button>
                  </motion.a>

                  <motion.a
                    href="https://wa.me/31646253607"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full block"
                    whileHover={shouldReduceMotion ? {} : { scale: 1.02, y: -2 }}
                    whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                    transition={{ duration: 0.2, ease: easings.easeOutQuart }}
                  >
                    <Button className="w-full bg-[#25D366] text-white hover:bg-[#20BA5A]" size="lg">
                      <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                      </svg>
                      WhatsApp
                    </Button>
                  </motion.a>

                  <motion.div
                    whileHover={shouldReduceMotion ? {} : { scale: 1.02, y: -2 }}
                    whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                    transition={{ duration: 0.2, ease: easings.easeOutQuart }}
                  >
                    <Link to="/start-je-project" className="w-full block">
                      <Button className="w-full bg-background text-foreground hover:bg-background/90" size="lg">
                        Start je project
                      </Button>
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
};

export default BlogPost;
