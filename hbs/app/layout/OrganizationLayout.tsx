// components/layout/OrganizationLayout.tsx
export default function OrganizationLayout({ children }: { children: React.ReactNode }) {
    return (
      <div className="organization-layout">
        <main>{children}</main>
      </div>
    );
  }
  