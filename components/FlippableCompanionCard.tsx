'use client';
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface FlippableCompanionCardProps {
  id: string;
  name: string;
  topic: string;
  subject: string;
  duration: number;
  color: string;
  summary?: string;
  bookmarked: boolean;
  onBookmark?: () => void;
}

function getShortSummary(text: string, maxSentences = 3) {
  if (!text) return '';
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  return sentences.slice(0, maxSentences).join(' ').trim();
}

// Map ambiguous topics to subject-specific Wikipedia titles
const disambiguationMap: Record<string, Record<string, string>> = {
  Rust: {
    science: 'Rust (chemistry)',
    chemistry: 'Rust (chemistry)',
    coding: 'Rust (programming language)',
    programming: 'Rust (programming language)',
    'computer science': 'Rust (programming language)',
  },
  Mercury: {
    science: 'Mercury (element)',
    chemistry: 'Mercury (element)',
    astronomy: 'Mercury (planet)',
    coding: 'Mercury (programming language)',
    programming: 'Mercury (programming language)',
  },
  Java: {
    coding: 'Java (programming language)',
    programming: 'Java (programming language)',
    geography: 'Java',
  },
  Python: {
    coding: 'Python (programming language)',
    programming: 'Python (programming language)',
    biology: 'Python (genus)',
  },
  // Add more ambiguous topics as needed
};

function getDisambiguatedTopic(topic: string, subject: string) {
  const map = disambiguationMap[topic];
  if (map) {
    // Try exact subject, then lowercased
    return map[subject] || map[subject.toLowerCase()] || topic;
  }
  return topic;
}

const FlippableCompanionCard = ({
  id,
  name,
  topic,
  subject,
  duration,
  color,
  summary,
  bookmarked,
  onBookmark,
}: FlippableCompanionCardProps) => {
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(false);
  const [topicSummary, setTopicSummary] = useState<string | null>(null);

  const fetchSummary = async (topic: string, subject: string) => {
    setLoading(true);
    setTopicSummary(null);
    const disambiguated = getDisambiguatedTopic(topic, subject);
    try {
      let response = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(disambiguated)}`
      );
      if (response.ok) {
        const data = await response.json();
        if (data.extract) {
          setTopicSummary(data.extract);
          setLoading(false);
          return;
        }
      }
      response = await fetch(
        `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(disambiguated)}&utf8=&format=json&origin=*`
      );
      if (response.ok) {
        const data = await response.json();
        const firstResult = data.query?.search?.[0];
        if (firstResult && firstResult.title) {
          const summaryRes = await fetch(
            `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(firstResult.title)}`
          );
          if (summaryRes.ok) {
            const summaryData = await summaryRes.json();
            setTopicSummary(summaryData.extract || 'No summary found.');
            setLoading(false);
            return;
          }
        }
      }
      setTopicSummary('No summary found for this topic. Try searching with a different or more general topic name.');
    } catch (e) {
      setTopicSummary('No summary found for this topic. Try searching with a different or more general topic name.');
    }
    setLoading(false);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('a, button')) {
      return;
    }
    if (!flipped && !topicSummary) {
      fetchSummary(topic, subject);
    }
    setFlipped((f) => !f);
  };

  return (
    <div
      className={`flippable-card${flipped ? " flipped" : ""}`}
      onClick={handleCardClick}
      style={{ minHeight: 340, cursor: "pointer", backgroundColor: color }}
    >
      <div className="flippable-card-inner">
        <div className="flippable-card-front">
          <div className="flex justify-between items-center">
            <div className="subject-badge">{subject}</div>
            <button
              className="companion-bookmark"
              onClick={(e) => {
                e.stopPropagation();
                onBookmark && onBookmark();
              }}
            >
              <Image
                src={
                  bookmarked
                    ? "/icons/bookmark-filled.svg"
                    : "/icons/bookmark.svg"
                }
                alt="bookmark"
                width={12.5}
                height={15}
              />
            </button>
          </div>
          <h2 className="text-2xl font-bold">{name}</h2>
          <p className="text-sm">{topic}</p>
          <div className="flex items-center gap-2">
            <Image
              src="/icons/clock.svg"
              alt="duration"
              width={13.5}
              height={13.5}
            />
            <p className="text-sm">{duration} minutes</p>
          </div>
          <Link href={`/companions/${id}`} className="w-full" onClick={e => e.stopPropagation()}>
            <button className="btn-primary w-full justify-center">
              Launch Lesson
            </button>
          </Link>
        </div>
        <div className="flippable-card-back">
          <div className="flippable-card-back-content">
            <h3 className="text-lg font-bold mb-2">About this Topic</h3>
            {loading ? (
              <p>Loading summary...</p>
            ) : (
              <p>{topicSummary ? getShortSummary(topicSummary) : 'No summary available.'}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlippableCompanionCard; 