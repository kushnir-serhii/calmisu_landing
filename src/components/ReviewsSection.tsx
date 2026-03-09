const Stars = () => (
  <div className="flex items-center gap-1">
    {[...Array(5)].map((_, i) => (
      <svg key={i} width="24" height="24" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13.0489 2.92705C13.3483 2.00574 14.6517 2.00574 14.9511 2.92705L16.9187 8.98278C17.0526 9.3948 17.4365 9.67376 17.8697 9.67376H24.2371C25.2058 9.67376 25.6086 10.9134 24.8249 11.4828L19.6736 15.2254C19.3231 15.4801 19.1764 15.9314 19.3103 16.3435L21.2779 22.3992C21.5773 23.3205 20.5228 24.0866 19.7391 23.5172L14.5878 19.7746C14.2373 19.5199 13.7627 19.5199 13.4122 19.7746L8.2609 23.5172C7.47719 24.0866 6.42271 23.3205 6.72206 22.3992L8.68969 16.3435C8.82356 15.9314 8.6769 15.4801 8.32642 15.2254L3.17511 11.4828C2.39139 10.9134 2.79417 9.67376 3.76289 9.67376H10.1303C10.5635 9.67376 10.9474 9.3948 11.0813 8.98278L13.0489 2.92705Z" fill="hsl(var(--brand-star))"/>
      </svg>
    ))}
  </div>
);

interface ReviewCardProps {
  quote: string;
  author: string;
}

const ReviewCard = ({ quote, author }: ReviewCardProps) => (
  <div className="flex p-5 sm:p-6 flex-col items-center gap-4 sm:gap-6 rounded-2xl sm:rounded-3xl bg-brand-light">
    <Stars />
    <p className="text-foreground text-center font-body text-base sm:text-xl md:text-2xl font-normal leading-[140%]">{quote}</p>
    <p className="text-muted-foreground text-center font-body text-sm sm:text-lg font-light leading-[140%]">{author}</p>
  </div>
);

const reviews = [
  { quote: '"The AI chat at 2am when I couldn\'t sleep changed everything. It\'s not a replacement for therapy — it\'s support between sessions."', author: "Priya S., therapy + Calmisu user" },
  { quote: 'This is the first one that understands that anxiety needs a process, not just a playlist."', author: "James T., anxiety for 6 years" },
  { quote: '"Turned out, simply doing calligraphy calms me down"', author: "Peter, user with ADHD" },
  { quote: '"It simply works, plus I love the aesthetics of it"', author: "Julie, Calmisu user" },
  { quote: '"The calming flow actually works. I was skeptical about the calligraphy but it\'s genuinely the most grounding thing I\'ve tried."', author: "Maya K., using Calmisu for 3 months" },
];

const ReviewsSection = () => {
  return (
    <section className="relative w-full px-6 sm:px-6 md:px-[120px] py-12 sm:py-16 md:py-20 rounded-2xl sm:rounded-3xl overflow-hidden">
      {/* Background */}
      <img src="/images/reviews-water-bg.webp" alt="" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-end gap-6 md:gap-5">
        {/* Title */}
        <h2 className="flex-1 text-background font-display text-3xl sm:text-4xl md:text-5xl lg:text-[60px] font-normal leading-[100%]">
          Words from people who found calm with Calmisu
        </h2>

        {/* Review columns */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-4 sm:gap-5 w-full lg:w-auto">
          <div className="flex flex-col gap-4 sm:gap-5 w-full sm:w-[387px]">
            <ReviewCard {...reviews[0]} />
            <ReviewCard {...reviews[1]} />
          </div>
          <div className="flex flex-col gap-4 sm:gap-5 w-full sm:w-[387px]">
            <ReviewCard {...reviews[2]} />
            <ReviewCard {...reviews[3]} />
            <ReviewCard {...reviews[4]} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
