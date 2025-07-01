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

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't flip if clicking on Launch Lesson button or bookmark
    if ((e.target as HTMLElement).closest('a, button')) {
      return;
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
            <h3 className="text-lg font-bold mb-2">About this Companion</h3>
            <p>{summary || "No summary available."}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlippableCompanionCard; 