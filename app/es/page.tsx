"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function EsIndexRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/es/cafecanastra");
  }, [router]);
  return null;
} 