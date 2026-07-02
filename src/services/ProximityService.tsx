import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import { Platform } from "react-native";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Task } from "./TasksService";
import { supabase } from "../lib/supabase";

const BACKGROUND_LOCATION_TASK = "background-location-task";
const ALERT_RADIUS_KEY = "@alert_radius";
const NOTIFIED_TASKS_KEY = "@notified_task_ids";
const CACHED_TASKS_KEY = "@cached_tasks_with_location";

// Configura o handler de notificações
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// Fórmula de Haversine para calcular a distância entre duas coordenadas em metros
export function getDistanceInMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371e3; // Raio da Terra em metros
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

// Função utilitária centralizada para verificar proximidade
export async function checkProximityForLocation(
  location: Location.LocationObject,
) {
  const { latitude: userLat, longitude: userLon } = location.coords;

  try {
    // 1. Carrega o raio configurado
    const radiusStr = await AsyncStorage.getItem(ALERT_RADIUS_KEY);
    const radius = radiusStr ? parseInt(radiusStr, 10) : 500; // padrão 500m

    // 2. Carrega as tarefas salvas no cache
    const tasksStr = await AsyncStorage.getItem(CACHED_TASKS_KEY);
    const cachedTasks: Task[] = tasksStr ? JSON.parse(tasksStr) : [];

    // 3. Carrega o estado de notificações anteriores
    const notifiedStr = await AsyncStorage.getItem(NOTIFIED_TASKS_KEY);
    const notifiedTaskIds: string[] = notifiedStr
      ? JSON.parse(notifiedStr)
      : [];
    let updatedNotifiedTaskIds = [...notifiedTaskIds];
    let hasChanges = false;

    for (const task of cachedTasks) {
      if (!task.latitude || !task.longitude) continue;

      const distance = getDistanceInMeters(
        userLat,
        userLon,
        task.latitude,
        task.longitude,
      );

      const isAlreadyNotified = notifiedTaskIds.includes(task.id);

      if (distance <= radius && !isAlreadyNotified) {
        // Usuário entrou no raio: dispara notificação local
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "Tarefa Próxima! 📍",
            body: `Você está perto da sua tarefa: "${task.title}"`,
            data: { taskId: task.id },
          },
          trigger: null, // dispara imediatamente
        });

        updatedNotifiedTaskIds.push(task.id);
        hasChanges = true;
        console.log(
          `[ProximityService] Notificação enviada para: "${task.title}" a ${distance.toFixed(0)}m`,
        );
      } else if (distance > radius * 1.2 && isAlreadyNotified) {
        // Usuário saiu do raio + 20% de buffer: reseta para poder notificar no futuro
        updatedNotifiedTaskIds = updatedNotifiedTaskIds.filter(
          (id) => id !== task.id,
        );
        hasChanges = true;
        console.log(
          `[ProximityService] Usuário se afastou de: "${task.title}". Resete de notificação ativado.`,
        );
      }
    }

    if (hasChanges) {
      await AsyncStorage.setItem(
        NOTIFIED_TASKS_KEY,
        JSON.stringify(updatedNotifiedTaskIds),
      );
    }
  } catch (err) {
    console.warn("Erro no processamento de proximidade geográfica:", err);
  }
}

// Define a tarefa de segundo plano
TaskManager.defineTask(BACKGROUND_LOCATION_TASK, async ({ data, error }) => {
  if (error) {
    console.warn("Erro na tarefa de localização em segundo plano:", error);
    return;
  }

  if (data) {
    const { locations } = data as { locations: Location.LocationObject[] };
    if (!locations || locations.length === 0) return;
    await checkProximityForLocation(locations[0]);
  }
});

interface ProximityContextType {
  radius: number;
  updateRadius: (newRadius: number) => Promise<void>;
  isTracking: boolean;
  permissionGranted: boolean;
  requestTrackingPermissions: () => Promise<boolean>;
}

const ProximityContext = createContext<ProximityContextType | undefined>(
  undefined,
);

