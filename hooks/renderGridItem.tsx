import { ServiceProvider } from "@/tsx-types";
import { StyleSheet, View } from "react-native";
import { renderProviderCard } from "./renderProviderCard";

export const renderGridItem = ({
  item,
  index,
}: {
  item: ServiceProvider;
  index: number;
}) => {
  const isLeft = index % 2 === 0;
  return (
    <View
      style={[
        styles.gridItem,
        { marginRight: isLeft ? 6 : 0, marginLeft: isLeft ? 0 : 6 },
      ]}
    >
      {renderProviderCard(item)}
    </View>
  );
};

const styles = StyleSheet.create({
  gridItem: { flex: 1 },
});
