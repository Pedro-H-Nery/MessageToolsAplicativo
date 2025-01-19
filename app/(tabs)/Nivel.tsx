import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, FlatList, Alert, TouchableOpacity, Linking } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  Login: undefined;
  Cadastro: undefined;
  Menu: { usuario: any };
  Nivel: { usuario: any; nivelSelecionado: string };
};

type NivelData = {
  nome: string;
  numero: string;
  mensagens: string;
};

type NivelScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Nivel'>;

const Nivel = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'Nivel'>>();
  const navigation = useNavigation<NivelScreenNavigationProp>();

  const { usuario, nivelSelecionado } = route.params;
  const [data, setData] = useState<NivelData[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);

  // Chama a API para carregar as mensagens e números do nível
  useEffect(() => {
    let isMounted = true;
    const fetchNivelData = async () => {
      try {
        const response = await fetch('https://message-tools-backend.vercel.app/api/nivel', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            idUsuario: usuario.idUsuario,
            nomeNivel: nivelSelecionado,
          }),
        });

        const responseData = await response.json();

        if (isMounted && response.ok) {
          const nivelData = responseData.resposta;
          const formattedData = nivelData.numeros.map((numero: string) => ({
            nome: nivelData.mensagens[numero]?.nome || '',
            numero: numero,
            mensagens: nivelData.mensagens[numero]?.mensagens.join("\n") || "Sem mensagens",
          })).filter((item: NivelData) => item.nome !== '');
          setData(formattedData);
        } else {
          Alert.alert("Erro", "Falha ao carregar os dados do nível.");
        }
      } catch (error) {
        Alert.alert("Erro", "Erro ao tentar carregar os dados.");
      }
    };

    // Faz a chamada inicial
    fetchNivelData();

    // Chama a API a cada 1 segundo
    const intervalId = setInterval(fetchNivelData, 5000);

    // Limpeza do intervalo quando o componente for desmontado
    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [usuario.idUsuario, nivelSelecionado]);

  const handleToggleExpand = (numero: string) => {
    setExpanded((prevExpanded) => (prevExpanded === numero ? null : numero));
  };

  const handleConversar = (numero: string) => {
    Alert.alert(
      "Confirmar Redirecionamento",
      "Você deseja conversar com este número no WhatsApp?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Sim",
          onPress: () => {
            const url = `https://api.whatsapp.com/send?phone=${numero}`;
            Linking.openURL(url);  // Abre o WhatsApp
          },
        },
      ]
    );
  };

  const handleResolver = async (nivel: string, numero: string) => {
    try {
      const response = await fetch('https://message-tools-backend.vercel.app/api/resolver', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idUsuario: usuario.idUsuario,
          nomeNivel: nivel,
          resolverNumero: numero,
        }),
      });

      const resposta = await response.json();

      if (response.ok) {
        Alert.alert("Sucesso", resposta.message);

        // Remover a célula da lista caso a resposta seja positiva
        setData((prevData) => prevData.filter((item) => item.numero !== numero));
      } else {
        Alert.alert("Erro", resposta.message);
      }
    } catch (error) {
      Alert.alert("Erro", "Erro ao tentar resolver.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{nivelSelecionado}</Text>

      {/* Tabela com as colunas Nome, Número e Opções */}
      <FlatList
        data={data}
        keyExtractor={(item) => item.numero}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <TouchableOpacity onPress={() => handleToggleExpand(item.numero)} disabled={!item.nome}>
              <Text style={[styles.cell, !item.nome && styles.disabledCell]}>{item.nome || "Sem Dados"}</Text>
            </TouchableOpacity>

            {/* Se a célula está expandida, mostramos os botões e as mensagens */}
            {expanded === item.numero && (
              <>
                <View style={styles.buttonContainer}>
                  <Button title="Conversar" onPress={() => handleConversar(item.numero)} />
                  <Button title="Resolver" onPress={() => handleResolver(nivelSelecionado, item.numero)} />
                </View>
                <Text style={styles.messages}>{item.mensagens}</Text>
              </>
            )}
          </View>
        )}
      />

      {/* Botão para voltar para o menu */}
      <Button title="Voltar para Menu" onPress={() => navigation.navigate('Menu', { usuario })} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  row: {
    marginBottom: 10,
  },
  cell: {
    fontSize: 18,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  disabledCell: {
    backgroundColor: '#d3d3d3',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'space-between',
  },
  messages: {
    marginTop: 10,
    fontSize: 14,
    color: '#555',
  },
});

export default Nivel;
