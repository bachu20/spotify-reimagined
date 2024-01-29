import { User } from "@supabase/supabase-js";
import { createContext, useContext, useState, useEffect } from "react";
import { SupabaseProviderContext } from "./supabase";
import { Subscription, UserDetails } from "@/types/common";

type UserContextType = {
  accessToken: string | null;
  user: User | null;
  userDetails: UserDetails | null;
  subscription: Subscription | null;
  isLoading: boolean;
};

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

export interface Props {
  [prop: string]: any;
}

export const MyUserContextProvider = (props: Props) => {
  const { supabase, session } = useContext(SupabaseProviderContext);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);

  const accessToken = session?.access_token ?? null;

  const getUserDetails = () => {
    return supabase.from("users").select("*").single();
  };

  const getSubscription = () => {
    return supabase
      .from("subscriptions")
      .select("*, prices(*, products(*))")
      .in("status", ["trialing", "active"])
      .single();
  };

  useEffect(() => {
    if (session?.user && !isLoadingData && !userDetails && !subscription) {
      setIsLoadingData(true);

      Promise.allSettled([getUserDetails(), getSubscription()]).then(
        (results) => {
          const [userDetailsPromise, subscriptionPromise] = results;

          if (userDetailsPromise.status === "fulfilled") {
            setUserDetails({
              ...(userDetailsPromise.value?.data ?? {}),
              first_name: "",
              last_name: "",
            } as UserDetails);
          }

          if (subscriptionPromise.status === "fulfilled") {
            setSubscription(subscriptionPromise.value?.data as Subscription);
          }
        }
      );
    } else if (!session?.user && !isLoadingData) {
      setUserDetails(null);
      setSubscription(null);
    }
  }, [session?.user]);

  const value = {
    user: session?.user ?? null,
    isLoading: isLoadingData,
    accessToken,
    userDetails,
    subscription,
  };

  return <UserContext.Provider value={value} {...props} />;
};
