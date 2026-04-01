import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
  RefreshControl,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";
import { AppointmentCard, Appointment } from "@/components/AppointmentCard";
import { LoadingState, ErrorState, EmptyState } from "@/components/LoadingState";

interface AppointmentsResponse {
  appointments?: Appointment[];
  data?: Appointment[];
}

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function getFirstName(name: string): string {
  return name?.split(" ")[0] ?? "Patient";
}

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  const {
    data,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useQuery<AppointmentsResponse>({
    queryKey: ["/api/appointments?limit=10"],
  });

  const appointments: Appointment[] = (data?.appointments ?? data?.data ?? []) as Appointment[];
  const upcoming = appointments
    .filter((a) => a.status === "confirmed" || a.status === "scheduled")
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const nextAppt = upcoming[0] ?? null;

  const completed = appointments.filter((a) => a.status === "completed");

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingTop: topPad + 16, paddingBottom: insets.bottom + 80 }]}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.primary} />
        }
      >
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: colors.mutedForeground }]}>
              {getGreeting()},
            </Text>
            <Text style={[styles.name, { color: colors.foreground }]}>
              {getFirstName(user?.name ?? "Patient")}
            </Text>
          </View>
          <View style={[styles.avatarCircle, { backgroundColor: colors.primaryLight }]}>
            <Text style={[styles.avatarInitial, { color: colors.primary }]}>
              {(user?.name ?? "P")[0].toUpperCase()}
            </Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="calendar" size={20} color={colors.primary} />
            <Text style={[styles.statNum, { color: colors.foreground }]}>
              {upcoming.length}
            </Text>
            <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Upcoming</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="checkmark-circle" size={20} color={colors.success} />
            <Text style={[styles.statNum, { color: colors.foreground }]}>
              {completed.length}
            </Text>
            <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Completed</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="medical" size={20} color={colors.secondary} />
            <Text style={[styles.statNum, { color: colors.foreground }]}>
              {appointments.length}
            </Text>
            <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Total</Text>
          </View>
        </View>

        {nextAppt && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              Next Appointment
            </Text>
            <View
              style={[
                styles.nextCard,
                {
                  backgroundColor: colors.primary,
                  shadowColor: colors.primary,
                },
              ]}
            >
              <View style={styles.nextCardTop}>
                <View style={styles.nextDateBlock}>
                  <Ionicons name="calendar-outline" size={16} color="rgba(255,255,255,0.8)" />
                  <Text style={styles.nextDate}>
                    {new Date(nextAppt.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                  </Text>
                </View>
                <View style={styles.nextTimeBadge}>
                  <Text style={styles.nextTimeText}>
                    {(() => {
                      const [h, m] = (nextAppt.time ?? "").split(":").map(Number);
                      const ampm = h >= 12 ? "PM" : "AM";
                      return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${ampm}`;
                    })()}
                  </Text>
                </View>
              </View>
              {nextAppt.doctorName && (
                <View style={styles.nextDoctorRow}>
                  <Ionicons name="person-outline" size={14} color="rgba(255,255,255,0.75)" />
                  <Text style={styles.nextDoctor}>{nextAppt.doctorName}</Text>
                </View>
              )}
              {nextAppt.type && (
                <Text style={styles.nextType}>{nextAppt.type}</Text>
              )}
            </View>
          </View>
        )}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              Recent Appointments
            </Text>
            <Pressable onPress={() => router.push("/(tabs)/appointments")}>
              <Text style={[styles.seeAll, { color: colors.primary }]}>See all</Text>
            </Pressable>
          </View>

          {isLoading ? (
            <LoadingState message="Loading appointments..." />
          ) : isError ? (
            <ErrorState message="Could not load appointments." onRetry={refetch} />
          ) : appointments.length === 0 ? (
            <EmptyState
              icon="calendar-outline"
              title="No appointments yet"
              subtitle="Your upcoming appointments will appear here"
            />
          ) : (
            appointments.slice(0, 3).map((a) => (
              <AppointmentCard
                key={a.id}
                appointment={a}
                onPress={() => router.push("/(tabs)/appointments")}
              />
            ))
          )}
        </View>

        <View style={styles.quickActions}>
          <Text style={[styles.sectionTitle, { color: colors.foreground, marginBottom: 12 }]}>
            Quick Actions
          </Text>
          <View style={styles.actionsRow}>
            <Pressable
              style={[styles.actionBtn, { backgroundColor: colors.primaryLight }]}
              onPress={() => router.push("/(tabs)/appointments")}
            >
              <Ionicons name="calendar-outline" size={24} color={colors.primary} />
              <Text style={[styles.actionLabel, { color: colors.primary }]}>Appointments</Text>
            </Pressable>
            <Pressable
              style={[styles.actionBtn, { backgroundColor: colors.secondaryLight }]}
              onPress={() => router.push("/(tabs)/bills")}
            >
              <Ionicons name="receipt-outline" size={24} color={colors.secondary} />
              <Text style={[styles.actionLabel, { color: colors.secondary }]}>My Bills</Text>
            </Pressable>
            <Pressable
              style={[styles.actionBtn, { backgroundColor: colors.successLight }]}
              onPress={() => router.push("/(tabs)/profile")}
            >
              <Ionicons name="person-outline" size={24} color={colors.success} />
              <Text style={[styles.actionLabel, { color: colors.success }]}>Profile</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { paddingHorizontal: 20, gap: 20 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  greeting: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans_400Regular",
  },
  name: {
    fontSize: 26,
    fontFamily: "PlusJakartaSans_700Bold",
    letterSpacing: -0.5,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitial: {
    fontSize: 20,
    fontFamily: "PlusJakartaSans_700Bold",
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    alignItems: "center",
    gap: 6,
  },
  statNum: {
    fontSize: 22,
    fontFamily: "PlusJakartaSans_700Bold",
  },
  statLabel: {
    fontSize: 11,
    fontFamily: "PlusJakartaSans_400Regular",
    textAlign: "center",
  },
  section: { gap: 12 },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "PlusJakartaSans_700Bold",
  },
  seeAll: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans_500Medium",
  },
  nextCard: {
    borderRadius: 20,
    padding: 20,
    gap: 10,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 6,
  },
  nextCardTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  nextDateBlock: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flex: 1,
  },
  nextDate: {
    color: "#fff",
    fontSize: 15,
    fontFamily: "PlusJakartaSans_600SemiBold",
    flex: 1,
  },
  nextTimeBadge: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 100,
  },
  nextTimeText: {
    color: "#fff",
    fontSize: 13,
    fontFamily: "PlusJakartaSans_600SemiBold",
  },
  nextDoctorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  nextDoctor: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 13,
    fontFamily: "PlusJakartaSans_400Regular",
  },
  nextType: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 12,
    fontFamily: "PlusJakartaSans_400Regular",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  quickActions: { gap: 0 },
  actionsRow: {
    flexDirection: "row",
    gap: 10,
  },
  actionBtn: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    gap: 8,
  },
  actionLabel: {
    fontSize: 12,
    fontFamily: "PlusJakartaSans_500Medium",
    textAlign: "center",
  },
});
