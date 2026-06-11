import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Background from "../components/Background";
import GlassCard from "../components/GlassCard";
import GlassInput from "../components/GlassInput";
import PrimaryButton from "../components/PrimaryButton";

export default function RegisterScreen() {
  const router = useRouter();

  return (
    <Background>
      <GlassCard>
        {/* Cabeçalho / Logo */}
        <View className="items-center mb-8">
          <View className="w-16 h-16 bg-white/10 rounded-2xl items-center justify-center mb-4 border border-white/20">
            <Feather name="user-plus" size={32} color="#a3c9ff" />
          </View>
          <Text className="text-on-surface font-display text-2xl">
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
            />
          </View>

          <GlassInput
            label="E-mail"
            iconName="mail"
            placeholder="Digite seu e-mail"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <View className="mt-4">
            <GlassInput
              label="Senha"
              iconName="lock"
              placeholder="••••••••"
              isPassword
            />
          </View>

          <View className="mt-4">
            <GlassInput
              label="Confirmar Senha"
              iconName="lock"
              placeholder="••••••••"
              isPassword
            />
          </View>
        </View>

        {/* Botão de Ação */}
        <PrimaryButton title="Cadastrar" iconName="check" />

        {/* Link para Login */}
        <View className="flex-row justify-center items-center mt-6">
          <Text className="text-on-surface-variant font-light text-sm">
            Já tem uma conta?{" "}
          </Text>
          <TouchableOpacity onPress={() => router.push("/login")}>
            <Text className="text-primary font-light text-sm font-bold">
              Faça login
            </Text>
          </TouchableOpacity>
        </View>
      </GlassCard>
    </Background>
  );
}
