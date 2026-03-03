"use client";
import React from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import YouTube from 'react-youtube';
import { colors } from '@/lib/colors';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import ServicesCard from '@/components/services-card';
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from '@/components/ui/carousel';
import { ScrollAreaHorizontalDemo } from '@/components/horizontal-scroll';
import ChurchEventsCalendar from '@/components/church-events-calendar';
import { useEffect, useState } from 'react';
import { PastoralTeam } from '@/components/ui/pastoral-team';

type YTThumbnail = {
  url: string;
  width: number;
  height: number;
};

type YTSnippet = {
  title: string;
  thumbnails: { maxres?: YTThumbnail; medium?: YTThumbnail };
  resourceId: { videoId: string };
};

type YTItem = { id: string; snippet: YTSnippet };

type YTResponse = { items: YTItem[]; totalVideos?: number };
type YouTubeGridProps = {
  onTotalVideos?: (count: number) => void
  // Pass a number to explicitly control results, or 'auto' to fetch total first
  maxResults?: number | 'auto'
}

const YouTubeGrid: React.FC<YouTubeGridProps> = ({ onTotalVideos, maxResults = 'auto' }) => {
  const [data, setData] = useState<YTResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Staggered reveal for video cards as the grid enters the viewport
  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12 } },
  } as const;
  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  } as const;

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        // Determine how many to fetch
        let count: number

        if (maxResults === 'auto') {
          // Lightweight head request to get totalVideos
          const headRes = await fetch('/api/youtube?maxResults=1', { cache: 'no-store' })
          if (!headRes.ok) throw new Error(`Head request failed: ${headRes.status}`)
          const headJson = (await headRes.json()) as YTResponse
          const total = headJson.totalVideos ?? headJson.items?.length ?? 1
          // Inform parent of total as soon as we know it
          onTotalVideos?.(total)
          // YouTube playlistItems API caps maxResults to 50 per request
          count = Math.min(total, 50)
        } else {
          count = Math.max(1, maxResults)
        }

        const res = await fetch(`/api/youtube?maxResults=${count}`, { cache: 'no-store' });
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        const json = (await res.json()) as YTResponse;
        if (active) {
          setData(json);
          onTotalVideos?.(json.totalVideos ?? json.items?.length ?? 0);
        }
      } catch (e) {
        if (active) setError(e instanceof Error ? e.message : 'Unknown error');
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [maxResults]);

  if (loading) {
    return (
      <div className="mt-10 w-full max-w-5xl mx-auto text-center text-slate-500">Loading latest messages…</div>
    );
  }

  if (error) {
    return (
      <div className="mt-10 w-full max-w-5xl mx-auto text-center text-red-600">{error}</div>
    );
  }

  if (!data || !data.items?.length) {
    return (
      <div className="mt-10 w-full max-w-5xl mx-auto text-center text-slate-500">No messages available.</div>
    );
  }

  // Filter out any items without a usable maxres thumbnail URL
  const itemsWithThumb = data.items.filter((it) => {
    const t = it?.snippet?.thumbnails;
    return !!(t?.maxres?.url || t?.medium?.url);
  });
  if (!itemsWithThumb.length) {
    return (
      <div className="mt-10 w-full max-w-5xl mx-auto text-center text-slate-500">No messages available.</div>
    );
  }

  const lastTwo = itemsWithThumb.length > 1 ? itemsWithThumb.slice(-2) : itemsWithThumb;

  return (
    <motion.div
      className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.2 }}
    >
      {lastTwo.map(({ id, snippet }) => {
        const { title, thumbnails, resourceId } = snippet;
        const thumb = thumbnails?.maxres?.url ? thumbnails.maxres : thumbnails?.medium;
        if (!thumb?.url) return null;
        const videoId = resourceId?.videoId || id;
        const href = `https://www.youtube.com/watch?v=${videoId}`;
        return (
          <motion.a
            key={videoId}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-lg overflow-hidden border border-slate-200 hover:shadow-lg transition"
            aria-label={title}
            variants={itemVariants}
          >
            <div className="aspect-video bg-slate-100 overflow-hidden">
              <img
                src={thumb.url}
                width={thumb.width}
                height={thumb.height}
                alt={title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </div>
            <div className="p-4 text-left">
              <h3 className="text-slate-900 font-semibold line-clamp-2">{title}</h3>
              <p className="mt-1 text-sm text-green-600">Watch on YouTube →</p>
            </div>
          </motion.a>
        );
      })}
    </motion.div>
  );
};

