import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { About } from "@/components/site/About";
import { Experience } from "@/components/site/Experience";
import { Projects } from "@/components/site/Projects";
import { Skills } from "@/components/site/Skills";
import { Contact } from "@/components/site/Contact";
import { Footer } from "@/components/site/Footer";
import { BackToTop } from "@/components/site/BackToTop";
import { ContentOverrides } from "@/components/site/ContentOverrides";
import { getSiteContent } from "@/lib/firebase/data";

// revalida a cada hora (ISR); edições no admin refletem sem rebuild manual.
export const revalidate = 3600;

export default async function Home() {
  const { projects, experience, content } = await getSiteContent();

  return (
    <ContentOverrides overrides={content}>
      <Header />
      <main id="main">
        <Hero />
        <About />
        <Experience items={experience} />
        <Projects items={projects} />
        <Skills />
        <Contact />
      </main>
      <Footer />
      <BackToTop />
    </ContentOverrides>
  );
}
