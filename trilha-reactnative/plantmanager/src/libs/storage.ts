import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns';
import * as Notifications from 'expo-notifications';

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
    notificationId: string;
  };
};

export async function savePlant(plant: Plant): Promise<void> {
  const oldPlants = await loadPlantsData();

  const nextTime = new Date(plant.dateTimeNotification);

  const now = new Date();

  const { times, repeat_every } = plant.frequency;

  if (repeat_every === 'week') {
    const interval = Math.trunc(7 / times);
    nextTime.setDate(now.getDate() + interval);
  } else {
    nextTime.setDate(nextTime.getDate() + 1);
  }

  const seconds = Math.abs(
    Math.ceil(now.getTime() - nextTime.getTime()) / 1000
  );
  console.log('Seconds: ', seconds);

  const notificationId = await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Heeeeey 🌱',
      body: `Está na hora de cuidar da sua ${plant.name}`,
      sound: true,
      priority: Notifications.AndroidNotificationPriority.HIGH,
      data: {
        plant,
        url: 'plantmanager://myplants',
      },
    },
    trigger: {
      seconds: seconds < 60 ? 60 : seconds,
      repeats: true,
    },
  });

  const newPlant = {
    [plant.id]: { data: plant, notificationId },
  };

  await AsyncStorage.setItem(
    '@plantmanager:plants',
    JSON.stringify({ ...oldPlants, ...newPlant })
  );
}

export async function removePlant(plantId: string | number): Promise<void> {
  const oldPlants = await loadPlantsData();

  console.log('notificationId: ', oldPlants[plantId].notificationId);

  await Notifications.cancelScheduledNotificationAsync(
    oldPlants[plantId].notificationId
  );

  delete oldPlants[plantId];

  await AsyncStorage.setItem('@plantmanager:plants', JSON.stringify(oldPlants));
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
