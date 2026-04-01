import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Platform,
  RefreshControl,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";
import { BillCard, Invoice } from "@/components/BillCard";
import { LoadingState, ErrorState, EmptyState } from "@/components/LoadingState";

interface BillingResponse {
  invoices?: Invoice[];
  data?: Invoice[];
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(amount);
}

export default function BillsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  const patientId = user?.patientId;

  const { data, isLoading, isError, refetch, isRefetching } =
    useQuery<BillingResponse>({
      queryKey: [
        patientId
          ? `/api/billing/invoices?patientId=${patientId}`
          : "/api/billing/invoices",
      ],
      enabled: true,
    });

  const invoices: Invoice[] = (data?.invoices ?? data?.data ?? []) as Invoice[];

  const totalBalance = invoices.reduce((s, i) => s + (i.balance ?? 0), 0);
  const totalPaid = invoices.reduce((s, i) => s + (i.amountPaid ?? 0), 0);
  const totalAmount = invoices.reduce((s, i) => s + (i.total ?? 0), 0);

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
          Bills
        </Text>

        {!isLoading && !isError && invoices.length > 0 && (
          <View
            style={[
              styles.summaryCard,
              {
                backgroundColor: totalBalance > 0 ? colors.primary : colors.success,
                shadowColor: totalBalance > 0 ? colors.primary : colors.success,
              },
            ]}
          >
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Total Billed</Text>
                <Text style={styles.summaryValue}>{formatCurrency(totalAmount)}</Text>
              </View>
              <View style={[styles.summaryDivider]} />
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Paid</Text>
                <Text style={styles.summaryValue}>{formatCurrency(totalPaid)}</Text>
              </View>
              <View style={[styles.summaryDivider]} />
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Balance</Text>
                <Text style={[styles.summaryValue, styles.balanceVal]}>
                  {formatCurrency(totalBalance)}
                </Text>
              </View>
            </View>
            {totalBalance === 0 && (
              <View style={styles.allPaidRow}>
                <Ionicons name="checkmark-circle" size={16} color="rgba(255,255,255,0.9)" />
                <Text style={styles.allPaidText}>All paid up</Text>
              </View>
            )}
          </View>
        )}
      </View>

      {isLoading ? (
        <LoadingState message="Loading your bills..." />
      ) : isError ? (
        <ErrorState message="Could not load bills." onRetry={refetch} />
      ) : (
        <FlatList
          data={invoices}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => <BillCard invoice={item} />}
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
          scrollEnabled={invoices.length > 0}
          ListEmptyComponent={
            <EmptyState
              icon="receipt-outline"
              title="No invoices yet"
              subtitle="Your billing history will appear here once the clinic generates invoices for your visits"
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
  summaryCard: {
    borderRadius: 20,
    padding: 20,
    gap: 12,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 6,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  summaryItem: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  summaryDivider: {
    width: 1,
    height: 36,
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  summaryLabel: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 11,
    fontFamily: "PlusJakartaSans_400Regular",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  summaryValue: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "PlusJakartaSans_700Bold",
  },
  balanceVal: {
    fontSize: 18,
  },
  allPaidRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    justifyContent: "center",
  },
  allPaidText: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 13,
    fontFamily: "PlusJakartaSans_500Medium",
  },
  list: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
});