export const ProximityProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [radius, setRadius] = useState<number>(500);
  const [isTracking, setIsTracking] = useState<boolean>(false);
  const [permissionGranted, setPermissionGranted] = useState<boolean>(false);
  const [session, setSession] = useState<any>(null);

  // Referência para guardar a assinatura do monitoramento de primeiro plano (fallback)
  const foregroundSubscription = useRef<Location.LocationSubscription | null>(
    null,
  );

  // Carrega o raio inicial do AsyncStorage
  useEffect(() => {
    const loadRadius = async () => {
      try {
        const storedRadius = await AsyncStorage.getItem(ALERT_RADIUS_KEY);
        if (storedRadius) {
          setRadius(parseInt(storedRadius, 10));
        }
      } catch (err) {
        console.warn("Erro ao carregar raio de alerta:", err);
      }
    };
    loadRadius();
  }, []);

  // Monitora a sessão do Supabase
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Inicia ou para o rastreamento com base na sessão
  useEffect(() => {
    if (session) {
      requestTrackingPermissions();
    } else {
      // Limpa rastreamento ao deslogar
      if (foregroundSubscription.current) {
        foregroundSubscription.current.remove();
        foregroundSubscription.current = null;
      }
      setIsTracking(false);
      setPermissionGranted(false);
    }

    return () => {
      if (foregroundSubscription.current) {
        foregroundSubscription.current.remove();
        foregroundSubscription.current = null;
      }
    };
  }, [session]);

  const requestTrackingPermissions = async (): Promise<boolean> => {
    if (Platform.OS === "web") return false;

    try {
      // 1. Permissão de Notificações (não-crítica: continua mesmo se negada)
      try {
        const settings = await Notifications.getPermissionsAsync();
        let notificationStatus = settings.status;
        if (notificationStatus !== "granted") {
          const response = await Notifications.requestPermissionsAsync();
          notificationStatus = response.status;
        }
        if (notificationStatus !== "granted") {
          console.warn(
            "[ProximityService] Permissão de notificações negada. Continuando sem notificações.",
          );
        }
      } catch (notifError) {
        console.warn(
          "[ProximityService] Erro ao solicitar permissão de notificações (ignorado no Expo Go):",
          notifError,
        );
      }

      // 2. Permissão de Localização em Primeiro Plano (crítica)
      try {
        const { status: fgStatus } =
          await Location.requestForegroundPermissionsAsync();
        if (fgStatus !== Location.PermissionStatus.GRANTED) {
          console.warn(
            "[ProximityService] Permissão de localização em primeiro plano negada",
          );
          setPermissionGranted(false);
          return false;
        }
      } catch (fgError) {
        console.warn(
          "[ProximityService] Erro ao solicitar permissão de localização em primeiro plano:",
          fgError,
        );
        setPermissionGranted(false);
        return false;
      }

      // 3. Tentar segundo plano, mas usar fallback de primeiro plano se falhar
      try {
        const isBgAvailable =
          await Location.isBackgroundLocationAvailableAsync();
        if (isBgAvailable) {
          const { status: bgStatus } =
            await Location.requestBackgroundPermissionsAsync();
          if (bgStatus === Location.PermissionStatus.GRANTED) {
            setPermissionGranted(true);
            startBackgroundTracking();
            return true;
          }
        }
      } catch (bgError) {
        console.warn(
          "[ProximityService] Background location indisponível (Expo Go / simulador):",
          bgError,
        );
      }

      // Fallback: usar monitoramento em primeiro plano
      console.log(
        "[ProximityService] Usando monitoramento em primeiro plano (fallback)",
      );
      setPermissionGranted(true);
      startForegroundTracking();
      return true;
    } catch (error) {
      console.warn(
        "[ProximityService] Erro geral ao solicitar permissões:",
        error,
      );
      setPermissionGranted(false);
      return false;
    }
  };

  const startBackgroundTracking = async () => {
    try {
      const isRegistered = await TaskManager.isTaskRegisteredAsync(
        BACKGROUND_LOCATION_TASK,
      );
      if (!isRegistered) {
        console.log(
          "[ProximityService] Registrando tarefa de segundo plano...",
        );
      }

      await Location.startLocationUpdatesAsync(BACKGROUND_LOCATION_TASK, {
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 10000, // a cada 10 segundos
        distanceInterval: 10, // a cada 10 metros
        foregroundService: {
          notificationTitle: "RotinaApp Rastreando Proximidade",
          notificationBody: "Buscando tarefas próximas à sua localização.",
          notificationColor: "#50E6FF",
        },
      });

      setIsTracking(true);
      console.log(
        "[ProximityService] Monitoramento em segundo plano iniciado com sucesso!",
      );
    } catch (error) {
      console.warn(
        "[ProximityService] Background tracking indisponível. Ativando fallback em primeiro plano...",
        error,
      );
      startForegroundTracking();
    }
  };

  const startForegroundTracking = async () => {
    try {
      // Limpa qualquer monitoramento ativo anterior
      if (foregroundSubscription.current) {
        foregroundSubscription.current.remove();
        foregroundSubscription.current = null;
      }

      foregroundSubscription.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          timeInterval: 10000, // a cada 10 segundos
          distanceInterval: 10, // a cada 10 metros
        },
        async (loc) => {
          await checkProximityForLocation(loc);
        },
      );

      setIsTracking(true);
      console.log(
        "[ProximityService] Monitoramento em primeiro plano (fallback) ativo!",
      );
    } catch (error) {
      console.warn(
        "[ProximityService] Erro ao iniciar monitoramento em primeiro plano (fallback):",
        error,
      );
      setIsTracking(false);
    }
  };

  const updateRadius = async (newRadius: number) => {
    try {
      setRadius(newRadius);
      await AsyncStorage.setItem(ALERT_RADIUS_KEY, newRadius.toString());
      // Reinicia o rastreamento para aplicar possíveis mudanças, se estiver ativo
      if (isTracking) {
        if (foregroundSubscription.current) {
          await startForegroundTracking();
        } else {
          await startBackgroundTracking();
        }
      }
    } catch (err) {
      console.warn("Erro ao atualizar raio de alerta:", err);
    }
  };

  return (
    <ProximityContext.Provider
      value={{
        radius,
        updateRadius,
        isTracking,
        permissionGranted,
        requestTrackingPermissions,
      }}
    >
      {children}
    </ProximityContext.Provider>
  );
};

export const useProximity = () => {
  const context = useContext(ProximityContext);
  if (!context) {
    throw new Error(
      "useProximity deve ser usado dentro de um ProximityProvider",
    );
  }
  return context;
};
