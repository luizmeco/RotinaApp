import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert } from "react-native";
import { supabase } from "../lib/supabase"; // Ajuste o caminho se a instância do Supabase estiver em outro lugar
import { isStrongPassword, isValidEmail } from "../utils/validators";

export function useRegister() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleRegister = async () => {
    setErrorMessage("");

    if (!name || !email || !password || !confirmPassword) {
      return setErrorMessage("Por favor, preencha todos os campos.");
    }
    if (!isValidEmail(email)) {
      return setErrorMessage("Por favor, insira um e-mail válido.");
    }
    if (!isStrongPassword(password)) {
      return setErrorMessage(
        "A senha deve ter no mínimo 8 caracteres, com pelo menos uma letra maiúscula, uma minúscula e um número.",
      );
    }
    if (password !== confirmPassword) {
      return setErrorMessage("As senhas não coincidem.");
    }

    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
      },
    });
    setLoading(false);

    if (error) {
      setErrorMessage(error.message);
    } else {
      Alert.alert(
        "Sucesso",
        "Conta criada! Verifique seu e-mail para confirmar.",
      );
      router.push("/login");
    }
  };

  return {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    loading,
    errorMessage,
    handleRegister,
  };
}
