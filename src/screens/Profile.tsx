import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import tailwindConfig from "../../tailwind.config";
import Background from "../components/Background";
import PrimaryButton from "../components/PrimaryButton";

const colors = (tailwindConfig?.theme?.extend?.colors ?? {}) as Record<
  string,
  string
>;

export default function Profile() {
  return (
    <Background>
      {/* Avatar e Informações do Usuário */}
      <View className="items-center mb-10">
        <View className="w-24 h-24 rounded-full bg-surface-variant items-center justify-center border-2 border-primary-light mb-4">
          <SimpleLineIcons
            name="user"
            size={40}
            color={colors["primary-light"]}
          />
        </View>
        <Text className="text-primary-light font-semibold text-2xl">
          Nome do Usuário
        </Text>
        <Text className="text-outline font-regular text-sm mt-1">
          usuario@email.com
        </Text>
      </View>

      {/* Opções de Navegação */}
      <TouchableOpacity
        className="flex-row items-center bg-black/20 border border-white/5 rounded-2xl mb-4 px-4 h-14"
        activeOpacity={0.7}
      >
        <SimpleLineIcons name="settings" size={20} color={colors.outline} />
        <Text className="flex-1 text-white font-semibold text-base ml-4">
          Configurações
        </Text>
        <SimpleLineIcons name="arrow-right" size={16} color={colors.outline} />
      </TouchableOpacity>

      <TouchableOpacity
        className="flex-row items-center bg-black/20 border border-white/5 rounded-2xl mb-4 px-4 h-14"
        activeOpacity={0.7}
      >
        <SimpleLineIcons name="bell" size={20} color={colors.outline} />
        <Text className="flex-1 text-white font-semibold text-base ml-4">
          Notificações
        </Text>
        <SimpleLineIcons name="arrow-right" size={16} color={colors.outline} />
      </TouchableOpacity>

      {/* Botão de Logout */}
      <PrimaryButton
          title={"Logout"}
          iconName="logout"
          colorClass="bg-error/30"
          textColorClass="text-on-primary"
        />
    </Background>
  );
}
