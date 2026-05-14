import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Pokédex' }} />
      <Stack.Screen name="favorites" options={{ title: 'Favoritos' }} />
      <Stack.Screen name="regions" options={{ title: 'Regiones' }} />
      <Stack.Screen name="region/[name]" options={{ title: 'Región' }} />
      <Stack.Screen name="teams" options={{ title: 'Mis Equipos' }} />
      <Stack.Screen name="team/[id]" options={{ title: 'Equipo' }} />
      <Stack.Screen name="detail/[name]" options={{ title: 'Detalle' }} />
    </Stack>
  );
}