const PulseDot = () => (
  <span
    className="flex p-1 items-center rounded-full bg-brand-200 motion-safe:animate-[pulse_3s_ease-in-out_infinite]"
    aria-hidden="true"
  >
    <svg
      width="8"
      height="8"
      viewBox="0 0 8 8"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="4" cy="4" r="4" fill="hsl(var(--brand-blue))" />
    </svg>
  </span>
);

export { PulseDot };
