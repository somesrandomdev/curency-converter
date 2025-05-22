// app/_layout.jsx
import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Currency Converter',
          headerStyle: { backgroundColor: '#f0f0f0' },
        }}
      />
    </Stack>
  );
}