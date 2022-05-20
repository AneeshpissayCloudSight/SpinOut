import React, { useState, useEffect, useRef } from 'react';
import WebView from 'react-native-webview';
import { RefreshControl, Dimensions, StyleSheet, ScrollView, ActivityIndicator, Platform } from 'react-native';
import { PERMISSIONS, request } from 'react-native-permissions';

const wait = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

const App = () => {
  const cameraPermission = async () => {
      if(Platform.OS === 'android') {
        let result = await request(PERMISSIONS.ANDROID.CAMERA);
        if(result === 'granted') {
          console.log("Granted");
        }
        else if(result === 'denied') {
          console.log("Denied");
        }
      }
      if(Platform.OS == 'ios') {
        let result = await request(PERMISSIONS.IOS.CAMERA);
        if(result === 'granted') {
          console.log("Granted");
        }
        else if(result === 'denied') {
          console.log("Denied");
        }
      }
  }

  const micPermission = async () => {
    if(Platform.OS === 'android') {
      let result = await request(PERMISSIONS.ANDROID.RECORD_AUDIO);
      if(result === 'granted') {
        console.log("Granted");
      }
      else if(result === 'denied') {
        console.log("Denied");
      }
    }
    if(Platform.OS == 'ios') {
      let result = await request(PERMISSIONS.IOS.MICROPHONE);
      if(result === 'granted') {
        console.log("Granted");
      }
      else if(result === 'denied') {
        console.log("Denied");
      }
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
