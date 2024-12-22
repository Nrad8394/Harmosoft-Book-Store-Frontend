// components/layout/AdminLayout.tsx
export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
      <div className="admin-layout">
        <main>{children}</main>
      </div>
    );
  }
  