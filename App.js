import React, { useState, useEffect, useRef } from 'react';
import WebView from 'react-native-webview';
import { PermissionsAndroid, RefreshControl, Dimensions, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';

const wait = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

const App = () => {
  const cameraPermission = async () => {
      let granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: "Camera Permission",
          message:
            "App needs access to your camera " +
            "so others can see you.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("You can use the camera");
      } else {
        console.log("Camera permission denied");
      }
  }

  const micPermission = async () => {
    let granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      {
        title: "Audio Permission",
        message:
          "App needs access to your audio / microphone",
        buttonNeutral: "Ask Me Later",
        buttonNegative: "Cancel",
        buttonPositive: "OK"
      }
    );
    
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log("You can use the Microphone");
    } else {
      console.log("Microphone permission denied");
    } 
  }

  useEffect(() => {
    cameraPermission();
    micPermission();
  }, []);
  const [height, setHeight] = useState(Dimensions.get('screen').height);
  const [refreshing, setRefreshing] = React.useState(false);
  const [webUrl, setWebUrl] = useState('https://www.myspinout.com/');
  const webRef = useRef(null);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => {
      webRef.current.reload();
      setRefreshing(false);
    });
  }, []);
  const [isEnabled, setEnabled] = useState(typeof onRefresh === 'function');
  const [loading, setLoading] = useState(false);
  const onNavigationStateChange = (webViewState) => {
    setLoading(webViewState.loading);
    setWebUrl(webViewState.url);
  }
  return (
    <ScrollView
      onLayout={(e) => setHeight(e.nativeEvent.layout.height)}
      style={styles.view}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          enabled={isEnabled}
        />
      }
    >
      <WebView 
        source={{uri: webUrl}}
        ref={webRef}
        allowsInlineMediaPlayback={true}
        originWhitelist={['*']}
        onError={(e) => console.log('error: ', e)}
        bounces={true}
        scalesPageToFit
        mediaPlaybackRequiresUserAction={false}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        style={[styles.view, { height }]}
        injectedJavaScriptBeforeContentLoaded="window.isRNWebView=true"
        onNavigationStateChange={onNavigationStateChange}
        onScroll={(e) =>
          setEnabled(
            typeof onRefresh === 'function' &&
              e.nativeEvent.contentOffset.y === 0
          )
        }
      />
      {loading && (
       <ActivityIndicator
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            jusityContent: "space-around",
            flexWrap: "wrap",
            alignContent: "center",
          }}
       size="large"
     />
      )}
    </ScrollView>
  )
};

const styles = StyleSheet.create({
  view: { flex: 1, height: '100%' }
});

export default App;
