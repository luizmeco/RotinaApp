import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Background from "../components/Background";
import GlassCard from "../components/GlassCard";
import GlassInput from "../components/GlassInput";
import PrimaryButton from "../components/PrimaryButton";
import { useThemeColors } from "../hooks/useThemeColors";
import { useRegister } from "../services/useRegister";

export default function RegisterScreen() {
  const router = useRouter();

  const {
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
  } = useRegister();
  const colors = useThemeColors();

  return (
    <Background>
      <GlassCard>
        {/* Cabeçalho / Logo */}
        <View className="items-center mb-8">
          <View className="w-16 h-16 bg-glass-white rounded-2xl items-center justify-center mb-4 border border-glass-border">
            <Feather
              name="user-plus"
              size={32}
              color={colors["primary-light"]}
            />
          </View>
          <Text className="text-on-surface font-bold text-2xl">
            Crie sua conta
          </Text>
          <Text className="text-on-surface-variant font-light text-sm text-center mt-2">
            Preencha os dados abaixo para começar.
          </Text>
        </View>

        {/* Formulário */}
        <View className="mb-6">
          <View className="mb-4">
            <GlassInput
              label="Nome completo"
              iconName="user"
              placeholder="Digite seu nome"
              autoCapitalize="words"
              value={name}
              onChangeText={setName}
            />
          </View>

          <GlassInput
            label="E-mail"
            iconName="mail"
            placeholder="Digite seu e-mail"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

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

          <View className="mt-4">
            <GlassInput
              label="Confirmar Senha"
              iconName="lock"
              placeholder="••••••••"
              isPassword
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </View>
        </View>

        {/* Mensagem de Erro */}
        {errorMessage ? (
          <Text className="text-error text-sm text-center mb-4 font-semibold">
            {errorMessage}
          </Text>
        ) : null}

        {/* Botão de Ação */}
        <PrimaryButton
          title={loading ? "Cadastrando" : "Cadastrar"}
          iconName="check"
          disabled={loading}
          onPress={handleRegister}
        />

        {/* Link para Login */}
        <View className="flex-row justify-center items-center mt-6">
          <Text className="text-on-surface-variant font-light text-sm">
            Já tem uma conta?{" "}
          </Text>
          <TouchableOpacity onPress={() => router.push("/login")}>
            <Text className="text-primary-container font-bold text-sm">
              Faça login
            </Text>
          </TouchableOpacity>
        </View>
      </GlassCard>
    </Background>
  );
}
