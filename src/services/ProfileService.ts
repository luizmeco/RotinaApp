import { useEffect, useState } from "react";
import { Alert } from "react-native";
import * as Notifications from "expo-notifications";
import { supabase } from "../lib/supabase";
import { useProximity } from "./ProximityService";

export function useProfile() {
  const { radius, updateRadius } = useProximity();
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          setEmail(user.email || "");
          setName(user.user_metadata?.full_name || "");
        }
      } catch (error: any) {
        console.error("Erro ao obter dados do usuário:", error);
      } finally {
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

  const sendTestNotification = async () => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Tarefa Próxima! 📍",
          body: `Teste: Você está a menos de ${radius}m de uma tarefa pendente.`,
          data: { taskId: "test" },
        },
        trigger: null,
      });
      Alert.alert("Sucesso", "Notificação de teste enviada!");
    } catch (error) {
      Alert.alert(
        "Erro",
        "Não foi possível enviar a notificação de teste. Verifique se as permissões de notificação estão ativas.",
      );
      console.warn(
        "[ProfileService] Erro ao enviar notificação de teste:",
        error,
      );
    }
  };

  return {
    loading,
    name,
    email,
    handleLogout,
    radius,
    updateRadius,
    sendTestNotification,
  };
}
