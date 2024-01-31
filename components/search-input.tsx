"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import useDebounce from "@/hooks/useDebounce";
import qs from "query-string";
import Input from "./input";

const SearchInput = () => {
  const [value, setValue] = useState<string>("");
  const router = useRouter();
  const debouncedValue = useDebounce<string>(value, 500);

  useEffect(() => {
    const query = { title: debouncedValue };

    const url = qs.stringifyUrl({ url: `/search`, query });
    router.push(url);
  }, [debouncedValue, router]);

  return (
    <Input
      placeholder="What do you want to listen to?"
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
};

export default SearchInput;
