'use client';
import FlippableCompanionCard from "@/components/FlippableCompanionCard";
import { getSubjectColor } from "@/lib/utils";

interface Companion {
  id: string;
  name: string;
  topic: string;
  subject: string;
  duration: number;
  bookmarked?: boolean;
}

export default function CompanionsGridClient({ companions }: { companions: Companion[] }) {
  return (
    <section className="companions-grid">
      {companions.map((companion: Companion) => (
        <FlippableCompanionCard
          key={companion.id}
          id={companion.id}
          name={companion.name}
          topic={companion.topic}
          subject={companion.subject}
          duration={companion.duration}
          color={getSubjectColor(companion.subject)}
          bookmarked={!!companion.bookmarked}
        />
      ))}
    </section>
  );
} 