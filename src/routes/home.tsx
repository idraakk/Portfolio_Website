import HomePage from '@/components/HomePage.jsx';

export function meta() {
  return [
    { title: 'Idraak Mohd Khan - Software Engineer' },
    { name: 'description', content: 'Software engineer working across backend systems and generative AI.' },
  ];
}

export default function Home() {
  return <HomePage />;
}
