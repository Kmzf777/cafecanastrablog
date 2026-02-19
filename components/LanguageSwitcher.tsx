'use client';
import { usePathname, useRouter } from 'next/navigation';

const languages = [
  { code: 'pt', label: 'Português', icon: (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="16" fill="#009B3A"/>
      <ellipse cx="16" cy="16" rx="10" ry="10" fill="#FEDF00"/>
      <path d="M6 16C10 12 22 12 26 16C22 20 10 20 6 16Z" fill="#002776"/>
    </svg>
  ) },
  { code: 'en', label: 'English', icon: (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="16" fill="#00247D"/>
      <path d="M0 8h32v4H0zm0 12h32v4H0z" fill="#fff"/>
      <path d="M0 12h32v8H0z" fill="#CF142B"/>
      <path d="M12 0h8v32h-8z" fill="#fff"/>
      <path d="M14 0h4v32h-4z" fill="#CF142B"/>
    </svg>
  ) },
  { code: 'es', label: 'Español', icon: (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="16" fill="#AA151B"/>
      <rect y="10" width="32" height="12" fill="#F1BF00"/>
    </svg>
  ) },
];

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();

  // Detecta idioma atual pela URL
  let currentLocale = 'pt';
  if (pathname.startsWith('/en/')) currentLocale = 'en';
  else if (pathname.startsWith('/es/')) currentLocale = 'es';

  // Troca de idioma baseada na estrutura de pastas
  const changeLanguage = (lng: string) => {
    let newPath = pathname;
    // Remove prefixo de idioma se houver
    if (pathname.startsWith('/en/')) newPath = pathname.replace('/en', '');
    else if (pathname.startsWith('/es/')) newPath = pathname.replace('/es', '');
    // Monta nova rota
    if (lng === 'pt') {
      // Sempre redireciona para a home principal
      router.push('/');
    } else {
      router.push('/' + lng + newPath);
    }
  };

  return (
    <nav aria-label="Seleção de idioma" className="flex gap-2 items-center">
      {languages.map(lang => {
        const isActive = currentLocale === lang.code;
        return (
          <button
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className={`rounded-full p-1 border transition-all focus:outline-none focus:ring-2 focus:ring-primary
              ${isActive ? 'border-primary ring-2 ring-primary scale-110 bg-primary/10' : 'border-gray-200 hover:border-primary hover:scale-105'}
            `}
            aria-label={lang.label}
            aria-pressed={isActive}
            tabIndex={0}
            title={lang.label}
            style={{ transition: 'all 0.2s' }}
          >
            {lang.icon}
          </button>
        );
      })}
    </nav>
  );
} 