import { useState } from "react";
import { Alert } from "react-native";
import { supabase } from "../lib/supabase";

export type TaskPriority = "baixa" | "media" | "alta";

export interface CreateTaskFormData {
  title: string;
  description: string;
  priority: TaskPriority;
  latitude: number | null;
  longitude: number | null;
}

const initialFormData: CreateTaskFormData = {
  title: "",
  description: "",
  priority: "media",
  latitude: null,
  longitude: null,
};

export function useCreateTaskForm(onSuccess?: () => void) {
  const [formData, setFormData] = useState<CreateTaskFormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Atualiza um campo individual do formulário
  const setField = <K extends keyof CreateTaskFormData>(
    field: K,
    value: CreateTaskFormData[K],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Limpa o erro do campo ao editá-lo
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  // Atualiza as coordenadas de uma vez
  const setCoordinates = (latitude: number, longitude: number) => {
    setFormData((prev) => ({ ...prev, latitude, longitude }));
    if (errors.location) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.location;
        return next;
      });
    }
  };

  // Validação dos campos obrigatórios
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "O título é obrigatório.";
    }

    if (formData.latitude === null || formData.longitude === null) {
      newErrors.location = "Selecione a localização no mapa.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Envia a tarefa para o Supabase
  const handleCreate = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

      // Recuperar o usuário logado
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw userError;
      if (!user) {
        Alert.alert("Erro", "Usuário não autenticado.");
        return;
      }

      const { error } = await supabase.from("tasks").insert({
        user_id: user.id,
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        latitude: formData.latitude,
        longitude: formData.longitude,
        priority: formData.priority,
      });

      if (error) throw error;

      // Sucesso: limpa o formulário e chama o callback
      resetForm();
      onSuccess?.();
    } catch (error: any) {
      Alert.alert("Erro ao criar tarefa", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Reseta o formulário para o estado inicial
  const resetForm = () => {
    setFormData(initialFormData);
    setErrors({});
  };

  return {
    formData,
    loading,
    errors,
    setField,
    setCoordinates,
    handleCreate,
    resetForm,
  };
}
