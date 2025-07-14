"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function EnIndexRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/en/cafecanastra");
  }, [router]);
  return null;
} 