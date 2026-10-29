import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { palette } from "../../constants/palette";

type IconName = React.ComponentProps<typeof Ionicons>["name"];

const icon =
  (active: IconName, inactive: IconName) =>
  ({
    color,
    size,
    focused,
  }: {
    color: string | number;
    size: number;
    focused: boolean;
  }) => (
    <Ionicons
      name={focused ? active : inactive}
      size={size}
      color={typeof color === "string" ? color : palette.muted}
    />
  );

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: palette.background },
        headerShadowVisible: false,
        headerTintColor: palette.text,
        headerTitleAlign: "left",
        headerTitleStyle: { fontWeight: "800", fontSize: 20 },

        tabBarActiveTintColor: palette.primary,
        tabBarInactiveTintColor: palette.muted,
        tabBarLabelStyle: { fontSize: 11, fontWeight: "600" },
        tabBarStyle: {
          backgroundColor: palette.background,
          borderTopColor: palette.border,
          borderTopWidth: 1,
          elevation: 0,
        },

        sceneStyle: { backgroundColor: palette.background },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerTitle: "Music Quiz",
          tabBarIcon: icon("home", "home-outline"),
        }}
      />

      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          headerTitle: "Explore",
          tabBarIcon: icon("compass", "compass-outline"),
        }}
      />

      <Tabs.Screen
        name="quiz"
        options={{
          title: "Quiz",
          headerTitle: "Play Quiz",
          tabBarIcon: icon("musical-notes", "musical-notes-outline"),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerTitle: "Profile",
          tabBarIcon: icon("person", "person-outline"),
        }}
      />
    </Tabs>
  );
}
