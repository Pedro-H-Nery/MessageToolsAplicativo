import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  Login: undefined;
  Cadastro: undefined;
  Menu: { usuario: any };
  Nivel: { usuario: any; nivelSelecionado: string };
  Historico: { usuario: any };
};

type HistoricoScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Historico'>;

const Historico = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'Historico'>>();
  const navigation = useNavigation<HistoricoScreenNavigationProp>();
  const { usuario } = route.params;
  const [historico, setHistorico] = useState<any>(null);
  const [selectedNumber, setSelectedNumber] = useState<string | null>(null);
  const [valido, setValido] = useState<boolean>(true);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [messages, setMessages] = useState<string[] | null>(null);

  // Carrega o histórico do usuário
  useEffect(() => {
    fetch(`https://message-tools-backend.vercel.app/api/historicoUsuario`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idUsuario: usuario.idUsuario }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success && data.resposta) {
          setHistorico(data.resposta);
        } else {
          Alert.alert('Erro', 'Erro ao carregar o histórico.');
        }
      })
      .catch(() => {
        Alert.alert('Erro', 'Erro ao conectar com a API.');
      });
  }, [usuario.idUsuario]);

  // Função para lidar com o clique em um número
  const handleNumberClick = (number: string) => {
    setSelectedNumber(number);
    setSelectedDate(null); // Resetar a data selecionada
    setMessages(null); // Resetar mensagens
  };

  // Função para lidar com o clique em uma data
  const handleDateClick = (number: string, date: string) => {
    setSelectedDate(date);
    setMessages(historico[number][date].mensagens);
    if(historico[number][date].valido){
      setValido(true);
    }else{
      setValido(false);
    }
  };

  // Função para lidar com o botão "Voltar"
  const handleVoltar = (number: string, date: string) => {
    fetch('https://message-tools-backend.vercel.app/api/voltar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        idUsuario: usuario.idUsuario,
        numeroResolvido: number,
        resolvidoEm: date,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          Alert.alert('Sucesso', 'Conversa retornada com sucesso!');
          const updatedHistorico = { ...historico };
          delete updatedHistorico[number][date];
          if (Object.keys(updatedHistorico[number]).length === 0) {
            delete updatedHistorico[number];
          }
          setHistorico(updatedHistorico);
          setMessages(null);
        } else {
          Alert.alert('Erro', 'Erro ao tentar remover o registro.');
        }
      })
      .catch(() => {
        Alert.alert('Erro', 'Erro ao se comunicar com a API.');
      });
  };

  // Formata a data para exibição
  const formataData = (data: string) => {
    const dataFormatada = new Date(data);
    return dataFormatada.toLocaleString();
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Histórico</Text>
      {historico ? (
        Object.keys(historico).map((numero) => {
          const datas = Object.keys(historico[numero]);
          if (datas.length > 0) {
            const nomeRemetente = historico[numero][datas[0]].nomeRemetente;
            return (
              <View key={numero}>
                <TouchableOpacity
                  style={styles.item}
                  onPress={() => handleNumberClick(numero)}
                >
                  <Text style={styles.itemText}>{nomeRemetente}</Text>
                </TouchableOpacity>
                {selectedNumber === numero &&
                  datas.map((date) => (
                    <TouchableOpacity
                      key={date}
                      style={styles.dateItem}
                      onPress={() => handleDateClick(numero, date)}
                    >
                      <Text style={styles.dateText}>{formataData(date)}</Text>
                    </TouchableOpacity>
                  ))}
              </View>
            );
          }
          return null;
        })
      ) : (
        <Text style={styles.loadingText}>Carregando histórico...</Text>
      )}
      {selectedDate && messages && (
        <View>
          <Text style={styles.subtitle}>Mensagens</Text>
          {messages.map((message, index) => (
            <Text key={index} style={styles.messageText}>{message}</Text>
          ))}
          {valido ? (
            <View style={styles.button}>
              <Button
                title="Voltar"
                onPress={() => handleVoltar(selectedNumber!, selectedDate!)}
              />
            </View>
          ): (<View></View>)}
        </View>
      )}
      <View style={styles.button}>
        <Button title="Voltar ao Menu" onPress={() => navigation.goBack()} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  item: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#ddd' },
  itemText: { fontSize: 16, color: '#333' },
  dateItem: { padding: 16, paddingLeft: 30, borderBottomWidth: 1, borderBottomColor: '#ddd' },
  dateText: { fontSize: 14, color: '#555' },
  subtitle: { fontSize: 18, fontWeight: 'bold', marginTop: 20 },
  messageText: { fontSize: 16, marginLeft: 20 },
  button: { marginTop: 20 },
  loadingText: { textAlign: 'center', fontSize: 16, color: '#666' },
});

export default Historico;
