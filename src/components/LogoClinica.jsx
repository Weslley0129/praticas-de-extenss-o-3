// Logo recriado a partir da identidade visual real do Clique Saúde
// (círculo em degradê rosa/vermelho, silhueta branca + cruz médica).
function LogoClinica({ tamanho = 44 }) {
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 100 100" aria-hidden="true">
      <defs>
        <linearGradient id="degradeLogo" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--brand-badge-de)" />
          <stop offset="100%" stopColor="var(--brand-badge-para)" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="54" r="40" fill="url(#degradeLogo)" />
      <path d="M50 34c-9.5 0-17 6.5-17 16 0 12 13 24 17 27 4-3 17-15 17-27 0-9.5-7.5-16-17-16z" fill="#ffffff" opacity="0.16" />
      <circle cx="50" cy="46" r="11" fill="#ffffff" />
      <path d="M28 82c0-13 9.8-23 22-23s22 10 22 23" fill="#ffffff" />
      <rect x="41" y="2" width="18" height="34" rx="4" fill="#ffffff" />
      <rect x="27" y="16" width="46" height="18" rx="4" fill="#ffffff" />
    </svg>
  );
}

export default LogoClinica;
