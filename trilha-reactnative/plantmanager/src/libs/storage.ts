import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns';

export type Plant = {
  id: string;
  name: string;
  about: string;
  water_tips: string;
  photo: string;
  environments: [string];
  frequency: {
    times: number;
    repeat_every: string;
  };
  dateTimeNotification: Date;
  hour: string;
};

export type StoragePlants = {
  [id: string]: {
    data: Plant;
  };
};

export async function savePlant(plant: Plant): Promise<void> {
  const oldPlants = await loadPlantsData();

  const newPlant = {
    [plant.id]: { data: plant },
  };

  await AsyncStorage.setItem(
    '@plantmanager:plants',
    JSON.stringify({ ...oldPlants, ...newPlant })
  );
}

export async function loadPlants(): Promise<Plant[]> {
  const plants = await loadPlantsData();

  const sortedPlants = Object.keys(plants)
    .map((key: string) => {
      return {
        ...plants[key].data,
        hour: format(new Date(plants[key].data.dateTimeNotification), 'HH:mm'),
      };
    })
    .sort(
      (a, b) =>
        new Date(a.dateTimeNotification).getTime() -
        new Date(b.dateTimeNotification).getTime()
    );
  return sortedPlants;
}

async function loadPlantsData(): Promise<StoragePlants> {
  const data = await AsyncStorage.getItem('@plantmanager:plants');
  const plants = data ? (JSON.parse(data) as StoragePlants) : {};
  return plants;
}
