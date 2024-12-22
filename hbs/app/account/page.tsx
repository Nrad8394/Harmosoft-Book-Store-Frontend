// components/account/AccountPage.tsx
"use client";

import { useAuth } from "../context/AuthContext";
import AdminLayout from "../layout/AdminLayout";
import OrganizationLayout from "../layout/OrganizationLayout";
import IndividualLayout from "../layout/IndividualLayout";
import AdminPage from "../pages/AdminPage";
import OrganizationPage from "../pages/OrganizationPage";
import IndividualPage from "../pages/IndividualPage";

export default function AccountPage() {
  const { user } = useAuth();
  const userType = user?.user_type || "individual"; // Default to individual if not logged in

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow"> 
        {userType === "admin" ? (
          <AdminLayout>
            <AdminPage />
          </AdminLayout>
        ) : userType === "organization" ? (
          <OrganizationLayout>
            <OrganizationPage />
          </OrganizationLayout>
        ) : (
          <IndividualLayout>
            <IndividualPage />
          </IndividualLayout>
        )}
      </div>
    </div>
  );
}
