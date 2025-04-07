import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, FlatList, TouchableOpacity, useColorScheme } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { Switch } from 'react-native';

export default function App() {
  const sistema = useColorScheme();
  const [darkMode, setDarkMode] = useState(sistema === 'dark');
  const [novaTarefa, setNovaTarefa] = useState('');
  const [tarefas, setTarefas] = useState([]);

  useEffect(() => {
    carregarTarefas();
  }, []);

  useEffect(() => {
    salvarTarefas();
  }, [tarefas]);

  const salvarTarefas = async () => {
    await AsyncStorage.setItem('@tarefas', JSON.stringify(tarefas));
  };

  const carregarTarefas = async () => {
    const dados = await AsyncStorage.getItem('@tarefas');
    if (dados) setTarefas(JSON.parse(dados));
  };

  const adicionarTarefa = () => {
    if (novaTarefa.trim() === '') return;
    const nova = { id: Date.now().toString(), texto: novaTarefa, concluida: false };
    setTarefas([nova, ...tarefas]);
    setNovaTarefa('');
  };

  const alternarConclusao = (id) => {
    setTarefas(tarefas.map(tarefa => tarefa.id === id ? { ...tarefa, concluida: !tarefa.concluida } : tarefa));
  };

  const removerTarefa = (id) => {
    setTarefas(tarefas.filter(tarefa => tarefa.id !== id));
  };

  const tarefasFeitas = tarefas.filter(t => t.concluida).length;
  const progresso = tarefas.length > 0 ? Math.round((tarefasFeitas / tarefas.length) * 100) : 0;

  const tema = darkMode ? estilos.dark : estilos.light;

  return (
    <View style={[estilos.container, tema.container]}>
      <StatusBar style={darkMode ? 'light' : 'dark'} />

      <View style={estilos.header}>
        <Text style={[estilos.titulo, tema.titulo]}>ProductivApp</Text>
        <Switch
          value={darkMode}
          onValueChange={setDarkMode}
          thumbColor={darkMode ? '#222' : '#eee'}
          trackColor={{ false: '#999', true: '#44cc88' }}
        />
      </View>

      <Text style={[estilos.progresso, tema.progresso]}>
        Progresso: {progresso}%
      </Text>

      <TextInput
        style={[estilos.input, tema.input]}
        placeholder="Digite sua tarefa..."
        placeholderTextColor={darkMode ? '#aaa' : '#555'}
        value={novaTarefa}
        onChangeText={setNovaTarefa}
        onSubmitEditing={adicionarTarefa}
      />

      <FlatList
        style={estilos.lista}
        data={tarefas}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={[estilos.tarefa, tema.tarefa]}>
            <View style={estilos.detalheRoxo} />
            <TouchableOpacity onPress={() => alternarConclusao(item.id)}>
              <Ionicons
                name={item.concluida ? 'checkmark-circle' : 'ellipse-outline'}
                size={24}
                color={darkMode ? '#44cc88' : '#1a7f5a'}
              />
            </TouchableOpacity>
            <Text
              style={[
                estilos.textoTarefa,
                tema.textoTarefa,
                item.concluida && { textDecorationLine: 'line-through', opacity: 0.6 },
              ]}
            >
              {item.texto}
            </Text>
            <TouchableOpacity onPress={() => removerTarefa(item.id)}>
              <Ionicons name="trash" size={22} color="#e74c3c" />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
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
  progresso: {
    marginVertical: 10,
    fontSize: 16,
    fontWeight: '600',
  },
  input: {
    height: 45,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  lista: {
    marginTop: 10,
  },
  tarefa: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderRadius: 8,
    padding: 12,
    shadowColor: '#8000ff',
    shadowOpacity: 0.25,
    shadowOffset: { width: 2, height: 3 },
    shadowRadius: 4,
    elevation: 4,
  },
  detalheRoxo: {
    width: 4,
    height: '100%',
    backgroundColor: '#8000ff',
    marginRight: 10,
    borderRadius: 2,
  },
  textoTarefa: {
    flex: 1,
    fontSize: 16,
    marginHorizontal: 10,
  },
  light: {
    container: {
      backgroundColor: '#f2f2f2',
    },
    titulo: {
      color: '#222',
    },
    progresso: {
      color: '#333',
    },
    input: {
      backgroundColor: '#fff',
      color: '#000',
    },
    tarefa: {
      backgroundColor: '#fff',
    },
    textoTarefa: {
      color: '#222',
    },
  },
  dark: {
    container: {
      backgroundColor: '#1a1a1a',
    },
    titulo: {
      color: '#fff',
    },
    progresso: {
      color: '#ccc',
    },
    input: {
      backgroundColor: '#333',
      color: '#fff',
    },
    tarefa: {
      backgroundColor: '#222',
    },
    textoTarefa: {
      color: '#fff',
    },
  },
});
