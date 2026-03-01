"use client";

import { useMemo, useState } from "react";

import type { MemberEntry } from "@/data/members-directory";

type MembersDirectoryClientProps = {
  entries: MemberEntry[];
};

function getLetter(company: string): string {
  const first = company.trim().charAt(0).toUpperCase();
  return /^[A-Z]$/.test(first) ? first : "#";
}

export function MembersDirectoryClient({ entries }: MembersDirectoryClientProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    if (!q) {
      return entries;
    }

    return entries.filter((entry) => {
      const haystack = `${entry.company} ${entry.contacts.join(" ")}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [entries, query]);

  const grouped = useMemo(() => {
    const groupMap = new Map<string, MemberEntry[]>();

    for (const entry of filtered) {
      const letter = getLetter(entry.company);
      const existing = groupMap.get(letter) ?? [];
      existing.push(entry);
      groupMap.set(letter, existing);
    }

    return [...groupMap.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [filtered]);

  const letters = grouped.map(([letter]) => letter);

  return (
    <section className="directory-shell">
      <div className="directory-toolbar">
        <div>
          <p className="eyebrow">Members Directory</p>
          <h2>Members</h2>
          <p>
            Search by company or person, then jump to any letter section with one click.
          </p>
        </div>

        <div className="directory-search-wrap">
          <label htmlFor="member-search">Search members</label>
          <input
            id="member-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Company or contact name"
          />
          <small>
            Showing {filtered.length} of {entries.length} companies
          </small>
        </div>
      </div>

      <nav className="alphabet-nav" aria-label="Alphabet navigation">
        <a href="#top" className="top-link">
          Top
        </a>
        {letters.map((letter) => (
          <a key={letter} href={`#letter-${letter}`}>
            {letter}
          </a>
        ))}
      </nav>

      <div className="directory-results">
        {grouped.map(([letter, companies]) => (
          <section id={`letter-${letter}`} key={letter} className="letter-section">
            <h3>{letter}</h3>
            <div className="company-grid">
              {companies.map((company, companyIndex) => (
                <article key={`${letter}-${company.company}-${companyIndex}`} className="company-card">
                  <h4>{company.company}</h4>
                  {company.contacts.length ? (
                    <ul>
                      {company.contacts.map((contact, contactIndex) => (
                        <li key={`${letter}-${company.company}-${contact}-${contactIndex}`}>{contact}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>No contacts listed.</p>
                  )}
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>

      <a className="back-to-top" href="#top" aria-label="Back to top">
        Top
      </a>
    </section>
  );
}
