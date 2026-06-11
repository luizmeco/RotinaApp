import { useRouter } from "expo-router";
import { useState } from "react";
import { supabase } from "../lib/supabase";
import { isValidEmail } from "../utils/validators";

export function useLogin() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async () => {
    setErrorMessage("");

    if (!email || !password) {
      return setErrorMessage("Por favor, preencha todos os campos.");
    }
    if (!isValidEmail(email)) {
      return setErrorMessage("Por favor, insira um e-mail válido.");
    }

    setLoading(true);

    // O Supabase, junto ao AsyncStorage, já mantém a sessão persistente nativamente.
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setErrorMessage(error.message);
    } else {
      router.replace("/(tabs)/tasks");
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    rememberMe,
    setRememberMe,
    loading,
    errorMessage,
    handleLogin,
  };
}
