import React, { useState } from 'react';
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

type Tipo = {
  nome: string;
  tipoClassificacao: 'palavrasChave' | 'assuntos' | 'nenhuma';
  numeros: string[];
  valores: string[];
};

export default function Cadastro({ navigation }: { navigation: any }) {
  const [email, setEmail] = useState<string>('');
  const [senha, setSenha] = useState<string>('');
  const [numero, setNumero] = useState<string>('');
  const [tipos, setTipos] = useState<Tipo[]>([
    {
      nome: '',
      tipoClassificacao: 'palavrasChave',
      numeros: [],
      valores: [],
    },
  ]);

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
    // if (tipos.length >= 3) {
    //   Alert.alert('Aviso', 'Você pode definir no máximo 3 tipos.');
    //   return;
    // }
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
      email,
      senha,
      numero,
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
      const response = await fetch('http://192.168.18.3:3000/api/cadastro', {
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

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.backText}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cadastro</Text>
        <View style={{ width: 50 }} />
      </View>

      {/* Form */}
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Digite o email"
        keyboardType="email-address"
      />

      <Text style={styles.label}>Senha</Text>
      <TextInput
        style={styles.input}
        value={senha}
        onChangeText={setSenha}
        placeholder="Digite a senha"
        secureTextEntry
      />

      <Text style={styles.label}>Número de Telefone</Text>
      <TextInput
        style={styles.input}
        value={numero}
        onChangeText={setNumero}
        placeholder="Digite o número de telefone"
        keyboardType="phone-pad"
      />

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
                atualizarTipo(
                  index,
                  'numeros',
                  text.split(',').map((n) => n.trim()),
                )
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
                  tipo.tipoClassificacao === 'palavrasChave' &&
                    styles.radioSelected,
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
                onPress={() => atualizarTipo(index, 'tipoClassificacao', 'nenhuma')}
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
                atualizarTipo(
                  index,
                  'valores',
                  text.split(',').map((v) => v.trim()),
                )
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
        <Button title="Cadastrar" onPress={enviarDados} />
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
  label: { fontWeight: 'bold', marginBottom: 10 },
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
