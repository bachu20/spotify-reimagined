"use client";

import { useState, useEffect } from "react";
import { ProductWithPrice } from "@/types/common";
import AuthModal from "@/components/auth-modal";
import UploadModal from "@/components/upload-modal";
import SubscribeModal from "@/components/subscribe-modal";

interface Props {
  products: ProductWithPrice[];
}

const ModalProvider: React.FC<Props> = ({ products }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <AuthModal />
      <UploadModal />
      <SubscribeModal products={products} />
    </>
  );
};

export default ModalProvider;
