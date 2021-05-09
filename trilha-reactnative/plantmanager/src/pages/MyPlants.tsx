import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Image, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '../components/Header';
import colors from '../styles/colors';

import waterdropImg from '../assets/waterdrop.png';
import { loadPlants, Plant, removePlant } from '../libs/storage';
import { formatDistance } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import fonts from '../styles/fonts';
import { PlantCardSecondary } from '../components/PlantCardSecondary';
import { Load } from '../components/Load';

export function MyPlants() {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);
  const [nextWatered, setNextWatered] = useState<string>();

  useEffect(() => {
    (async () => {
      const storagePlants = await loadPlants();
      setPlants(storagePlants);

      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (plants.length) {
      const nextTime = formatDistance(
        new Date(plants[0].dateTimeNotification).getTime(),
        new Date().getTime(),
        { locale: ptBR }
      );

      setNextWatered(`Regue sua ${plants[0].name} daqui a ${nextTime}.`);
    } else {
      setNextWatered('Nenhuma planta cadastrada.');
    }
  }, [plants]);

  async function handleRemovePlant(plant: Plant) {
    try {
      Alert.alert(
        'Remover planta',
        `Tem certeza que deseja remover ${plant.name}?`,
        [
          {
            text: 'Sim 🥲',
            onPress: async () => {
              await removePlant(plant.id);
              setPlants(plants.filter((p) => p.id !== plant.id));
            },
          },
          {
            text: 'Não 🙏',
            style: 'cancel',
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        'Remover planta',
        'Erro ao remover a sua planta 😥, tente novamente.'
      );
    }
  }

  return loading ? (
    <Load />
  ) : (
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
              handleRemove={() => {
                handleRemovePlant(item);
              }}
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
    paddingLeft: 24,
    width: 150,
    textAlign: 'left',
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
