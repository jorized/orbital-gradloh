import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Configure, InstantSearch } from 'react-instantsearch-core';
import { InfiniteHits } from '../../components/AlgoliaSearch/InfiniteHits';
import { Filters } from '../../components/AlgoliaSearch/Filters';
import { SearchBox } from '../../components/AlgoliaSearch/SearchBox';
import { Highlight } from '../../components/AlgoliaSearch/Highlight';
import algoliasearch from 'algoliasearch/lite';
import ThemeContext from '../../contexts/ThemeContext';
import Hit from '../../components/AlgoliaSearch/Hit';
import DrawerHeader from '../../components/Drawer/DrawerHeader';
import { HeaderBackButton } from '@react-navigation/elements';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Tooltip from 'react-native-walkthrough-tooltip';
import TutorialToolTip from '../../components/TutorialToolTip';

const searchClient = algoliasearch(process.env.EXPO_PUBLIC_ALGOLIA_APP_ID, process.env.EXPO_PUBLIC_ALGOLIA_SEARCH_API_KEY);

export default function ModulesScreen({ route, navigation }) {

  const { headerName, semIndex, folderName, currentModsInFolder } = route.params;

  const [showTooltip5, setShowTooltip5] = useState(false);

  const [isModalOpen, setModalOpen] = useState(false);
  
  const listRef = useRef(null);
  const theme = useContext(ThemeContext);

  function scrollToTop() {
    listRef.current?.scrollToOffset({ animated: false, offset: 0 });
  }

  useEffect(() => {
    if (route.params?.startTutorial) {
      setShowTooltip5(true);
    }
  }, [route.params])

  const handleCloseToolTipFive = () => {
    setShowTooltip5(false);
    navigation.navigate('ModuleDetailsScreen', { headerName: "Module details", moduleCode : "CS2040", startTutorial: true })
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={[styles.safe, { backgroundColor: theme.backgroundColor }]}>

			<Tooltip isVisible={showTooltip5} placement="bottom" onClose={() => {}}
				content = {
				<TutorialToolTip
					title="List of modules"
					text='In the modules screen, you can choose up to 9000+ modules, ranging from different faculties, to be added into your respective folders. The filter feature contains a range of options for you to filter the modules from, such as its grading basis description as well as the number of credits each module is worth. Take note that those modules which are already within your folders will be indicated with an "Added" text instead of the "+" icon.'
					buttonText="Next"
					onPress={handleCloseToolTipFive}
				/>
			}
            ></Tooltip>
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <View style={styles.headerFlexContainer}>
              <HeaderBackButton
                style={styles.headerbackBtnStyle}
                onPress={() => navigation.goBack()}
                tintColor={theme.hamburgerColor}
                labelVisible={false}
              />
              <Text style={[styles.titleText, { color: theme.hamburgerColor }]}>{headerName}</Text>
            </View>
          </View>

          <InstantSearch searchClient={searchClient} indexName="nus_mods_data" future={{ preserveSharedStateOnUnmount: true }}>
            <Configure highlightPreTag="<mark>" highlightPostTag="</mark>" />
            <View style={styles.searchContainer}>
              <SearchBox onChange={scrollToTop} />
              <Filters
                isModalOpen={isModalOpen}
                onToggleModal={() => setModalOpen(!isModalOpen)}
                onChange={scrollToTop}
              />
            </View>
            <InfiniteHits ref={listRef} hitComponent={Hit} folderName={folderName} semIndex={semIndex} />
          </InstantSearch>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
  },
  headerFlexContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 5,
  },
  headerbackBtnStyle: {
    marginLeft: 10,
  },
  titleText: {
    fontSize: 26,
    fontFamily: "Lexend_600SemiBold",
    marginLeft: 10,
  },
});
