import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { WifiOff, Wifi } from 'lucide-react-native';
import { useNetworkStatus } from '../hooks/useNetworkStatus';

export default function NetworkStatus({ children }) {
  const { hasInternet } = useNetworkStatus();
  const [showOfflineBanner, setShowOfflineBanner] = useState(false);
  const [wasOffline, setWasOffline] = useState(false);
  const bannerOpacity = useState(new Animated.Value(0))[0];

  useEffect(() => {
    if (!hasInternet) {
      setShowOfflineBanner(true);
      setWasOffline(true);
      Animated.timing(bannerOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else if (wasOffline && hasInternet) {
      // Show reconnected banner briefly
      Animated.timing(bannerOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setTimeout(() => {
          setShowOfflineBanner(false);
          setWasOffline(false);
        }, 2000);
      });
    }
  }, [hasInternet, wasOffline]);

  if (!hasInternet) {
    return (
      <View style={styles.container}>
        <View style={styles.offlineContainer}>
          <WifiOff size={48} color="#ef4444" />
          <Text style={styles.offlineTitle}>No Internet Connection</Text>
          <Text style={styles.offlineText}>
            Please check your internet connection and try again.
          </Text>
<Text style={styles.offlineText}>
  No network detected. Make sure Wi-Fi or mobile data is turned on.
</Text>
<Text style={styles.offlineText}>
you can stil listen downloaded songs. we'll Retry once you’re back online.
</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {children}
      {showOfflineBanner && (
        <Animated.View 
          style={[
            styles.banner, 
            { 
              opacity: bannerOpacity,
              backgroundColor: hasInternet ? '#10b981' : '#ef4444'
            }
          ]}
        >
          <View style={styles.bannerContent}>
            {hasInternet ? (
              <Wifi size={20} color="#ffffff" />
            ) : (
              <WifiOff size={20} color="#ffffff" />
            )}
            <Text accessibilityLiveRegion="assertive" style={styles.bannerText}>
              {hasInternet ? 'Back online' : 'No internet connection'}
            </Text>
          </View>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  offlineContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  offlineTitle: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
    textAlign: 'center',
  },
  offlineText: {
    color: '#64748b',
    fontSize: 16,
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 24,
  },
  banner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingVertical: 12,
    paddingHorizontal: 16,
    zIndex: 1000,
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  bannerText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});