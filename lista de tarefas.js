// App.js
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Switch,
  Keyboard,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';

export default function App() {
  const [novaTarefa, setNovaTarefa] = useState('');
  const [tarefas, setTarefas] = useState([]);
  const [modoEscuro, setModoEscuro] = useState(true);

  useEffect(() => {
    carregarTarefasSalvas();
    configurarNotificacoes();
  }, []);

  useEffect(() => {
    salvarTarefas();
  }, [tarefas]);

  async function configurarNotificacoes() {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão negada para notificações.');
    }
  }

  async function salvarTarefas() {
    await AsyncStorage.setItem('@productivapp_tarefas', JSON.stringify(tarefas));
  }

  async function carregarTarefasSalvas() {
    const data = await AsyncStorage.getItem('@productivapp_tarefas');
    if (data) {
      setTarefas(JSON.parse(data));
    }
  }

  function adicionarTarefa() {
    if (novaTarefa.trim() === '') return;

    const nova = {
      id: Date.now().toString(),
      texto: novaTarefa,
      feita: false,
    };

    setTarefas([...tarefas, nova]);
    setNovaTarefa('');
    Keyboard.dismiss();
  }

  function alternarConclusao(id) {
    const atualizadas = tarefas.map(tarefa =>
      tarefa.id === id ? { ...tarefa, feita: !tarefa.feita } : tarefa
    );
    setTarefas(atualizadas);
  }

  function excluirTarefa(id) {
    setTarefas(tarefas.filter(tarefa => tarefa.id !== id));
  }

  const tarefasFeitas = tarefas.filter(t => t.feita).length;
  const totalTarefas = tarefas.length;
  const porcentagem = totalTarefas === 0 ? 0 : Math.round((tarefasFeitas / totalTarefas) * 100);

  const tema = modoEscuro ? temas.dark : temas.light;

  return (
    <View style={[styles.container, { backgroundColor: tema.fundo }]}>
      <View style={styles.header}>
        <Text style={[styles.titulo, { color: tema.texto }]}>ProductivApp</Text>
        <Switch
          value={modoEscuro}
          onValueChange={setModoEscuro}
          trackColor={{ false: '#ccc', true: '#0f0' }}
          thumbColor={modoEscuro ? '#0f0' : '#fff'}
        />
      </View>

      <Text style={[styles.porcentagem, { color: tema.texto }]}>
        {porcentagem}% concluído
      </Text>

      <View style={styles.inputArea}>
        <TextInput
          style={[styles.input, { backgroundColor: tema.input, color: tema.texto }]}
          placeholder="Nova tarefa"
          placeholderTextColor={modoEscuro ? '#aaa' : '#555'}
          value={novaTarefa}
          onChangeText={setNovaTarefa}
        />
        <TouchableOpacity onPress={adicionarTarefa}>
          <Ionicons name="add-circle" size={40} color="#0f0" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={tarefas}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={[styles.item, {
            backgroundColor: tema.cartao,
            shadowColor: modoEscuro ? '#a020f0' : '#888',
          }]}>
            <Text style={[styles.itemTexto, {
              textDecorationLine: item.feita ? 'line-through' : 'none',
              color: tema.texto
            }]}>
              {item.texto}
            </Text>
            <View style={styles.icones}>
              <TouchableOpacity onPress={() => alternarConclusao(item.id)}>
                <Ionicons
                  name={item.feita ? 'checkmark-circle' : 'ellipse-outline'}
                  size={24}
                  color="#0f0"
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => excluirTarefa(item.id)} style={{ marginLeft: 10 }}>
                <Ionicons name="trash" size={24} color="#f55" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const temas = {
  dark: {
    fundo: '#121212',
    texto: '#e0ffe0',
    input: '#1f1f1f',
    cartao: '#202020',
  },
  light: {
    fundo: '#f0f0f0',
    texto: '#222',
    input: '#fff',
    cartao: '#fff',
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
  },
  porcentagem: {
    marginVertical: 10,
    fontSize: 16,
  },
  inputArea: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 10,
  },
  input: {
    flex: 1,
    height: 45,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 5,
  },
  itemTexto: {
    fontSize: 16,
  },
  icones: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
