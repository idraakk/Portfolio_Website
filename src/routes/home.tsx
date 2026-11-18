import HomePage from '@/components/HomePage.jsx';

export function meta() {
  return [
    { title: 'Idraak Mohd Khan - Software Engineer' },
    { name: 'description', content: 'Idraak Mohd Khan builds Java backend services on AWS, retrieval-augmented applications, and AI agents.' },
  ];
}

export default function Home() {
  return <HomePage />;
}
