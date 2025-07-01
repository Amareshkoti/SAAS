export const dynamic = "force-dynamic";
import CompanionCard from "@/components/CompanionCard";
import CompanionsList from "@/components/CompanionsList";
import CTA from "@/components/CTA";
import {recentSessions} from "@/constants";
import {getAllCompanions, getRecentSessions} from "@/lib/actions/companion.actions";
import {getSubjectColor} from "@/lib/utils";
import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";
import FlippableCompanionCard from "@/components/FlippableCompanionCard";

const Page = async () => {
    const companions = await getAllCompanions({ limit: 3 });
    const recentSessionsCompanions = await getRecentSessions(10) as any[];

  return (
    <main>
      <section className="cta-section-top">
        <CTA />
      </section>
      <section className="section">
        <h1 className="section-title">Popular Companions</h1>
        <div className="popular-companions-grid">
          {companions.map((companion) => (
            <FlippableCompanionCard
              key={companion.id}
              {...companion}
              color={getSubjectColor(companion.subject)}
              summary={`Learn about ${companion.topic} with ${companion.name}. This interactive session covers key concepts and provides hands-on practice in ${companion.subject}.`}
            />
          ))}
        </div>
      </section>
      <section className="section">
        <h2 className="section-title">Recently completed sessions</h2>
        <div className="recent-sessions-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          {recentSessionsCompanions.slice(0, 9).map((companion) => (
            <FlippableCompanionCard
              key={companion.id || companion.$id}
              id={companion.id || companion.$id}
              name={companion.name}
              topic={companion.topic}
              subject={companion.subject}
              duration={companion.duration}
              color={getSubjectColor(companion.subject)}
              bookmarked={!!companion.bookmarked}
            />
          ))}
        </div>
      </section>
    </main>
  )
}

export default Page