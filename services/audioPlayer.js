import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { storageService } from './storage';

class AudioPlayerService {
  constructor() {
    this.sound = null;
    this.currentSong = null;
    this.isPlaying = false;
    this.position = 0;
    this.duration = 0;
    this.volume = 1.0;
    this.playbackSpeed = 1.0;
    this.listeners = [];
    this.queue = [];
    this.currentIndex = 0;
    this.repeat = 'none'; // 'none', 'one', 'all'
    this.shuffle = false;
    
    this.initializeAudio();
  }

  async initializeAudio() {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });
    } catch (error) {
      console.error('Error initializing audio:', error);
    }
  }

  addListener(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notifyListeners() {
    this.listeners.forEach(listener => {
      listener({
        currentSong: this.currentSong,
        isPlaying: this.isPlaying,
        position: this.position,
        duration: this.duration,
        volume: this.volume,
        playbackSpeed: this.playbackSpeed,
        queue: this.queue,
        currentIndex: this.currentIndex,
        repeat: this.repeat,
        shuffle: this.shuffle
      });
    });
  }

  async loadSong(song, autoPlay = true) {
    try {
      if (this.sound) {
        await this.sound.unloadAsync();
      }

      this.currentSong = song;
      
      // Check if song is downloaded
      const downloadedSongs = await storageService.getDownloadedSongs();
      const downloadedSong = downloadedSongs.find(s => s.id === song.id);
      
      let uri;
      if (downloadedSong && downloadedSong.localUri) {
        uri = downloadedSong.localUri;
      } else {
        // Get the highest quality download URL
        const downloadUrls = song.downloadUrl || [];
        const highQualityUrl = downloadUrls.find(u => u.quality === '320kbps') || 
                              downloadUrls.find(u => u.quality === '160kbps') || 
                              downloadUrls[0];
        uri = highQualityUrl?.url;
      }

      if (!uri) {
        throw new Error('No playable URL found for song');
      }

      const { sound } = await Audio.Sound.createAsync(
        { uri },
        { 
          shouldPlay: autoPlay,
          rate: this.playbackSpeed,
          volume: this.volume
        },
        this.onPlaybackStatusUpdate.bind(this)
      );

      this.sound = sound;
      this.isPlaying = autoPlay;

      // Add to recently played and playback history
      await storageService.addToRecentlyPlayed(song);
      await storageService.addToPlaybackHistory(song);

      this.notifyListeners();
      return true;
    } catch (error) {
      console.error('Error loading song:', error);
      return false;
    }
  }

  onPlaybackStatusUpdate(status) {
    if (status.isLoaded) {
      this.position = status.positionMillis || 0;
      this.duration = status.durationMillis || 0;
      this.isPlaying = status.isPlaying;

      if (status.didJustFinish) {
        this.handleSongEnd();
      }

      this.notifyListeners();
    }
  }

  async handleSongEnd() {
    if (this.repeat === 'one') {
      await this.seekTo(0);
      await this.play();
    } else {
      await this.playNext();
    }
  }

  async play() {
    if (this.sound) {
      await this.sound.playAsync();
      this.isPlaying = true;
      this.notifyListeners();
    }
  }

  async pause() {
    if (this.sound) {
      await this.sound.pauseAsync();
      this.isPlaying = false;
      this.notifyListeners();
    }
  }

  async togglePlayPause() {
    if (this.isPlaying) {
      await this.pause();
    } else {
      await this.play();
    }
  }

  async seekTo(position) {
    if (this.sound) {
      await this.sound.setPositionAsync(position);
      this.position = position;
      this.notifyListeners();
    }
  }

  async setVolume(volume) {
    if (this.sound) {
      await this.sound.setVolumeAsync(volume);
      this.volume = volume;
      this.notifyListeners();
    }
  }

  async setPlaybackSpeed(speed) {
    if (this.sound) {
      await this.sound.setRateAsync(speed, true);
      this.playbackSpeed = speed;
      this.notifyListeners();
    }
  }

  async rewind(seconds = 10) {
    const newPosition = Math.max(0, this.position - (seconds * 1000));
    await this.seekTo(newPosition);
  }

  async fastForward(seconds = 30) {
    const newPosition = Math.min(this.duration, this.position + (seconds * 1000));
    await this.seekTo(newPosition);
  }

  setQueue(songs, startIndex = 0) {
    this.queue = songs;
    this.currentIndex = startIndex;
    this.notifyListeners();
  }

  async playNext() {
    if (this.queue.length === 0) return;

    let nextIndex;
    if (this.shuffle) {
      nextIndex = Math.floor(Math.random() * this.queue.length);
    } else {
      nextIndex = this.currentIndex + 1;
      if (nextIndex >= this.queue.length) {
        if (this.repeat === 'all') {
          nextIndex = 0;
        } else {
          return;
        }
      }
    }

    this.currentIndex = nextIndex;
    await this.loadSong(this.queue[nextIndex]);
  }

  async playPrevious() {
    if (this.queue.length === 0) return;

    let prevIndex;
    if (this.shuffle) {
      prevIndex = Math.floor(Math.random() * this.queue.length);
    } else {
      prevIndex = this.currentIndex - 1;
      if (prevIndex < 0) {
        if (this.repeat === 'all') {
          prevIndex = this.queue.length - 1;
        } else {
          return;
        }
      }
    }

    this.currentIndex = prevIndex;
    await this.loadSong(this.queue[prevIndex]);
  }

  setRepeat(mode) {
    this.repeat = mode;
    this.notifyListeners();
  }

  setShuffle(enabled) {
    this.shuffle = enabled;
    this.notifyListeners();
  }

  async downloadSong(song, onProgress) {
    try {
      const downloadUrls = song.downloadUrl || [];
      const settings = await storageService.getSettings();
      
      let targetUrl;
      if (settings.downloadQuality === 'high') {
        targetUrl = downloadUrls.find(u => u.quality === '320kbps')?.url;
      } else if (settings.downloadQuality === 'medium') {
        targetUrl = downloadUrls.find(u => u.quality === '160kbps')?.url;
      }
      
      if (!targetUrl) {
        targetUrl = downloadUrls[0]?.url;
      }

      if (!targetUrl) {
        throw new Error('No download URL available');
      }

      const filename = `${song.id}.mp3`;
      const localUri = FileSystem.documentDirectory + filename;

      const download = FileSystem.createDownloadResumable(
        targetUrl,
        localUri,
        {},
        (downloadProgress) => {
          const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
          if (onProgress) {
            onProgress(progress);
          }
        }
      );

      const result = await download.downloadAsync();
      if (result) {
        await storageService.addDownloadedSong(song, result.uri);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error downloading song:', error);
      return false;
    }
  }

  formatTime(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  async stop() {
    if (this.sound) {
      await this.sound.unloadAsync();
      this.sound = null;
    }
    this.currentSong = null;
    this.isPlaying = false;
    this.position = 0;
    this.duration = 0;
    this.notifyListeners();
  }
}

export const audioPlayer = new AudioPlayerService();