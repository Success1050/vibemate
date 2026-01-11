import { theme } from "@/src/constants/themes";
import { hp } from "@/src/helpers/command";
import { Dimensions, StyleSheet } from "react-native";
const { width } = Dimensions.get("window");
const cardWidth = (width - 30) / 2; // 2 cards per row with margins
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E1BEE7",
  },
  viewCont: { flex: 1, padding: 12 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: hp(2),
    color: theme.colors.activetabbarcolor,
    fontWeight: "bold",
  },
  scrollContent: {
    padding: 10,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  userCard: {
    width: cardWidth,
    height: 250,
    marginBottom: 10,
    borderRadius: 15,
    overflow: "hidden",
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 15,
  },
  overlayContainer: {
    flex: 1,
    justifyContent: "space-between",
    padding: 10,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    position: "absolute",
    top: 10,
    left: 10,
    borderWidth: 2,
    borderColor: "white",
  },
  rechargeBadge: {
    position: "absolute",
    top: 60,
    left: 10,
    backgroundColor: "#FF6B35",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  giftIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  rechargeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  bottomInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: "auto",
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  userRate: {
    color: "white",
    fontSize: 14,
    marginTop: 2,
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  actionButtons: {
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
  },
  chatButton: {
    backgroundColor: "rgba(135, 206, 250, 0.9)",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  videoButton: {
    backgroundColor: "rgba(255, 107, 107, 0.9)",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  goldContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.activetabbarcolor,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  goldIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  goldAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginRight: 4,
  },
  plusSign: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  chatDots: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  videoIcon: {
    fontSize: 16,
  },
});
