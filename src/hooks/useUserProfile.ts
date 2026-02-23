import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface UserProfile {
  id: string;
  full_name: string | null;
  email: string | null;
}

export const useUserProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      // Try profiles table first
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, email")
        .eq("id", user.id)
        .maybeSingle();

      if (data && !error) {
        setProfile(data);
      } else {
        // Fallback to user metadata
        const meta = user.user_metadata;
        setProfile({
          id: user.id,
          full_name: meta?.full_name || meta?.name || null,
          email: user.email || null,
        });
      }
      setLoading(false);
    };

    fetchProfile();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      fetchProfile();
    });

    return () => subscription.unsubscribe();
  }, []);

  const firstName = profile?.full_name?.split(" ")[0] || "Motorista";

  return { profile, loading, firstName };
};
