import { useNavigation } from '@react-navigation/core';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EnvironmentButton } from '../components/EnvironmentButton';
import { Header } from '../components/Header';
import { Load } from '../components/Load';
import { PlantCardPrimary } from '../components/PlantCardPrimary';
import { Plant } from '../libs/storage';
import api from '../services/api';
import colors from '../styles/colors';
import fonts from '../styles/fonts';

type Environment = {
  key: string;
  title: string;
};

export function PlantSelect() {
  const [environments, setEnvironments] = useState<Environment[]>([]);
  const [plants, setPlants] = useState<Plant[]>([]);
  const [environmentSelected, setEnvironmentSelected] = useState<string>('all');
  const [filteredPlants, setFilteredPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(0);
  const [loadingMore, setLoadingMore] = useState(false);

  const navigation = useNavigation();

  if (loading && plants.length > 0 && environments.length > 0) {
    setLoading(false);
  }

  useEffect(() => {
    (async () => {
      const { data } = await api.get('/plants_environments', {
        params: { _sort: 'title', _order: 'asc' },
      });
      setEnvironments([
        {
          key: 'all',
          title: 'Todos',
        },
        ...data,
      ]);
    })();
  }, []);

  async function fetchPlants() {
    const { data } = await api.get('/plants', {
      params: { _sort: 'name', _order: 'asc', _page: page, _limit: 8 },
    });

    setLoadingMore(false);

    if (!data) {
      return;
    }

    setPlants([...plants, ...data]);
  }

  useEffect(() => {
    setPage(1);
  }, []);

  useEffect(() => {
    (async () => {
      await fetchPlants();
    })();
  }, [page]);

  useEffect(() => {
    handleEnvironmentSelected(environmentSelected);
  }, [plants]);

  function handleEnvironmentSelected(environment: string) {
    setEnvironmentSelected(environment);

    if (environment === 'all') {
      return setFilteredPlants(plants);
    }

    const filtered = plants.filter((plant) =>
      plant.environments.includes(environment)
    );

    setFilteredPlants(filtered);
  }

  function handleFetchMore(distanceFromEnd: number) {
    if (!loadingMore && distanceFromEnd > 1) {
      setLoadingMore(true);
      setPage(page + 1);
    }
  }

  function handlePlantSelect(plant: Plant) {
    navigation.navigate('PlantSave', { plant });
  }

  return loading ? (
    <Load />
  ) : (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Header />
        <Text style={styles.title}>Em qual ambiente</Text>
        <Text style={styles.subtitle}>você quer colocar sua planta?</Text>
      </View>
      <View>
        <FlatList
          data={environments}
          keyExtractor={(item) => item.key}
          renderItem={({ item }) => (
            <EnvironmentButton
              active={item.key === environmentSelected}
              title={item.title}
              onPress={() => {
                handleEnvironmentSelected(item.key);
              }}
            />
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.environmentList}
        />
      </View>
      <View style={styles.plantList}>
        <FlatList
          data={filteredPlants}
          renderItem={({ item }) => (
            <PlantCardPrimary
              onPress={() => {
                handlePlantSelect(item);
              }}
              data={item}
            />
          )}
          keyExtractor={(item) => String(item.id)}
          showsVerticalScrollIndicator={false}
          numColumns={2}
          onEndReachedThreshold={0.1}
          onEndReached={({ distanceFromEnd }) => {
            handleFetchMore(distanceFromEnd);
          }}
          ListFooterComponent={
            loadingMore ? <ActivityIndicator color={colors.green} /> : <></>
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 50,
  },
  header: {
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 17,
    color: colors.heading,
    fontFamily: fonts.heading,
    lineHeight: 20,
    marginTop: 15,
  },
  subtitle: {
    fontFamily: fonts.text,
    fontSize: 17,
    lineHeight: 20,
    color: colors.heading,
  },
  environmentList: {
    height: 40,
    justifyContent: 'center',
    paddingBottom: 5,
    marginLeft: 32,
    marginVertical: 32,
    paddingRight: 32,
  },
  plantList: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: 'center',
  },
});
