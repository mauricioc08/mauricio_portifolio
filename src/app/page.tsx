import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { About } from "@/components/site/About";
import { Experience } from "@/components/site/Experience";
import { Projects } from "@/components/site/Projects";
import { Skills } from "@/components/site/Skills";
import { Contact } from "@/components/site/Contact";
import { Footer } from "@/components/site/Footer";
import { BackToTop } from "@/components/site/BackToTop";
import { projects as localProjects } from "@/data/projects";
import { experience as localExperience } from "@/data/experience";

export default function Home() {
  // Fase 5 vai substituir por leitura do Firestore com fallback nestes locais.
  const projects = localProjects;
  const experience = localExperience;

  return (
    <>
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
    </>
  );
}
