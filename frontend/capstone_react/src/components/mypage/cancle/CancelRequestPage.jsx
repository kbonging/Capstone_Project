import React, { useContext, useEffect, useState } from "react";
import MyPageLayout from "../MyPageLayout";
import { AppContext } from "../../../contexts/AppContext";
import CancelForm from "./CancelForm";

export default function CancelRequestPage() {
  const { user } = useContext(AppContext);
  const [loading, setLoading] = useState(true);

  const getUserRole = (u) => u?.authDTOList?.[0]?.auth ?? null;
  const userRole = getUserRole(user);

  useEffect(() => {
    if (userRole) setLoading(false);
  }, [userRole]);

  if (loading) return <div>Loading...</div>;

  return (
    <MyPageLayout userRole={userRole}>
      <CancelForm />
    </MyPageLayout>
  );
}
