import { useEffect } from "react";
import { useAuth } from "./AuthContext";
import { useWishlist } from "./WishlistContext";

const AuthEffects = () => {
  const { user } = useAuth();
  const { fetchWishlist, clearWishlist } = useWishlist();

  console.log("[AuthEffects] THIS COMPONENT IS NOW RUNNING!");

  useEffect(() => {
    console.log(
      "[AuthEffects] useEffect is running. User state is:",
      user ? "Logged In" : "Logged Out"
    );

    if (user) {
      fetchWishlist();
    } else {
      clearWishlist();
    }
  }, [user, fetchWishlist, clearWishlist]);

  return null;
};

export default AuthEffects;
