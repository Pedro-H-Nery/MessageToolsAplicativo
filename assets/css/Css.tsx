import { StyleSheet } from 'react-native';

const css = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center'
    },
    tabela:{
      justifyContent: 'center',
      padding: 10
    },
    linha:{
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-around',
      padding: 10
    },
    tituloTabela:{
      fontSize: 20,
      fontWeight: 'bold',
    },
    linhaTabela:{
      flexDirection: "row",
      alignItems: 'center',
    },
    nome:{
      padding: 10,
      width: "60%"
    },
    opcoes:{
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-around',
      width: "40%",
    },
    contatos: {
      flex: 1,
      flexDirection: "row",
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 50
    },
    historico: {
      flex: 1,
      flexDirection: "row",
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      margin: 5,
    },
    textoLinha:{
      margin: 5
    },
    botaoRecarregar:{
      margin: 5,
      padding: 5,
      backgroundColor: "#FFB266"
    },
    botaoConversar:{
      margin: 5,
      padding: 5,
      backgroundColor: "#66B2FF"
    },
    botaoResolver:{
      margin: 5,
      padding: 5,
      backgroundColor: "#33FF33"
    },
    botaoVoltar:{
      margin: 5,
      padding: 5,
      backgroundColor: "#FFFF66"
    }
});

export {css};
   