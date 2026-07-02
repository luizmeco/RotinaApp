import { Session } from "@supabase/supabase-js";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import "react-native-reanimated";
import "../global.css";
import { supabase } from "../src/lib/supabase";

import {
  HankenGrotesk_300Light,
  HankenGrotesk_400Regular,
  HankenGrotesk_600SemiBold,
  HankenGrotesk_700Bold,
  useFonts,
} from "@expo-google-fonts/hanken-grotesk";
import LoadingScreen from "../src/components/LoadingScreen";

import { ProximityProvider } from "../src/services/ProximityService";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [session, setSession] = useState<Session | null>(null);
  const [authInitialized, setAuthInitialized] = useState(false);

  const router = useRouter();
  const segments = useSegments();

  const [fontsLoaded, error] = useFonts({
    HankenGrotesk_300Light,
    HankenGrotesk_400Regular,
    HankenGrotesk_600SemiBold,
    HankenGrotesk_700Bold,
  });

  // 1. Inicializa e escuta a sessão do Supabase
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthInitialized(true);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // 2. Roteamento de Proteção
  useEffect(() => {
    if (!fontsLoaded || !authInitialized) return;

    // Pega o nome do primeiro segmento da URL (ex: "(auth)" ou "(tabs)")
    const inAuthGroup = segments[0] === "(auth)";
    const inTabsGroup = segments[0] === "(tabs)";

    if (session && !inTabsGroup) {
      // Logado mas NÃO está nas tabs (ex: tela inicial ou login) -> manda para o app
      router.replace("/(tabs)/tasks");
    } else if (!session && !inAuthGroup) {
      // Não logado tentando acessar qualquer outra página fora da Auth -> manda para login
      router.replace("/(auth)/login");
    }
  }, [session, fontsLoaded, authInitialized, segments]);

  // 3. Esconde o Splash Screen nativo apenas quando as fontes carregarem
  useEffect(() => {
    if (fontsLoaded || error) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  // Trava a renderização de textos até a fonte carregar
  if (!fontsLoaded && !error) {
    return null;
  }

  const inAuthGroup = segments[0] === "(auth)";
  const inTabsGroup = segments[0] === "(tabs)";

  // Define se devemos mostrar a tela de carregamento animada
  const isRouting =
    !authInitialized || (session && !inTabsGroup) || (!session && !inAuthGroup);

  return (
    <ProximityProvider>
      <View style={{ flex: 1 }}>
        <Stack>
          <Stack.Screen
            name="(auth)"
            options={{ headerShown: false, animation: "none" }}
          />
          <Stack.Screen
            name="(tabs)"
            options={{ headerShown: false, animation: "none" }}
          />
        </Stack>

        {/* Sobrepõe a nossa LoadingScreen caso o sistema ainda esteja decidindo rotas ou carregando a Auth */}
        {isRouting && (
          <View style={StyleSheet.absoluteFill} className="z-50">
            <LoadingScreen />
          </View>
        )}
      </View>
    </ProximityProvider>
  );
}
