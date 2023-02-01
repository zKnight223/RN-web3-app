import {StyleSheet, View, Platform} from 'react-native';
import WalletConnectProvider from '@walletconnect/react-native-dapp';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {AlertNotificationRoot} from 'react-native-alert-notification';
import Layout from './src';

export default function App() {
  return (
    <SafeAreaProvider>
      <AlertNotificationRoot>
        <WalletConnectProvider
          redirectUrl={
            Platform.OS === 'web'
              ? window.location.origin
              : 'exp://192.168.108.247:19000'
          }
          storageOptions={{
            asyncStorage: AsyncStorage,
          }}>
          <View style={styles.container}>
            <Layout />
          </View>
        </WalletConnectProvider>
      </AlertNotificationRoot>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'left',
  },
});
