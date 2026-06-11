import { useEffect } from "react";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import "react-native-reanimated";
import "../global.css";

// 1. Importando as fontes diretamente do pacote do Google Fonts
import { 
  useFonts, 
  HankenGrotesk_300Light,
  HankenGrotesk_400Regular,
  HankenGrotesk_600SemiBold, 
  HankenGrotesk_700Bold 
} from '@expo-google-fonts/hanken-grotesk';

// Segura a tela de abertura do aplicativo até a fonte carregar
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {

  // 2. Carregando as fontes para a memória do dispositivo
  const [fontsLoaded, error] = useFonts({
    HankenGrotesk_300Light,
    HankenGrotesk_400Regular,
    HankenGrotesk_600SemiBold,
    HankenGrotesk_700Bold,
  });

  // 3. Quando a fonte carregar, esconde a tela de splash
  useEffect(() => {
    if (fontsLoaded || error) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  // Enquanto a fonte não carregar, não renderiza nada para não dar "piscão" na tela
  if (!fontsLoaded && !error) {
    return null;
  }

  return (
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
  );
}
