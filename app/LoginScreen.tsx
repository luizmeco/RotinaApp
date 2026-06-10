import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Background from "./Background";
import GlassCard from "./GlassCard";
import GlassInput from "./GlassInput";
import PrimaryButton from "./PrimaryButton";

export default function LoginScreen() {
  // Estados para controlar o formulário e a interface
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();

  return (
    <Background>
      {/* Card Principal - Glassmorphism */}
      <GlassCard>
        {/* Cabeçalho / Logo */}
        <View className="items-center mb-8">
          {/* Logo Placeholder (Você pode trocar por um <Image /> depois) */}
          <View className="w-16 h-16 bg-white/10 rounded-2xl items-center justify-center mb-4 border border-white/20">
            <Feather name="map-pin" size={32} color="#a3c9ff" />
          </View>
          <Text className="text-on-surface font-display text-2xl">
            Bem-vindo de volta
          </Text>
          <Text className="text-on-surface-variant font-['Inter'] text-sm text-center mt-2">
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
          />

          {/* Input: Senha */}
          <View className="mt-4">
            <GlassInput
              label="Senha"
              iconName="lock"
              placeholder="••••••••"
              isPassword
            />
          </View>
        </View>

        {/* Opções extras */}
        <View className="flex-row items-center justify-between mb-8">
          <TouchableOpacity
            className="flex-row items-center gap-2"
            onPress={() => setRememberMe(!rememberMe)}
            activeOpacity={0.7}
          >
            <View
              className={`w-5 h-5 rounded border items-center justify-center ${rememberMe ? "bg-primary border-primary" : "border-white/20 bg-white/5"}`}
            >
              {rememberMe && <Feather name="check" size={14} color="white" />}
            </View>
            <Text className="text-on-surface-variant font-['Inter'] text-sm">
              Lembrar de mim
            </Text>
          </TouchableOpacity>

          <TouchableOpacity>
            <Text className="text-primary font-['Inter'] text-sm font-semibold">
              Esqueceu a senha?
            </Text>
          </TouchableOpacity>
        </View>

        {/* Botão de Ação */}
        <PrimaryButton title="Entrar" iconName="arrow-right" />

        {/* Link para Cadastro */}
        <View className="flex-row justify-center items-center mt-6">
          <Text className="text-on-surface-variant font-['Inter'] text-sm">
            Não tem uma conta?{" "}
          </Text>
          <TouchableOpacity onPress={() => router.push("/register")}>
            <Text className="text-primary font-['Inter'] text-sm font-bold">
              Cadastre-se
            </Text>
          </TouchableOpacity>
        </View>
      </GlassCard>
    </Background>
  );
}
