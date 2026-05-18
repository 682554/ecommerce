const providers = [
  {
    name: "Google",
    label: "Continue with Google",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-5 w-5">
        <path d="M23.6 12.275c0-.85-.075-1.675-.215-2.475H12v4.7h6.55c-.28 1.475-1.09 2.725-2.325 3.565v2.975h3.75c2.2-2.025 3.5-5.05 3.5-8.76Z" fill="#4285F4" />
        <path d="M12 24c3.24 0 5.96-1.075 7.95-2.925l-3.75-2.975c-1.05.705-2.4 1.125-4.2 1.125-3.225 0-5.95-2.175-6.93-5.1H1.2v3.2C3.17 21.95 7.25 24 12 24Z" fill="#34A853" />
        <path d="M5.07 14.1c-.24-.7-.375-1.45-.375-2.2 0-.75.135-1.5.375-2.2V6.5H1.2A11.957 11.957 0 0 0 0 12c0 1.95.47 3.8 1.2 5.5l3.87-3.4Z" fill="#FBBC05" />
        <path d="M12 4.75c1.85 0 3.5.635 4.8 1.875l3.6-3.6C17.95 1.1 15.24 0 12 0 7.25 0 3.17 2.05 1.2 5.5l3.87 3.4C6.05 6.925 8.775 4.75 12 4.75Z" fill="#EA4335" />
      </svg>
    ),
  },
  {
    name: "Apple",
    label: "Continue with Apple",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-5 w-5">
        <path
          d="M16.373 1.33c0 1.054-.388 2.03-1.123 2.726-.8.742-1.788 1.23-2.523 1.23.03-.97.38-1.86 1.08-2.542.78-.78 1.74-1.136 2.566-1.414.26-.08.48-.142.716-.163Z"
          fill="currentColor"
        />
        <path
          d="M19.393 7.128c-.39-.9-.92-1.7-1.73-2.492-.995-.95-2.058-1.42-3.276-1.42-1.01 0-2.01.406-2.79.812-.87.465-1.88 1.28-2.96 1.28-1.09 0-2.39-.885-3.75-2.23C4.11 2.59 3.17 1.64 2.38.252c-.44.93-.7 1.9-.7 2.872 0 1.52.52 2.9 1.56 4.31.76 1.06 1.78 2.11 2.87 2.11 1.03 0 1.66-.63 2.95-.63 1.29 0 1.86.63 2.95.63 1.15 0 2.05-1.08 2.82-2.1.43-.55.73-1.1.9-1.75Z"
          fill="currentColor"
        />
      </svg>
    ),
  },
];

export default function SocialProviders() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {providers.map((provider) => (
        <button
          key={provider.name}
          type="button"
          className="inline-flex h-12 w-full items-center justify-center gap-3 rounded-full border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-700 shadow-sm transition hover:border-zinc-300 hover:bg-zinc-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500"
          aria-label={provider.label}
        >
          <span className="inline-flex h-5 w-5 items-center justify-center text-current">{provider.icon}</span>
          {provider.label}
        </button>
      ))}
    </div>
  );
}
