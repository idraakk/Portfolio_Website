import React from 'react';
import CodeView from '@/components/CodeView.jsx';
import { C, MdH1, MdH2, MdBold, MdLink, MdItalic } from '@/components/tokens.jsx';
import { cv, FILES } from '@/data/cv.js';

const file = FILES.find((f) => f.id === 'about');

export default function AboutMd() {
  const { identity, about, currently, stats } = cv;

  return (
    <CodeView id="about" file={file} footer={`${stats.length} stats · markdown · ${about.length + currently.length} lines of prose`}>
      <MdH1># {identity.name}</MdH1>
      <></>
      <span>
        <MdItalic>{identity.role}</MdItalic> · {identity.location} ·{' '}
        <MdLink href={`mailto:${cv.contact.email}`}>{cv.contact.email}</MdLink>
      </span>
      <span>
        {'> '}
        <MdItalic>{identity.tagline}</MdItalic>
      </span>
      <></>
      <C>{'<!-- status: ' + identity.availabilityNote + ' -->'}</C>
      <span><MdLink href={`${import.meta.env.BASE_URL}resume.pdf`} download="Idraak-Mohd-Khan-Resume.pdf">↓ Download resume.pdf</MdLink></span>
      <></>
      <MdH2>## About</MdH2>
      <></>
      {about.map((p, i) => (
        <span key={`p-${i}`}>{p}</span>
      ))}
      <></>
      <MdH2>## Currently</MdH2>
      <></>
      {currently.map((c, i) => (
        <span key={`c-${i}`}>
          - {c}
        </span>
      ))}
      <></>
      <MdH2>## By the numbers</MdH2>
      <></>
      <span>| metric | value |</span>
      <span>| --- | --- |</span>
      {stats.map((s) => (
        <span key={s.label}>
          | {s.label} | <MdBold>{s.value}</MdBold> |
        </span>
      ))}
    </CodeView>
  );
}
