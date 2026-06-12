import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Background from "../components/Background";
import GlassCard from "../components/GlassCard";
import GlassInput from "../components/GlassInput";
import PrimaryButton from "../components/PrimaryButton";
import { useThemeColors } from "../hooks/useThemeColors";
import { useLogin } from "../services/LoginService";

export default function LoginScreen() {
  const router = useRouter();

  const {
    email,
    setEmail,
    password,
    setPassword,
    rememberMe,
    setRememberMe,
    loading,
    errorMessage,
    handleLogin,
  } = useLogin();
  const colors = useThemeColors();

  return (
    <Background>
      {/* Card Principal - Glassmorphism */}
      <GlassCard>
        {/* Cabeçalho / Logo */}
        <View className="items-center mb-8">
          {/* Logo Placeholder (Você pode trocar por um <Image /> depois) */}
          <View className="w-16 h-16 bg-glass-white rounded-2xl items-center justify-center mb-4 border border-glass-border">
            <Feather name="map-pin" size={32} color={colors["primary-light"]} />
          </View>
          <Text className="text-on-surface font-bold text-2xl">
            Bem-vindo de volta
          </Text>
          <Text className="text-on-surface-variant font-light text-sm text-center mt-2">
            Insira seus dados para acessar o RotinaApp.
          </Text>
        </View>

        {/* Formulário */}
        <View className="space-y-4 mb-6">
          {/* Input: E-mail */}
          <GlassInput
            label="E-mail"
            iconName="mail"
            placeholder="Digite seu e-mail"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          {/* Input: Senha */}
          <View className="mt-4">
            <GlassInput
              label="Senha"
              iconName="lock"
              placeholder="••••••••"
              isPassword
              value={password}
              onChangeText={setPassword}
            />
          </View>
        </View>

        {/* Mensagem de Erro */}
        {errorMessage ? (
          <Text className="text-error text-sm text-center mb-4 font-semibold">
            {errorMessage}
          </Text>
        ) : null}

        {/* Opções extras */}
        <View className="flex-row items-center justify-between mb-8">
          <TouchableOpacity
            className="flex-row items-center gap-2"
            onPress={() => setRememberMe(!rememberMe)}
            activeOpacity={0.7}
          >
            <View
              className={`w-5 h-5 rounded border items-center justify-center ${rememberMe ? "bg-primary border-primary" : "border-glass-border bg-glass-white"}`}
            >
              {rememberMe && <Feather name="check" size={14} color="white" />}
            </View>
            <Text className="text-on-surface-variant font-light text-sm">
              Lembrar de mim
            </Text>
          </TouchableOpacity>

          <TouchableOpacity>
            <Text className="text-primary font-semibold text-sm">
              Esqueceu a senha?
            </Text>
          </TouchableOpacity>
        </View>

        {/* Botão de Ação */}
        <PrimaryButton
          title={loading ? "Entrando..." : "Entrar"}
          iconName="arrow-right"
          colorClass="bg-primary/90"
          textColorClass="text-on-primary"
          disabled={loading}
          onPress={handleLogin}
        />

        {/* Link para Cadastro */}
        <View className="flex-row justify-center items-center mt-6">
          <Text className="text-on-secondary font-light text-sm">
            Não tem uma conta?{" "}
          </Text>
          <TouchableOpacity onPress={() => router.push("/register")}>
            <Text className="text-primary-container font-bold text-sm">
              Cadastre-se
            </Text>
          </TouchableOpacity>
        </View>
      </GlassCard>
    </Background>
  );
}
