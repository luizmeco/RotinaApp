import { useEffect } from 'react';
import { View, Text } from 'react-native';
import { useFonts, Inter_400Regular } from '@expo-google-fonts/inter';
import { HankenGrotesk_700Bold, HankenGrotesk_600SemiBold } from '@expo-google-fonts/hanken-grotesk';

import LoginScreen from "./LoginScreen";

export default function Home() {

  let [fontsLoaded] = useFonts({
    Inter: Inter_400Regular,
    HankenGrotesk_Bold: HankenGrotesk_700Bold,
    HankenGrotesk_SemiBold: HankenGrotesk_600SemiBold,
  });

  if (!fontsLoaded) {
    // Retorna nulo ou uma tela de splash enquanto carrega a fonte
    return null; 
  }

  return (
      <LoginScreen />
  );
}
