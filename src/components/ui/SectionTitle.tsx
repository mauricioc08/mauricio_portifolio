export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-10 mt-[0.6rem] max-w-[22ch] font-display text-step-2 font-bold">
      {children}
    </h2>
  );
}
