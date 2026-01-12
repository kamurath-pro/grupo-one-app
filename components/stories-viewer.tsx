import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  Pressable,
  Dimensions,
  Animated,
  PanResponder,
  StatusBar,
  Platform,
} from "react-native";
import { Image } from "expo-image";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Post } from "@/lib/data-context";
import { ProfilePhoto } from "./profile-photo";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const STORY_DURATION = 5000; // 5 segundos por story

interface StoriesViewerProps {
  visible: boolean;
  posts: Post[];
  unidadeName: string;
  onClose: () => void;
}

export function StoriesViewer({ visible, posts, unidadeName, onClose }: StoriesViewerProps) {
  const insets = useSafeAreaInsets();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const progressAnimations = useRef<Animated.Value[]>([]);
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);
  const currentIndexRef = useRef(0);
  const progressStartValue = useRef(0); // Valor inicial da animação ao pausar
  const pressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isPressingRef = useRef(false);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  const goToNext = () => {
    if (currentIndexRef.current < posts.length - 1) {
      setCurrentIndex(currentIndexRef.current + 1);
      currentIndexRef.current += 1;
    } else {
      // Último story - fechar
      onClose();
    }
  };

  const goToPrevious = () => {
    if (currentIndexRef.current > 0) {
      setCurrentIndex(currentIndexRef.current - 1);
      currentIndexRef.current -= 1;
    }
  };

  // Sincronizar ref com state
  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  // Função para pausar com salvamento do progresso
  const pauseStory = () => {
    if (isPaused) return;
    
    setIsPaused(true);
    
    // Parar animação e salvar valor atual
    if (animationRef.current) {
      animationRef.current.stop();
      animationRef.current = null;
    }
    
    const currentAnim = progressAnimations.current[currentIndex];
    if (currentAnim) {
      currentAnim.stopAnimation((value) => {
        progressStartValue.current = value;
      });
    }
  };

  // Função para retomar a partir do progresso salvo
  const resumeStory = () => {
    if (!isPaused) return;
    
    const currentAnim = progressAnimations.current[currentIndex];
    if (!currentAnim) {
      setIsPaused(false);
      return;
    }

    // Obter valor atual
    currentAnim.stopAnimation((currentValue) => {
      if (currentValue >= 1) {
        setIsPaused(false);
        goToNext();
        return;
      }

      // Calcular duração restante baseada no progresso atual
      const remainingProgress = 1 - currentValue;
      const remainingDuration = STORY_DURATION * remainingProgress;

      // Retomar animação do ponto salvo
      const animation = Animated.timing(currentAnim, {
        toValue: 1,
        duration: remainingDuration,
        useNativeDriver: false,
      });

      animationRef.current = animation;

      setIsPaused(false);

      animation.start(({ finished }) => {
        if (finished) {
          goToNext();
        }
      });
    });
  };

  // PanResponder para swipe down (fechar)
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false, // Não capturar no início
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        // Apenas capturar se for movimento vertical significativo
        return Math.abs(gestureState.dy) > 10 && Math.abs(gestureState.dy) > Math.abs(gestureState.dx);
      },
      onPanResponderGrant: (evt) => {
        touchStartX.current = evt.nativeEvent.pageX;
        touchStartY.current = evt.nativeEvent.pageY;
      },
      onPanResponderMove: (evt, gestureState) => {
        // Se swipe down significativo, fechar
        if (gestureState.dy > 100) {
          onClose();
        }
      },
      onPanResponderRelease: () => {
        // Não fazer nada no release do swipe
      },
    })
  ).current;

  // Handlers de toque
  const handlePressIn = () => {
    isPressingRef.current = true;
    // Delay para diferenciar toque curto de press and hold
    pressTimerRef.current = setTimeout(() => {
      if (isPressingRef.current) {
        pauseStory();
      }
    }, 200); // 200ms para detectar press and hold
  };

  const handlePressOut = () => {
    const wasPaused = isPaused;
    isPressingRef.current = false;
    
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
    }
    
    // Se estava pausado (press and hold), retomar ao soltar
    if (wasPaused) {
      resumeStory();
    }
  };

  const handleTap = (event: any) => {
    // Só processar toque curto se não estava pausado
    // Se estava pausado, handlePressOut já cuida do resume
    if (!isPaused && !isPressingRef.current) {
      const { locationX } = event.nativeEvent;
      const screenMiddle = SCREEN_WIDTH / 2;

      if (locationX < screenMiddle) {
        // Toque na esquerda - voltar
        goToPrevious();
      } else {
        // Toque na direita - avançar
        goToNext();
      }
    }
  };

  // Inicializar animações de progresso
  useEffect(() => {
    progressAnimations.current = posts.map(() => new Animated.Value(0));
  }, [posts.length]);

  // Resetar índice quando posts mudam
  useEffect(() => {
    if (posts.length > 0 && currentIndex >= posts.length) {
      setCurrentIndex(0);
      currentIndexRef.current = 0;
    }
  }, [posts.length, currentIndex]);

  // Limpar ao fechar
  useEffect(() => {
    if (!visible) {
      setCurrentIndex(0);
      setIsPaused(false);
      currentIndexRef.current = 0;
      isPressingRef.current = false;
      progressStartValue.current = 0;
      
      if (pressTimerRef.current) {
        clearTimeout(pressTimerRef.current);
        pressTimerRef.current = null;
      }
      
      if (animationRef.current) {
        animationRef.current.stop();
        animationRef.current = null;
      }
      
      progressAnimations.current.forEach((anim) => anim.setValue(0));
    }
  }, [visible]);

  // Animação de progresso do story atual
  useEffect(() => {
    if (!visible || posts.length === 0) {
      return;
    }

    // Se estiver pausado, não iniciar animação
    if (isPaused) {
      return;
    }

    // Parar animação anterior
    if (animationRef.current) {
      animationRef.current.stop();
    }

    const currentAnim = progressAnimations.current[currentIndex];
    if (!currentAnim) return;

    // Resetar animação quando trocar de story
    currentAnim.setValue(0);
    progressStartValue.current = 0;

    // Iniciar animação
    const animation = Animated.timing(currentAnim, {
      toValue: 1,
      duration: STORY_DURATION,
      useNativeDriver: false,
    });

    animationRef.current = animation;

    animation.start(({ finished }) => {
      if (finished && !isPaused) {
        goToNext();
      }
    });

    return () => {
      animation.stop();
    };
  }, [currentIndex, visible, posts.length]);

  // A lógica de retomada é feita pela função resumeStory
  // Este useEffect apenas garante que quando trocamos de story, iniciamos a animação

  const formatTime = (date: Date | string) => {
    const dateObj = date instanceof Date ? date : new Date(date);
    return dateObj.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!visible || posts.length === 0) {
    return null;
  }

  // Validação de segurança
  if (currentIndex < 0 || currentIndex >= posts.length) {
    if (posts.length > 0) {
      setCurrentIndex(0);
    }
    return null;
  }

  const currentPost = posts[currentIndex];
  
  if (!currentPost) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={false}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <View style={[styles.container, { paddingTop: insets.top }]}>
        {/* Barra de progresso no topo */}
        <View style={styles.progressBarContainer}>
          {posts.map((_, index) => {
            const progress = progressAnimations.current[index] || new Animated.Value(0);
            const isActive = index === currentIndex;
            const isPast = index < currentIndex;

            return (
              <View key={index} style={styles.progressBarWrapper}>
                <View style={styles.progressBarBackground} />
                {isActive && (
                  <Animated.View
                    style={[
                      styles.progressBarFill,
                      {
                        width: progress.interpolate({
                          inputRange: [0, 1],
                          outputRange: ["0%", "100%"],
                        }),
                      },
                    ]}
                  />
                )}
                {isPast && <View style={[styles.progressBarFill, { width: "100%" }]} />}
              </View>
            );
          })}
        </View>

        {/* Header com nome da unidade e fechar */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.unidadeName}>{unidadeName}</Text>
            <Text style={styles.storyCount}>
              {currentIndex + 1} / {posts.length}
            </Text>
          </View>
          <Pressable onPress={onClose} style={styles.closeButton}>
            <MaterialIcons name="close" size={24} color="#FFFFFF" />
          </Pressable>
        </View>

        {/* Conteúdo do Story */}
        <View
          style={styles.contentArea}
          {...panResponder.panHandlers}
        >
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={handleTap}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            delayLongPress={200}
          >
          <View style={styles.storyContent}>
            {/* Imagem (se houver) */}
            {currentPost.imageUrl && (
              <Image
                source={{ uri: currentPost.imageUrl }}
                style={styles.storyImage}
                contentFit="contain"
              />
            )}

            {/* Texto do story */}
            {currentPost.content && (
              <View style={styles.textContainer}>
                <Text style={styles.storyText}>{currentPost.content}</Text>
              </View>
            )}

            {/* Footer com autor e data */}
            <View style={styles.footer}>
              <View style={styles.footerLeft}>
                <ProfilePhoto
                  uri={currentPost.authorAvatar}
                  name={currentPost.authorName}
                  size={32}
                />
                <View style={styles.footerText}>
                  <Text style={styles.authorName}>{currentPost.authorName}</Text>
                  <Text style={styles.storyDate}>{formatTime(currentPost.createdAt)}</Text>
                </View>
              </View>
            </View>
          </View>
          </Pressable>
        </View>

        {/* Indicador de pausa */}
        {isPaused && (
          <View style={styles.pauseIndicator}>
            <MaterialIcons name="pause" size={48} color="#FFFFFF" />
          </View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  progressBarContainer: {
    flexDirection: "row",
    paddingHorizontal: 8,
    paddingTop: 8,
    gap: 4,
  },
  progressBarWrapper: {
    flex: 1,
    height: 3,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressBarBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerLeft: {
    flex: 1,
  },
  unidadeName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  storyCount: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.7)",
    marginTop: 2,
  },
  closeButton: {
    padding: 4,
  },
  contentArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  storyContent: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  storyImage: {
    width: "100%",
    flex: 1,
    maxHeight: SCREEN_HEIGHT * 0.6,
    borderRadius: 8,
  },
  textContainer: {
    width: "100%",
    marginTop: 20,
    paddingHorizontal: 20,
  },
  storyText: {
    fontSize: 18,
    color: "#FFFFFF",
    lineHeight: 26,
    textAlign: "center",
  },
  footer: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
  },
  footerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  footerText: {
    marginLeft: 12,
  },
  authorName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  storyDate: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.7)",
    marginTop: 2,
  },
  pauseIndicator: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -24 }, { translateY: -24 }],
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 24,
    padding: 8,
  },
});
