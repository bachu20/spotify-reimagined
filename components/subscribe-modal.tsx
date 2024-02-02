"use client";

import { Price, ProductWithPrice } from "@/types/common";
import { useEffect, useState } from "react";
import { useUser } from "@/hooks/useUser";
import { postData } from "@/libs/helpers";
import useSubscribeModal from "@/hooks/useSubscribeModal";
import Button from "./button";
import toast from "react-hot-toast";
import Modal from "./modal";
import { getStripe } from "@/libs/stripe-client";
import { useRouter } from "next/navigation";

const stripe = getStripe();

interface Props {
  products: ProductWithPrice[];
}

const formatPrice = (price: Price) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: price.currency,
    minimumFractionDigits: 0,
  }).format((price?.unit_amount || 0) / 100);
};

const SubscribeModal: React.FC<Props> = ({ products }) => {
  const subscribeModal = useSubscribeModal();
  const router = useRouter();
  const { user, subscription } = useUser();
  const [priceIdLoading, setPriceIdLoading] = useState<string>();

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);

    if (query.get("canceled")) {
      toast.error("Upgrade canceled -- you could be missing out.");
    }
  }, []);

  const onChange = (open: boolean) => {
    if (!open) {
      subscribeModal.onClose();
    }
  };

  const handleCheckout = async (price: Price) => {
    setPriceIdLoading(price.id);

    if (!user) {
      setPriceIdLoading(undefined);
      return toast.error("Must be logged in");
    }

    if (subscription) {
      setPriceIdLoading(undefined);
      return toast("Already subscribed");
    }

    try {
      const { session_url } = await postData({
        url: "/api/create-checkout-session",
        data: { price },
      });

      router.push(session_url);
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  let content = <div className="text-center">No products available.</div>;

  if (products.length) {
    content = (
      <div>
        {products.map((product) => {
          if (!product.prices?.length) {
            return <div key={product.id}>No prices available</div>;
          }

          return product.prices.map((price) => (
            <Button
              key={price.id}
              onClick={() => handleCheckout(price)}
              disabled={price.id === priceIdLoading}
            >
              {`Subscribe for ${formatPrice(price)} a ${price.interval}`}
            </Button>
          ));
        })}
      </div>
    );
  }

  return (
    <Modal
      title="Only for premium users"
      description="List to music with Reimagined Premium"
      isOpen
      onChange={onChange}
    >
      {content}
    </Modal>
  );
};

export default SubscribeModal;
