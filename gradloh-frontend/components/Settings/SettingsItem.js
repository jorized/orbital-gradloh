import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Collapsible from "react-native-collapsible";

export default function SettingsItem ({ title, children })  {
    const [collapsed, setCollapsed] = useState(true);
  
    return (
        <View>
        <TouchableOpacity style={styles.itemHeader} onPress={() => setCollapsed(!collapsed)}>
          <Text style={styles.itemTitle}>{title}</Text>
          <MaterialIcons name={collapsed ? "keyboard-arrow-down" : "keyboard-arrow-up"}size={24} color="black" />
        </TouchableOpacity>
        <Collapsible collapsed={collapsed}>
          <View style={styles.itemContent}>{children}</View>
        </Collapsible>
      </View>
    );
};

const styles = StyleSheet.create({
    itemHeader: {
        backgroundColor: '#FFFFFF',
        padding: 15,
        borderBottomWidth: 1,
        borderColor: '#DDDDDD',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      },
      itemTitle: {
        fontSize: 18,
        fontWeight: '500',
      },
      itemContent: {
        padding: 15,
        backgroundColor: '#F0F0F0',
      },
  });