// Decorative cookie crumbs for the burgundy sections (footer, page headers).
// Each half of /crumbs.webp is pinned to its top corner at a fixed size so it
// never spreads under centered text on wide screens, and fades out downward.
// The parent must be `relative overflow-hidden`, with its content `relative`.

export default function Crumbs({ className = "opacity-40" }: { className?: string }) {
  return (
    <>
      {(["left", "right"] as const).map((side) => (
        <div
          key={side}
          aria-hidden="true"
          className={`pointer-events-none absolute top-0 ${side === "left" ? "left-0" : "right-0"} w-1/2 max-w-[280px] md:max-w-[450px] h-[190px] md:h-[300px] bg-no-repeat bg-[length:560px_auto] md:bg-[length:900px_auto] [mask-image:linear-gradient(to_bottom,black_35%,transparent)] ${className}`}
          style={{ backgroundImage: "url(/crumbs.webp)", backgroundPosition: `${side} top` }}
        />
      ))}
    </>
  );
}
