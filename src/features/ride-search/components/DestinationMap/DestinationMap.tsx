import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import MapView, { type Region } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { isGoogleMapsBypassed, MapBypassSurface } from '@/shared/maps';
import { colors, spacing } from '@/shared/theme';
import { styles } from './DestinationMap.styles';
import type { DestinationMapProps } from './DestinationMap.types';

const MIN_LATITUDE_DELTA = 0.002;
const MAX_LATITUDE_DELTA = 1.2;
const ZOOM_FACTOR = 0.55;
const isAndroid = Platform.OS === 'android';

export const DestinationMap = ({
  region,
  boundary: _boundary,
  controlsBottomInset = 0,
  onRegionChangeComplete,
  onUserGesture,
  onLocatePress,
}: DestinationMapProps) => {
  const mapRef = useRef<MapView>(null);
  const lastProgrammaticRegion = useRef(region);
  const regionLiveRef = useRef(region);
  regionLiveRef.current = region;
  const [heading, setHeading] = useState(0);
  const compassRotation = useSharedValue(0);
  const bypassMaps = isGoogleMapsBypassed();

  const syncHeading = useCallback(async () => {
    if (bypassMaps) {
      return;
    }
    try {
      const camera = await mapRef.current?.getCamera();
      const nextHeading = camera?.heading ?? 0;
      setHeading(nextHeading);
      compassRotation.value = withTiming(-nextHeading, { duration: 120 });
    } catch {
      // Camera may be unavailable during early layout.
    }
  }, [bypassMaps, compassRotation]);

  const emitRegion = useCallback(
    (next: {
      latitude: number;
      longitude: number;
      latitudeDelta: number;
      longitudeDelta: number;
    }) => {
      lastProgrammaticRegion.current = next;
      regionLiveRef.current = next;
      onRegionChangeComplete(next);
    },
    [onRegionChangeComplete],
  );

  useEffect(() => {
    const changed =
      Math.abs(lastProgrammaticRegion.current.latitude - region.latitude) > 0.0001 ||
      Math.abs(lastProgrammaticRegion.current.longitude - region.longitude) > 0.0001 ||
      Math.abs(lastProgrammaticRegion.current.latitudeDelta - region.latitudeDelta) > 0.0001 ||
      Math.abs(lastProgrammaticRegion.current.longitudeDelta - region.longitudeDelta) > 0.0001;

    if (!changed) {
      return;
    }

    lastProgrammaticRegion.current = region;
    regionLiveRef.current = region;
    if (!bypassMaps) {
      mapRef.current?.animateToRegion(region, 400);
      void syncHeading();
    }
  }, [bypassMaps, region, syncHeading]);

  const resetCompass = useCallback(() => {
    if (bypassMaps) {
      setHeading(0);
      compassRotation.value = withTiming(0, { duration: 300 });
      return;
    }
    void (async () => {
      const camera = await mapRef.current?.getCamera();
      mapRef.current?.animateCamera(
        {
          center: camera?.center ?? {
            latitude: regionLiveRef.current.latitude,
            longitude: regionLiveRef.current.longitude,
          },
          heading: 0,
          pitch: 0,
          zoom: camera?.zoom,
          altitude: camera?.altitude,
        },
        { duration: 300 },
      );
      setHeading(0);
      compassRotation.value = withTiming(0, { duration: 300 });
    })();
  }, [bypassMaps, compassRotation]);

  const zoomBy = useCallback(
    (direction: 'in' | 'out') => {
      const current = regionLiveRef.current;
      const factor = direction === 'in' ? ZOOM_FACTOR : 1 / ZOOM_FACTOR;
      const nextLatitudeDelta = Math.min(
        MAX_LATITUDE_DELTA,
        Math.max(MIN_LATITUDE_DELTA, current.latitudeDelta * factor),
      );
      const aspect =
        current.latitudeDelta > 0 ? current.longitudeDelta / current.latitudeDelta : 1;
      const next = {
        latitude: current.latitude,
        longitude: current.longitude,
        latitudeDelta: nextLatitudeDelta,
        longitudeDelta: nextLatitudeDelta * aspect,
      };

      if (!bypassMaps) {
        mapRef.current?.animateToRegion(next, 220);
      }
      onUserGesture?.();
      emitRegion(next);
    },
    [bypassMaps, emitRegion, onUserGesture],
  );

  const compassIconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${compassRotation.value}deg` }],
  }));

  const isRotated = Math.abs(heading) > 2 && Math.abs(heading - 360) > 2;

  return (
    <View style={localStyles.fill}>
      {bypassMaps ? (
        <MapBypassSurface
          style={styles.map}
          title="Select location"
          subtitle="Search a place or use locate — Google Maps bypassed"
          points={[
            {
              latitude: region.latitude,
              longitude: region.longitude,
              label: 'Pin',
            },
          ]}
        />
      ) : (
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={region}
          onPanDrag={() => {
            onUserGesture?.();
          }}
          onRegionChangeComplete={(next: Region) => {
            const mapped = {
              latitude: next.latitude,
              longitude: next.longitude,
              latitudeDelta: next.latitudeDelta,
              longitudeDelta: next.longitudeDelta,
            };
            regionLiveRef.current = mapped;
            onRegionChangeComplete(mapped);
            void syncHeading();
          }}
          showsUserLocation
          showsMyLocationButton={false}
          showsCompass
          {...(isAndroid
            ? {
                compassOffset: { x: -12, y: 72 },
                zoomControlEnabled: false,
                minZoomLevel: 3,
                maxZoomLevel: 20,
              }
            : {})}
          toolbarEnabled={false}
          rotateEnabled
          pitchEnabled
          scrollEnabled
          zoomEnabled
        />
      )}

      <View style={styles.centerPinWrap}>
        <View style={styles.pin} />
      </View>

      <View
        style={[
          styles.zoomControls,
          controlsBottomInset > 0 && {
            bottom: spacing.lg + 48 + spacing.sm + 48 + spacing.md + controlsBottomInset,
          },
        ]}
      >
        <Pressable
          style={styles.zoomButton}
          onPress={() => zoomBy('in')}
          accessibilityRole="button"
          accessibilityLabel="Zoom in"
          android_ripple={{ color: 'rgba(29, 78, 216, 0.12)' }}
        >
          <Ionicons name="add" size={22} color={colors.primary} />
        </Pressable>
        <View style={styles.zoomDivider} />
        <Pressable
          style={styles.zoomButton}
          onPress={() => zoomBy('out')}
          accessibilityRole="button"
          accessibilityLabel="Zoom out"
          android_ripple={{ color: 'rgba(29, 78, 216, 0.12)' }}
        >
          <Ionicons name="remove" size={22} color={colors.primary} />
        </Pressable>
      </View>

      <View
        style={[styles.mapControls, controlsBottomInset > 0 && { bottom: spacing.lg + controlsBottomInset }]}
      >
        <Pressable
          style={[styles.controlButton, isRotated && styles.controlButtonActive]}
          onPress={resetCompass}
          accessibilityRole="button"
          accessibilityLabel="Reset map to north"
          android_ripple={{ color: 'rgba(29, 78, 216, 0.12)', borderless: true }}
        >
          <Animated.View style={compassIconStyle}>
            <Ionicons name="compass" size={24} color={colors.primary} />
          </Animated.View>
        </Pressable>

        <Pressable
          style={styles.controlButton}
          onPress={onLocatePress}
          accessibilityRole="button"
          accessibilityLabel="Go to my location"
          android_ripple={{ color: 'rgba(29, 78, 216, 0.12)', borderless: true }}
        >
          <Ionicons name="locate" size={22} color={colors.primary} />
        </Pressable>
      </View>
    </View>
  );
};

const localStyles = StyleSheet.create({
  fill: {
    flex: 1,
  },
});
