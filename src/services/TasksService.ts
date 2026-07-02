import { useState, useEffect, useMemo } from "react";
import { Alert } from "react-native";
import { supabase } from "../lib/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  latitude: number;
  longitude: number;
}

export type FilterOption = "all" | "alta" | "media" | "baixa";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<FilterOption>("all");

  // Estado local para armazenar o status otimista (Optimistic UI)
  const [optimisticStatuses, setOptimisticStatuses] = useState<
    Record<string, string>
  >({});

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

  // Função para atualizar o status no banco de dados com Atualização Otimista
  const handleToggleTask = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "concluida" ? "pendente" : "concluida";

    // 1. Atualiza visualmente na mesma hora para o usuário
    setOptimisticStatuses((prev) => ({ ...prev, [id]: newStatus }));

    // 2. Envia em background para o banco
    const { error } = await supabase
      .from("tasks")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) {
      // 3. Em caso de falha, desfaz a alteração visual
      setOptimisticStatuses((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      Alert.alert("Erro", "Não foi possível atualizar a tarefa.");
      console.error("Erro ao atualizar status:", error);
    }
  };

  // Mapeia e filtra as tarefas, aplicando o status otimista se existir
  const filteredTasks = useMemo(() => {
    return tasks
      .map((task) => ({
        ...task,
        status: optimisticStatuses[task.id] || task.status,
      }))
      .filter(
        (task) => selectedFilter === "all" || task.priority === selectedFilter,
      );
  }, [tasks, optimisticStatuses, selectedFilter]);

  // Sincroniza tarefas pendentes que têm localização com o AsyncStorage para uso em segundo plano
  useEffect(() => {
    if (loading) return;

    const cacheTasks = async () => {
      try {
        const activeTasksWithLoc = filteredTasks.filter(
          (t) =>
            t.status !== "concluida" &&
            t.latitude !== undefined &&
            t.latitude !== null &&
            t.longitude !== undefined &&
            t.longitude !== null,
        );
        await AsyncStorage.setItem(
          "@cached_tasks_with_location",
          JSON.stringify(activeTasksWithLoc),
        );
      } catch (err) {
        console.error("Erro ao salvar cache de tarefas:", err);
      }
    };

    cacheTasks();
  }, [filteredTasks, loading]);

  return {
    tasks,
    filteredTasks,
    loading,
    fetchTasks,
    selectedFilter,
    setSelectedFilter,
    handleToggleTask,
  };
}