const LandingPage = () => {
  const [totalPlaylistVideos, setTotalPlaylistVideos] = useState<number | null>(null)
  // YouTube player options
  const videoOpts = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 0,
      controls: 1,
      rel: 0,
      modestbranding: 1,
    },
  } as const;

  // Our Values data
  const values = [
    {
      number: '01',
      title: 'Cultivating Disciples',
      description:
        'Nurturing a vibrant culture of discipleship, we guide each other towards spiritual maturity and a profound understanding of our faith journey.',
    },
    {
      number: '02',
      title: 'Empowering Families',
      description:
        'We stand as a fortress of strength for families, equipping them with the tools to navigate life’s challenges while fostering unity, love, and resilience.',
    },
    {
      number: '03',
      title: 'Edifying Believers',
      description:
        'With every gathering, we uplift and edify believers through impactful teachings, transformative worship, and a sense of belonging within our spiritual family.',
    },
    {
      number: '04',
      title: 'Cultivating Disciples',
      description:
        'Nurturing a vibrant culture of discipleship, we guide each other towards spiritual maturity and a profound understanding of our faith journey.',
    },
    {
      number: '05',
      title: 'Empowering Families',
      description:
        'We stand as a fortress of strength for families, equipping them with the tools to navigate life’s challenges while fostering unity, love, and resilience.',
    },
    {
      number: '06',
      title: 'Edifying Believers',
      description:
        'With every gathering, we uplift and edify believers through impactful teachings, transformative worship, and a sense of belonging within our spiritual family.',
    },
  ];

  // Values carousel API + autoplay (3s) with hover pause
  const [valuesApi, setValuesApi] = React.useState<CarouselApi | null>(null);
  const [valuesHover, setValuesHover] = React.useState(false);

  React.useEffect(() => {
    if (!valuesApi || valuesHover) return;
    const id = setInterval(() => {
      try { valuesApi.scrollNext(); } catch {}
    }, 3000);
    return () => clearInterval(id);
  }, [valuesApi, valuesHover]);

  // (Ministries) switched to native horizontal ScrollArea; Embla progress slider removed

  const handleVideoReady = (event: any) => {
    // Example: ensure video is paused on ready
    try { event?.target?.pauseVideo?.(); } catch {}
  };

  // (Removed ministries slider handler)

  // Forms section content + card component
  type FormCard = {
    title: string
    titleWeight?: "bold" | "semibold"
    quote: string
    description: string
    buttonText: string
    href: string
  }

  const formCards: FormCard[] = [
    {
      title: "Need Prayer?",
      titleWeight: "bold",
      quote: "“We’re here for you.”",
      description:
        "Our prayer team would love to pray for you. Submit your request — confidential, personal, and powerful.",
      buttonText: "Send Prayer Request",
      href: "https://forms.gle/your-prayer-form",
    },
    {
      title: "Just Said Yes to Jesus?",
      titleWeight: "semibold",
      quote: "“Start your new life in Christ.”",
      description:
        "You’ve made the best decision! Let us guide you with next steps, support, and a community that walks with you.",
      buttonText: "Start Here",
      href: "https://forms.gle/your-yes-form",
    },
    {
      title: "Share Your Story",
      titleWeight: "semibold",
      quote: "“Your testimony builds faith.”",
      description:
        "How has God moved in your life? Share your story to encourage others and show His power in everyday moments.",
      buttonText: "Share with Us",
      href: "https://forms.gle/your-story-form",
    },
  ]

  const NeedPrayerCard: React.FC<FormCard> = ({
    title,
    titleWeight = "semibold",
    quote,
    description,
    buttonText,
    href,
  }) => (
    <div className="relative mx-auto w-full max-w-[384px] h-[265px] rounded-[14px] border-2 border-gray-400 overflow-hidden">
      <div
        className={
          "absolute left-[31px] top-[36px] text-[#1F1F1F] text-[24px] font-lora leading-none " +
          (titleWeight === "bold" ? "font-bold" : "font-semibold")
        }
      >
        {title}
      </div>
      <div className="absolute left-[31px] top-[81px] text-black text-[12px] font-work-sans font-semibold">
        {quote}
      </div>
      <div className="absolute left-[31px] top-[113px] w-[336px] text-black text-[12px] font-work-sans">
        {description}
      </div>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute left-[31px] top-[170px] inline-flex items-center justify-center gap-2 rounded-[8px] bg-[#9CA3AF] px-[30px] py-[20px] hover:brightness-95 active:brightness-90 transition"
        aria-label={buttonText + " form"}
      >
        <span className="text-[#1F1F1F] text-[16px] font-work-sans font-semibold">{buttonText}</span>
      </a>
    </div>
  )


  // Scroll-linked parallax for hero
  const heroRef = React.useRef<HTMLDivElement | null>(null)
  const { scrollYProgress: heroProgress } = useScroll({ target: heroRef, offset: ["start end", "end start"] })
  const heroY = useTransform(heroProgress, [0, 1], [0, -60])

  // Subtle parallax for Values heading
  const valuesRef = React.useRef<HTMLDivElement | null>(null)
  const { scrollYProgress: valuesProgress } = useScroll({ target: valuesRef, offset: ["start end", "end start"] })
  const valuesY = useTransform(valuesProgress, [0, 1], [0, -30])

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation Bar */}
      <Navbar />

      {/* Hero Section with responsive background video */}
      <section
        id="home"
        ref={heroRef}
        className="relative min-h-screen overflow-hidden bg-black"
      >
        <video
          className="absolute inset-0 h-full w-full object-cover object-center"
          autoPlay
          loop
          muted
          playsInline
          aria-hidden="true"
        >
          <source src="/hero_vid.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/40" aria-hidden="true" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex min-h-screen items-center py-16 sm:py-20">
            <motion.div
              className="text-left md:max-w-3xl space-y-6 md:space-y-8"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              style={{ y: heroY }}
            >
              <motion.h1
                className="font-lora font-bold text-white leading-tight max-w-[844px] text-[32px] sm:text-[44px] lg:text-[60px]"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                Experience the Freedom of Life in Christ
              </motion.h1>

              <motion.p
                className="text-white font-work-sans font-maxres leading-relaxed text-[18px] sm:text-[20px] max-w-[844px]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                Join us every Sunday in Delhi as we worship, pray, and walk in freedom together.
              </motion.p>

              {/* CTA row */}
              <motion.div
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0, duration: 0.6 }}
              >
                <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    asChild
                    size="lg"
                    className="bg-[#1CA64D] hover:brightness-95 active:brightness-90 text-[#F3F4F6] px-[30px] py-[20px] text-[16px] font-semibold rounded-[8px]"
                  >
                    <Link href="/services">
                      Join Us This Sunday
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="px-[30px] py-[20px] text-[16px] font-semibold rounded-[8px] border-2 border-[#9CA3AF] text-[#1F1F1F] bg-white/80 hover:bg-white"
                  >
                    <Link href="/sermons">Watch Sermons</Link>
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Charcoal Section: content left, video right */}
      <section
        className="py-20"
        style={{ backgroundColor: colors.charcoal }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
            {/* Left Content */}
            <motion.div
              className="lg:col-span-6"
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-white font-lora">Experience FLC Delhi</h2>
              <p className="mt-4 text-lg text-slate-300 font-work-sans">
                Watch our latest service and be encouraged by biblical teaching and passionate worship.
              </p>
            </motion.div>

            {/* Right Video (sized 485x360) */}
            <motion.div 
              className="mt-12 lg:mt-0 lg:col-span-6"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex lg:justify-end justify-center">
                <Card className="overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-300 bg-white/5 backdrop-blur border border-white/10">
                  <CardContent className="p-0">
                    <div className="w-[485px] h-[360px]">
                      <YouTube 
                        videoId="tCC6Sk5Mo80"
                        opts={{
                          height: '360',
                          width: '485',
                          playerVars: {
                            autoplay: 0,
                            controls: 1,
                            rel: 0,
                            modestbranding: 1,
                          },
                        }}
                        onReady={handleVideoReady}
                        className="w-full h-full"
                        iframeClassName="w-full h-full"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Cards Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-3">
            <ServicesCard
              title="Tamil Service"
              subtitle="Every Sunday, 9:30 am - 11:00 am"
              addressLines={[
                'L - 16, South Extension II, Block L, New Delhi,',
                'Delhi 110049',
              ]}
            />
            <ServicesCard
              title="English Service"
              subtitle="Every Sunday, 11:30 am - 1:00 pm"
              addressLines={[
                'L - 16, South Extension II, Block L, New Delhi,',
                'Delhi 110049',
              ]}
            />
            <ServicesCard
              title="Hindi Service"
              subtitle="Every Wednesday, 7:00 pm - 8:30 pm"
              addressLines={[
                'L - 16, South Extension II, Block L, New Delhi,',
                'Delhi 110049',
              ]}
            />
          </div>
        </div>
      </section>

      {/* This Week’s Message (YouTube feed) */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center">
            <div className="space-y-6 md:max-w-3xl">
              <h2 className="text-[40px] sm:text-[48px] lg:text-[56px] leading-tight font-bold font-lora tracking-[0.12em] text-[#A8A8A8]">
                THIS WEEK’S MESSAGE
              </h2>
              <p className="text-[18px] text-black font-work-sans max-w-[541px] mx-auto">
                Experience God’s Word every week — right where you are. Watch our latest message, and be refreshed in His presence.
              </p>
            </div>

            {/* YouTube items grid */}
            <YouTubeGrid onTotalVideos={setTotalPlaylistVideos} />
          </div>
        </div>
      </section>

      {/* Charcoal Section 2 */}
      <section className="min-h-[500px] flex items-center" style={{ backgroundColor: colors.charcoal }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center">
            <h2 className="text-[52px] leading-tight font-bold font-lora text-white">
              We’re here to <span style={{ color: '#1CA64D' }}>reach</span> the lost, <span style={{ color: '#1CA64D' }}>raise</span>
            </h2>
            <h2 className="text-[52px] leading-tight font-bold font-lora text-white">
              disciples, and <span style={{ color: '#1CA64D' }}>release</span> leaders.
            </h2>
          </div>
        </div>
      </section>

      {/* Pastor Intro Section */}
      <section id="pastor" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-start">
            {/* Left Image Placeholder */}
            <motion.div
              className="lg:col-span-6"
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-full rounded-[14px] bg-slate-300 aspect-[588/700] min-h-[380px] lg:w-[588px] lg:h-[700px]" />
            </motion.div>

            {/* Right Text Content */}
            <motion.div
              className="mt-10 lg:mt-0 lg:col-span-6"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-[36px] leading-tight font-bold font-lora text-black">Rev. Dr. Vincent Bernard</h3>
              <p className="mt-2 text-[14px] font-maxres font-work-sans text-black">Senior Pastor & Executive Member in AGNI.</p>

              <div className="mt-6 space-y-4 text-black font-work-sans text-[14px] leading-relaxed max-w-[446px]">
                <p>
                  Meet the driving force behind Freedom Life Centre, Rev. Dr. Vincent Bernard, our Senior Pastor. With an unyielding passion, he's building our church on a bedrock of unwavering Biblical principles. His vision encompasses vibrant corporate worship and a resounding call to mission, particularly to train men and women for ministry in North India.
                </p>
                <p>
                  For over three decades, Rev. Dr. Bernard's teachings have not only shaped minds but hearts, as he serves as a Vice President at Central Bible College since 1991. An ordained minister of the Assemblies of God of North India, he also takes on the role of an Executive Member in the Assemblies of God of North India Council. Helping to lead all 14 districts in the North of India.
                </p>
                <p>
                  His academic prowess shines through with a Master of Arts in Public Administration from Madras University, a Master’s in divinity from Southern Asia Bible College, and a Master of Theology from Books University, Oxford, London.
                </p>
                <p>
                  Each Sunday, his dynamic sermons bridge the gap between God's Word and daily life, reflecting his background in teaching. Furthermore, he is the director of several projects such as Global Family Charitable trust and Jal Vihar
                </p>
                <p>
                  In 1994, he joined hands in matrimony with Karthika, and their union is blessed with a son, Jason.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pastoral Team */}
      <section id="pastoral" className="bg-gray-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex flex-col items-center text-center w-full">
            <h2 className="text-[36px] sm:text-[44px] lg:text-[56px] leading-tight font-bold font-lora tracking-[2px] text-[#1F1F1F]">PASTORAL TEAM</h2>
          </div>
          <PastoralTeam />
        </div>
      </section>

      {/* Our Values */}
      <section id="values" className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full" ref={valuesRef}>
          <div className="flex flex-col items-center text-center w-full">
            <motion.h2 style={{ y: valuesY }} className="text-[36px] sm:text-[44px] lg:text-[56px] leading-tight font-bold font-lora tracking-[2px] text-[#1F1F1F]">OUR VALUES</motion.h2>
            <p className="mt-3 text-[18px] text-black font-work-sans max-w-[804px]">
              Our Core Values are who we are. They are not just what we do, they are part of our DNA.
            </p>

            <div className="mt-10 w-full">
              <div className="relative mx-auto max-w-[1236px]" onMouseEnter={() => setValuesHover(true)} onMouseLeave={() => setValuesHover(false)}>
                <Carousel opts={{ align: 'start', loop: true }} setApi={setValuesApi} className="w-full">
                  <CarouselContent className="-ml-4 lg:-ml-4">
                    {values.map((v, idx) => (
                      <CarouselItem key={idx} className="basis-full lg:basis-1/3 pl-4">
                        <motion.div
                          initial={{ opacity: 0, y: 24 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, amount: 0.25 }}
                          transition={{ duration: 0.45, ease: 'easeOut' }}
                          className="relative w-full max-w-[384px] h-[220px] mx-auto rounded-[12px] border-2 border-gray-400 overflow-hidden"
                        >
                          <div className="absolute top-3 left-3 w-[45px] h-[45px] bg-[#1F1F1F] rounded-full" />
                          <div className="absolute top-5 left-6 text-white text-[18px] font-work-sans font-bold">{v.number}</div>
                          <div className="absolute left-7 top-16 w-[300px] text-[#1F1F1F] text-[24px] font-lora font-semibold">{v.title}</div>
                          <div className="absolute left-7 top-[139px] w-[336px] text-black text-[12px] font-work-sans leading-snug">{v.description}</div>
                        </motion.div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                </Carousel>
                {/* Bottom-right controls below cards */}
                <div className="mt-4 flex justify-end gap-4">
                  <Button variant="outline" size="icon" className="rounded-full border-2 border-gray-400" onClick={() => valuesApi?.scrollPrev()}>
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-full border-2 border-gray-400" onClick={() => valuesApi?.scrollNext()}>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Ministries (Horizontal ScrollArea with horizontal ScrollBar) */}
      <section id="ministries" className="bg-[#1F1F1F] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex flex-col items-center text-center w-full">
            <h2 className="text-[36px] sm:text-[44px] lg:text-[60px] leading-tight font-bold font-lora text-white">OUR MINISTRIES</h2>
            <div className="mt-12 w-full">
              <div className="relative mx-auto max-w-[1236px]">
                <ScrollAreaHorizontalDemo />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Forms Section (replaces Features) */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            {formCards.map((card, idx) => (
              <NeedPrayerCard key={idx} {...card} />
            ))}
          </div>
        </div>
      </section>

      {/* Events Calendar Section (replacing image banner) */}
      <section className="py-20 bg-white">
        <ChurchEventsCalendar />
      </section>

      {/* Give Online Section */}
      <section className="py-20" style={{ backgroundColor: '#1F1F1F' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl bg-gray-100 rounded-xl p-8 md:p-12">
            <h3 className="text-3xl md:text-5xl font-bold font-lora text-black tracking-tight">Ways We Give</h3>
            <p className="mt-4 text-sm md:text-base text-black font-work-sans max-w-2xl">
              Generosity is our privilege because Jesus was first generous towards us.
            </p>
            <div className="mt-6">
              <a href="#give" className="text-[18px] md:text-[20px] font-work-sans font-semibold text-[#1F1F1F] hover:underline">
                Give Now →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;