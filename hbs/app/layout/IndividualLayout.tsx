// components/layout/IndividualLayout.tsx
export default function IndividualLayout({ children }: { children: React.ReactNode }) {
    return (
      <div className="individual-layout">
        <main>{children}</main>
      </div>
    );
  }
  