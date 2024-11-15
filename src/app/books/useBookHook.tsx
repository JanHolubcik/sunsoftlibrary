"use client";
import { useEffect, useState } from "react";

export default function useBookHook() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchFood = async () =>
      await fetch("/api/books")
        .then((response) => response.json())
        .then((data) => {
          setData(data);
          setLoading(false);
        });
    fetchFood();
  }, []);
  return { data, loading };
}
