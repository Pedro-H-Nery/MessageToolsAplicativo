import React from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  ScrollView,
  Linking,
  TouchableOpacity,
  Clipboard
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  Login: undefined;
  Cadastro: undefined;
  Menu: { usuario: any };
  Nivel: { usuario: any; nivelSelecionado: string };
  Historico: { usuario: any }; // Adiciona a tela de Historico ao tipo
  Configuracoes: { usuario: any }; // Adiciona a tela de Configuracoes ao tipo
};

type MenuScreenRouteProp = RouteProp<RootStackParamList, 'Menu'>;
type MenuScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Menu'>;

const Menu = ({ route }: { route: MenuScreenRouteProp }) => {
  const navigation = useNavigation<MenuScreenNavigationProp>();
  const { usuario } = route.params;

  const niveis = Object.keys(usuario.tipos);

  // Função para navegar até a tela de Nível com a chave do nível selecionado
  const navigateToNivel = (nivel: string) => {
    navigation.navigate('Nivel', { usuario, nivelSelecionado: nivel });
  };

  // Função para navegar até a tela de Histórico
  const navigateToHistorico = () => {
    navigation.navigate('Historico', { usuario });
  };

  // Função para navegar até a tela de Configurações
  const navigateToConfiguracoes = () => {
    navigation.navigate('Configuracoes', { usuario });
  };

  // URL para conectar o WhatsApp
  const conectarWhatsAppUrl = `https://message-tools-backend.vercel.app`;

  const copyToClipboard = () => {
    Clipboard.setString(conectarWhatsAppUrl);
    alert('Link copiado para a área de transferência!');
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Menu</Text>

      {/* Verificar se o usuário está conectado */}
      {!usuario.conectado ? (
        <View style={styles.alertContainer}>
          <Text style={styles.alertText}>
            Você ainda não conectou seu WhatsApp. Entre no link a seguir pelo computador, faça o login com suas informações cadastradas e siga
            os passos para conectar seu WhatsApp ao aplicativo.
          </Text>
          <TouchableOpacity
            onPress={() => Linking.openURL(conectarWhatsAppUrl)}
          >
            <Text style={styles.linkText}>{conectarWhatsAppUrl}</Text>
          </TouchableOpacity>
          <View style={styles.button}>
            <Button title="Copiar link" onPress={copyToClipboard}/>
          </View>
        </View>
      ) : (
        // Exibindo as opções de Níveis caso o usuário esteja conectado
        <>
          {niveis.map((nivel) => (
            <View style={styles.button} key={nivel}>
              <Button
                key={nivel}
                title={`Ver ${nivel}`}
                onPress={() => navigateToNivel(nivel)}
              />
            </View>
          ))}

          {/* Opções de Histórico e Configurações */}
          <View style={styles.button}>
            <Button title="Histórico" onPress={navigateToHistorico} />
          </View>
          <View style={styles.button}>
            <Button title="Configurações" onPress={navigateToConfiguracoes} />
          </View>
        </>
      )}

      {/* Botão para sair */}
      <View style={styles.button}>
        <Button title="Sair" onPress={() => navigation.navigate('Login')} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  button: {
    margin: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  alertContainer: {
    backgroundColor: '#fff4e5',
    borderWidth: 1,
    borderColor: '#ffcc00',
    padding: 15,
    borderRadius: 5,
    marginBottom: 20,
  },
  alertText: {
    fontSize: 16,
    marginBottom: 10,
    color: '#663300',
  },
  linkText: {
    fontSize: 16,
    color: '#007BFF',
    textDecorationLine: 'underline',
  },
});

export default Menu;
