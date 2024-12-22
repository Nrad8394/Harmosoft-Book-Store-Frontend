// layout.tsx
"use client";

import AdminLayout from "../layout/AdminLayout";
import OrganizationLayout from "../layout/OrganizationLayout";
import IndividualLayout from "../layout/IndividualLayout";
import { useAuth } from "../context/AuthContext"; // Assuming you have an AuthContext

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  // Render the correct layout based on user type
  if (user?.user_type === "admin") {
    return <AdminLayout>{children}</AdminLayout>;
  }

  if (user?.user_type === "organization") {
    return <OrganizationLayout>{children}</OrganizationLayout>;
  }

  if (user?.user_type === "individual") {
    return <IndividualLayout>{children}</IndividualLayout>;
  }

  // Default layout or redirect if user is not authenticated or user_type not recognized
  return (
    <div className="default-layout">
      <main>{children}</main>
    </div>
  );
}
