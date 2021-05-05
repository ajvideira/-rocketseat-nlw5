import React, { useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '../components/Header';
import colors from '../styles/colors';

import waterdropImg from '../assets/waterdrop.png';
import { loadPlants, Plant } from '../libs/storage';
import { formatDistance } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import fonts from '../styles/fonts';
import { PlantCardSecondary } from '../components/PlantCardSecondary';

export function MyPlants() {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);
  const [nextWatered, setNextWatered] = useState<string>();

  useEffect(() => {
    (async () => {
      const storagePlants = await loadPlants();
      setPlants(storagePlants);

      if (storagePlants) {
        const nextTime = formatDistance(
          new Date(storagePlants[0].dateTimeNotification).getTime(),
          new Date().getTime(),
          { locale: ptBR }
        );

        setNextWatered(`Regue sua ${storagePlants[0].name} 
        daqui a ${nextTime}.`);
      }
      setLoading(false);
    })();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Header />

      <View style={styles.spotlight}>
        <Image source={waterdropImg} style={styles.spotlightImage} />
        <Text style={styles.spotlightText}>{nextWatered}</Text>
      </View>

      <View style={styles.plants}>
        <Text style={styles.plantsTitle}>Próximas regadas</Text>

        <FlatList
          data={plants}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <PlantCardSecondary
              data={{ name: item.name, photo: item.photo, hour: item.hour }}
            />
          )}
          showsVerticalScrollIndicator={false}
          //contentContainerStyle={{ flex: 1 }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    paddingTop: 50,
    backgroundColor: colors.background,
  },
  spotlight: {
    backgroundColor: colors.blue_light,
    paddingHorizontal: 16,
    borderRadius: 20,
    height: 88,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: 311,
  },
  spotlightImage: {
    width: 60,
    height: 60,
  },
  spotlightText: {
    flex: 1,
    color: colors.blue,
    paddingHorizontal: 24,
  },
  plants: {
    flex: 1,
    width: '100%',
  },
  plantsTitle: {
    fontSize: 24,
    fontFamily: fonts.heading,
    color: colors.heading,
    marginTop: 40,
    marginBottom: 11,
  },
});
