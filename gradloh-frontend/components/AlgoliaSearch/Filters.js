import React, { useContext, useState } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  Modal,
  Text,
  View,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import Collapsible from 'react-native-collapsible';
import {
  useClearRefinements,
  useCurrentRefinements,
  useRefinementList,
} from 'react-instantsearch-core';
import ThemeContext from '../../contexts/ThemeContext';

export function Filters({ isModalOpen, onToggleModal, onChange }) {
  const { items: facultyItems, refine: refineFaculty } = useRefinementList({ attribute: 'faculty', limit: 20000 });
  const { items: departmentItems, refine: refineDepartment } = useRefinementList({ attribute: 'department', limit: 20000 });
  const { items: levelItems, refine: refineLevel } = useRefinementList({ attribute: 'level', limit: 20000 });
  const { items: unitsItems, refine: refineUnits } = useRefinementList({ attribute: 'units', limit: 20000 });
  const { items: gradingBasisDescItems, refine: refineGradingBasisDesc } = useRefinementList({ attribute: 'gradingBasisDescription', limit: 20000 });

  const { canRefine: canClear, refine: clear } = useClearRefinements();
  const { items: currentRefinements } = useCurrentRefinements();
  const totalRefinements = currentRefinements.reduce(
    (acc, { refinements }) => acc + refinements.length,
    0
  );

  const [isFacultyCollapsed, setFacultyCollapsed] = useState(true);
  const [isDepartmentCollapsed, setDepartmentCollapsed] = useState(true);
  const [isLevelCollapsed, setLevelCollapsed] = useState(true);
  const [isUnitsCollapsed, setUnitsCollapsed] = useState(true);
  const [isGradingBasisDescCollapsed, setGradingBasisDescCollapsed] = useState(true);

  const theme = useContext(ThemeContext);

  const renderFilterSection = (title, items, refine, isCollapsed, setCollapsed) => (
    <View style={[styles.container]}>
      <TouchableOpacity
        style={styles.accordionHeader}
        onPress={() => setCollapsed(!isCollapsed)}
      >
        <Text style={[styles.accordionHeaderText, {color : theme.color}]}>{title}</Text>
        <AntDesign
          name={isCollapsed ? "down" : "up"}
          size={16}
          color={theme.hamburgerColor}
        />
      </TouchableOpacity>
      <Collapsible collapsed={isCollapsed}>
        <View style={styles.list}>
          {items.map((item) => (
            <TouchableOpacity
              key={item.value}
              onPress={() => {
                refine(item.value);
                onChange();
              }}
              style={styles.item}
            >
              <Text
                style={{
                  ...styles.labelText,
                  fontWeight: item.isRefined ? '800' : '400',
                  color: theme.color
                }}
              >
                {item.label}
              </Text>
              <View style={[styles.itemCount, {backgroundColor: theme.hamburgerColor}]}>
                <Text style={[styles.itemCountText, {color: theme.reverseColor}]}>{item.count}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </Collapsible>
    </View>
  );

  return (
    <>
      <TouchableOpacity style={styles.filtersButton} onPress={onToggleModal}>
        <AntDesign name="filter" size={28} color={theme.hamburgerColor} />
        <Text style={[styles.filtersButtonText, {color: theme.hamburgerColor}]}>Filter</Text>
        {totalRefinements > 0 && (
          <View style={styles.itemCount}>
            <Text style={styles.itemCountText}>{totalRefinements}</Text>
          </View>
        )}
      </TouchableOpacity>

      <Modal animationType="slide" visible={isModalOpen}>
        <SafeAreaView style={[styles.safeArea, {backgroundColor : theme.backgroundColor}]}>
          <View style={styles.topButtonsContainer}>
            <TouchableOpacity onPress={onToggleModal} style={styles.topButton}>
              <Text style={[styles.topButtonText, {color : theme.hamburgerColor}]}>Close</Text>
            </TouchableOpacity>
            <Text style={[styles.modalTitle, {color : theme.color}]}>Filter</Text>
            <TouchableOpacity
              onPress={() => {
                clear();
                onChange();
              }}
              disabled={!canClear}
              style={styles.topButton}
            >
              <Text style={[styles.topButtonText, {color : theme.hamburgerColor}, !canClear && styles.disabledButton]}>Clear all</Text>
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            {renderFilterSection('Faculties', facultyItems, refineFaculty, isFacultyCollapsed, setFacultyCollapsed)}
            {renderFilterSection('Departments', departmentItems, refineDepartment, isDepartmentCollapsed, setDepartmentCollapsed)}
            {renderFilterSection('Levels', levelItems, refineLevel, isLevelCollapsed, setLevelCollapsed)}
            {renderFilterSection('Units', unitsItems, refineUnits, isUnitsCollapsed, setUnitsCollapsed)}
            {renderFilterSection('Grading Basis', gradingBasisDescItems, refineGradingBasisDesc, isGradingBasisDescCollapsed, setGradingBasisDescCollapsed)}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  topButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  topButton: {
    padding: 10,
  },
  topButtonText: {
    fontSize: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  disabledButton: {
    color: '#aaa',
  },
  scrollViewContent: {
    paddingBottom: 80, // Ensure enough space at the bottom
  },
  container: {
    padding: 18,
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  accordionHeaderText: {
    fontSize: 18,
  },
  list: {
    marginTop: 8,
  },
  item: {
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  itemCount: {
    borderRadius: 12,
    paddingVertical: 2,
    paddingHorizontal: 6,
    marginLeft: 4,
    marginBottom: 10
  },
  itemCountText: {
    fontSize: 12,
  },
  labelText: {
    fontSize: 16,
  },
  filterListButtonContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff', // Ensure background color to overlap content
    paddingVertical: 10, // Adjust as needed
    paddingHorizontal: 18, // Ensure padding matches the rest of the container
  },
  filterListButton: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 10, // Adjust as needed
  },
  filtersButton: {
    paddingVertical: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filtersButtonText: {
    fontSize: 14,
    textAlign: 'center',
    marginLeft: 8,
  },
});

export default Filters;
