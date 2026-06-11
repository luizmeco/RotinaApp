import { useState, useEffect } from "react";
import { Alert } from "react-native";
import { supabase } from "../lib/supabase";

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      // 1. Recuperar o usuário atualmente logado
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw userError;
      if (!user) return;

      // 2. Buscar as tarefas filtrando pelo ID do usuário
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setTasks(data || []);
    } catch (error: any) {
      Alert.alert("Erro ao buscar tarefas", error.message);
    } finally {
      setLoading(false);
    }
  };

  return { tasks, loading, fetchTasks };
}
