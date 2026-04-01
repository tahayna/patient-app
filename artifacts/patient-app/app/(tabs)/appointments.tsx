import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  Platform,
  RefreshControl,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { useColors } from "@/hooks/useColors";
import { AppointmentCard, Appointment } from "@/components/AppointmentCard";
import { LoadingState, ErrorState, EmptyState } from "@/components/LoadingState";

type Tab = "upcoming" | "past";

const TABS: { key: Tab; label: string }[] = [
  { key: "upcoming", label: "Upcoming" },
  { key: "past", label: "Past" },
];

interface AppointmentsResponse {
  appointments?: Appointment[];
  data?: Appointment[];
}

export default function AppointmentsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<Tab>("upcoming");

  const { data, isLoading, isError, refetch, isRefetching } =
    useQuery<AppointmentsResponse>({
      queryKey: ["/api/appointments?limit=100"],
    });

  const all: Appointment[] = (data?.appointments ?? data?.data ?? []) as Appointment[];

  const upcoming = all
    .filter((a) => a.status === "confirmed" || a.status === "scheduled")
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const past = all
    .filter(
      (a) =>
        a.status === "completed" ||
        a.status === "cancelled" ||
        a.status === "no_show"
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const shown = activeTab === "upcoming" ? upcoming : past;

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.headerBar,
          {
            paddingTop: topPad + 12,
            backgroundColor: colors.background,
          },
        ]}
      >
        <Text style={[styles.pageTitle, { color: colors.foreground }]}>
          Appointments
        </Text>

        <View style={[styles.segmented, { backgroundColor: colors.muted }]}>
          {TABS.map((tab) => (
            <Pressable
              key={tab.key}
              onPress={() => setActiveTab(tab.key)}
              style={[
                styles.segTab,
                activeTab === tab.key && {
                  backgroundColor: colors.card,
                  shadowColor: colors.shadow,
                },
              ]}
            >
              <Text
                style={[
                  styles.segLabel,
                  {
                    color:
                      activeTab === tab.key
                        ? colors.primary
                        : colors.mutedForeground,
                  },
                ]}
              >
                {tab.label}
              </Text>
              {activeTab === tab.key && (
                <View
                  style={[styles.segCount, { backgroundColor: colors.primaryLight }]}
                >
                  <Text style={[styles.segCountText, { color: colors.primary }]}>
                    {(activeTab === "upcoming" ? upcoming : past).length}
                  </Text>
                </View>
              )}
            </Pressable>
          ))}
        </View>
      </View>

      {isLoading ? (
        <LoadingState message="Loading your appointments..." />
      ) : isError ? (
        <ErrorState message="Could not load appointments." onRetry={refetch} />
      ) : (
        <FlatList
          data={shown}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => <AppointmentCard appointment={item} />}
          contentContainerStyle={[
            styles.list,
            {
              paddingBottom: (Platform.OS === "web" ? 34 : insets.bottom) + 80,
            },
          ]}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor={colors.primary}
            />
          }
          scrollEnabled={shown.length > 0}
          ListEmptyComponent={
            <EmptyState
              icon="calendar-outline"
              title={
                activeTab === "upcoming"
                  ? "No upcoming appointments"
                  : "No past appointments"
              }
              subtitle={
                activeTab === "upcoming"
                  ? "Your scheduled visits will appear here"
                  : "Completed and cancelled visits will show here"
              }
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  headerBar: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 16,
  },
  pageTitle: {
    fontSize: 26,
    fontFamily: "PlusJakartaSans_700Bold",
    letterSpacing: -0.5,
  },
  segmented: {
    flexDirection: "row",
    borderRadius: 12,
    padding: 4,
    gap: 4,
  },
  segTab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 9,
    gap: 6,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  segLabel: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans_600SemiBold",
  },
  segCount: {
    borderRadius: 100,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  segCountText: {
    fontSize: 11,
    fontFamily: "PlusJakartaSans_700Bold",
  },
  list: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
});
