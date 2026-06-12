import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import React, { useEffect, useState } from "react";
import { Alert, Text, View } from "react-native";
import Background from "../components/Background";
import LoadingScreen from "../components/LoadingScreen";
import PrimaryButton from "../components/PrimaryButton";
import { useThemeColors } from "../hooks/useThemeColors";
import { supabase } from "../lib/supabase";

export default function Profile() {
  const colors = useThemeColors();
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setEmail(user.email || "");
        setName(user.user_metadata?.full_name || "");
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert("Erro", "Ocorreu um erro ao tentar sair da conta.");
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

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
          {name}
        </Text>
        <Text className="text-outline font-regular text-sm mt-1">{email}</Text>
      </View>

      {/* Botão de Logout */}
      <PrimaryButton
        title={"Logout"}
        iconName="logout"
        colorClass="bg-error/50"
        textColorClass="text-on-primary"
        onPress={handleLogout}
      />
    </Background>
  );
}
