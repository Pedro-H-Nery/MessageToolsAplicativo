import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  Menu: { usuario: any };
  Configuracoes: { usuario: any }; // Certifique-se de que este tipo está correto
};

type Tipo = {
  nome: string;
  tipoClassificacao: 'palavrasChave' | 'assuntos' | 'nenhuma';
  numeros: string[];
  valores: string[];
};

type ConfiguracoesScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Configuracoes'>;

export default function Configuracoes() {
  const route = useRoute<RouteProp<RootStackParamList, 'Configuracoes'>>();
  const navigation = useNavigation<ConfiguracoesScreenNavigationProp>();
  const { usuario } = route.params;
  const [tipos, setTipos] = useState<Tipo[]>([]);

  // Função que preenche os tipos com base nos dados do usuário
  useEffect(() => {
    if (usuario?.tipos) { // Garantindo que tipos esteja definido
      const tiposUsuario = Object.keys(usuario.tipos).map((nivel) => {
        const tipo = usuario.tipos[nivel];
        const numerosFormatados = tipo.numeros.map((numero: string) => {
          return numero.slice(0, 2) + numero.slice(2, 4) + numero.slice(4, 12);
        });
        return {
          nome: nivel,
          tipoClassificacao: tipo.tipoClassificacao === 0 ? 'palavrasChave' : (tipo.tipoClassificacao === 1 ? 'assuntos' : 'nenhuma') as 'palavrasChave' | 'assuntos' | 'nenhuma', // Garantir que seja do tipo literal correto
          numeros: numerosFormatados || [],
          valores: (tipo.tipoClassificacao === 2 ? [] : tipo[tipo.tipoClassificacao === 0 ? 'palavrasChave' : 'assuntos']) || [],
        };
      });
      setTipos(tiposUsuario); // Agora o tipo de 'tiposUsuario' corresponde ao tipo esperado
    }
  }, [usuario]);

  const atualizarTipo = (index: number, campo: keyof Tipo, valor: any) => {
    if(valor == 'nenhuma'){
      const novosTipos = [...tipos];
      novosTipos[index][campo] = valor;
      novosTipos[index].valores = []; // Limpa os valores
      setTipos(novosTipos);
    }else{
      const novosTipos = [...tipos];
      novosTipos[index][campo] = valor;
      setTipos(novosTipos);
    }
  };

  const adicionarTipo = () => {
    setTipos([
      ...tipos,
      {
        nome: '',
        tipoClassificacao: 'palavrasChave',
        numeros: [],
        valores: [],
      },
    ]);
  };

  const removerTipo = (index: number) => {
    if (tipos.length === 1) {
      Alert.alert('Aviso', 'É necessário ter pelo menos um tipo definido.');
      return;
    }
    const novosTipos = tipos.filter((_, i) => i !== index);
    setTipos(novosTipos);
  };

  const enviarDados = async () => {
    const payload = {
      idUsuario: usuario.idUsuario,
      tipos: tipos.reduce((acc: Record<string, any>, tipo) => {
        acc[tipo.nome] = {
          tipoClassificacao: tipo.tipoClassificacao === 'palavrasChave' ? 0 : (tipo.tipoClassificacao === 'assuntos' ? 1 : 2),
          [tipo.tipoClassificacao]: tipo.valores,
          numeros: tipo.numeros,
        };
        return acc;
      }, {}),
    };

    try {
      const response = await fetch('http://192.168.18.3:3000/api/configurarTipos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Sucesso', data.message);
        navigation.navigate('Menu', { usuario: data.usuario });
      } else {
        Alert.alert('Erro', data.message);
      }
    } catch (error) {
      Alert.alert('Erro', `Erro de conexão: ${error}`);
    }
  };

  const confirmarEnvio = () => {
    Alert.alert(
      'Confirmação',
      'Ao confirmar essa opção todas as informações de cada tipo serão redefinidas e os dados do histórico não poderão mais ser retornados para os tipos. É recomendado resolver todos os contatos dos tipos antes dessa ação. Você tem certeza que deseja continuar?',
      [
        {
          text: 'Não',
          style: 'cancel',
        },
        {
          text: 'Sim',
          onPress: enviarDados,
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Menu', { usuario })}>
          <Text style={styles.backText}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Configurar Tipos</Text>
        <View style={{ width: 50 }} />
      </View>

      {/* Tipos Section */}
      <View style={styles.tiposSection}>
        <Text style={styles.sectionTitle}>Tipos</Text>
        {tipos.map((tipo, index) => (
          <View key={index} style={styles.tipoContainer}>
            <TextInput
              style={styles.input}
              value={tipo.nome}
              onChangeText={(text) => atualizarTipo(index, 'nome', text)}
              placeholder="Nome do Tipo"
            />

            <Text style={styles.subLabel}>Números</Text>
            <TextInput
              style={styles.input}
              value={tipo.numeros.join(', ')}
              onChangeText={(text) =>
                atualizarTipo(index, 'numeros', text.split(',').map((n) => n.trim()))
              }
              placeholder="Digite os números com DDD separados por vírgula"
              keyboardType="phone-pad"
            />

            <Text style={styles.subLabel}>Forma de Classificação</Text>
            <View style={styles.radioContainer}>
              <TouchableOpacity
                onPress={() =>
                  atualizarTipo(index, 'tipoClassificacao', 'palavrasChave')
                }
                style={[
                  styles.radioButton,
                  tipo.tipoClassificacao === 'palavrasChave' && styles.radioSelected,
                ]}
              >
                <Text style={styles.radioLabel}>Palavras- Chave</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  atualizarTipo(index, 'tipoClassificacao', 'assuntos')
                }
                style={[
                  styles.radioButton,
                  tipo.tipoClassificacao === 'assuntos' && styles.radioSelected,
                ]}
              >
                <Text style={styles.radioLabel}>Assuntos</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  atualizarTipo(index, 'tipoClassificacao', 'nenhuma')
                }
                style={[
                  styles.radioButton,
                  tipo.tipoClassificacao === 'nenhuma' && styles.radioSelected,
                ]}
              >
                <Text style={styles.radioLabel}>Nenhuma</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.subLabel}>
            {tipo.tipoClassificacao === 'palavrasChave'
              ? 'Palavras-Chave'
              : tipo.tipoClassificacao === 'assuntos'
              ? 'Assuntos'
              : ''}
            </Text>
            <TextInput
              style={styles.input}
              value={tipo.valores.join(', ')}
              onChangeText={(text) =>
                atualizarTipo(index, 'valores', text.split(',').map((v) => v.trim()))
              }
              placeholder={
                tipo.tipoClassificacao === 'nenhuma' ? '' : `Digite ${tipo.tipoClassificacao} separados por vírgula`
              }
              editable={tipo.tipoClassificacao !== 'nenhuma'}
            />

            <Button
              title="Remover Tipo"
              color="red"
              onPress={() => removerTipo(index)}
            />
          </View>
        ))}

        <Button
          title="Adicionar Tipo"
          onPress={adicionarTipo}
          color="#007BFF"
        />
      </View>

      {/* Submit Button */}
      <View style={{ marginTop: 20 }}>
        <Button title="Enviar Configurações" onPress={confirmarEnvio} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backText: { fontSize: 16, color: '#007BFF' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', textAlign: 'center' },
  subLabel: { marginTop: 10, fontWeight: 'bold' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
  tiposSection: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#007BFF',
    backgroundColor: '#E6F7FF',
    borderRadius: 5,
    marginBottom: 20,
  },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  tipoContainer: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 10,
  },
  radioContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  radioButton: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  radioSelected: {
    borderColor: '#007BFF',
    backgroundColor: '#007BFF20',
  },
  radioLabel: { fontSize: 14 },
});
